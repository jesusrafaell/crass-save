package usecases

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	companyModel "bitbucket.org/mya/mya-assistance-core/internal/company/models"
	companyRepository "bitbucket.org/mya/mya-assistance-core/internal/company/repositories"
	insuranceRepository "bitbucket.org/mya/mya-assistance-core/internal/insurance/repositories"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"

	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
)

type towTruckUsecaseImpl struct {
	towTruckRepository repositories.TowTruckRepository
	companyRepo        companyRepository.CompanyRepository
	insuranceRepo      insuranceRepository.InsuranceRepository
}

func NewTowTruckUsecaseImpl(
	towTruckRepository repositories.TowTruckRepository,
	companyRepo companyRepository.CompanyRepository,
	insuranceRepo insuranceRepository.InsuranceRepository,
) TowTruckUsecase {
	return &towTruckUsecaseImpl{
		towTruckRepository: towTruckRepository,
		companyRepo:        companyRepo,
		insuranceRepo:      insuranceRepo,
	}
}

func (u *towTruckUsecaseImpl) Create(ctx context.Context, req *models.CreateTowTruck) *apierrors.CustomError {
	errapi := u.validateRequest(req)
	if errapi != nil {
		log.Printf("Error TowTruck.Create(validate) %v", errapi.Name)
		return errapi
	}

	var company *companyModel.Company
	var err error
	if req.CompanyId != nil {
		company, err = u.companyRepo.GetByID(*req.CompanyId)
	} else {
		company, err = u.companyRepo.GetByKey(1)
	}

	if err != nil {
		return &apierrors.CompanyNotFound
	}

	if req.InsuranceID == nil {
		insurance, err := u.insuranceRepo.GetByKey(1)
		if err != nil {
			return &apierrors.InsuranceNotFound
		}
		req.InsuranceID = &insurance.ID
	}

	newTruck := entities.TowTruck{
		Year:             req.Year,
		LicensePlate:     req.LicensePlate,
		PolicyNumber:     req.PolicyNumber,
		ImagePath:        req.ImagePath,
		CompanyID:        company.ID,
		DriverID:         req.UserID,
		Active:           false,
		MakeID:           req.MakeID,
		TypeID:           req.TypeId,
		WeightID:         req.WeightID,
		EngineTypeID:     req.EngineTypeID,
		ColorID:          req.ColorID,
		InsuranceID:      *req.InsuranceID,
		DriveTrainTypeID: req.DriveTrainTypeID,
		CountryID:        req.CountryID,
	}

	if err := u.towTruckRepository.Create(&newTruck); err != nil {
		return err
	}
	return nil
}

func (u *towTruckUsecaseImpl) GetAll(ctx context.Context) (*[]models.TowTruck, error) {
	lang := utils.GetLang(ctx)
	towTrucks, err := u.towTruckRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}
	return towTrucks, nil
}

func (u *towTruckUsecaseImpl) GetByID(ctx context.Context, towTruckID uuid.UUID) (*entities.TowTruck, error) {
	return u.towTruckRepository.GetByID(towTruckID)
}

func (u *towTruckUsecaseImpl) Delete(ctx context.Context, id uuid.UUID) *apierrors.CustomError {
	err, removed := u.towTruckRepository.Delete(id)
	if err != nil {
		log.Printf("Error towTruckUsecaseImpl.Delete: %v", err)
		return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
	}
	if !removed {
		return &apierrors.TowtruckNotFound
	}
	return nil
}

func (u *towTruckUsecaseImpl) GetByUserID(ctx context.Context) (*[]models.TowTruck, *apierrors.CustomError) {
	dataContext, err := utils.GetDataContext(ctx)
	if err != nil {
		return nil, &apierrors.ErrorServer
	}
	towTrucks, err := u.towTruckRepository.GetByUserID(dataContext.Lang, dataContext.UserID)
	if err != nil {
		return nil, &apierrors.TowtruckNotFound
	}
	return towTrucks, nil
}

// create table userxtowtruck
func (u *towTruckUsecaseImpl) GetOneByUserID(ctx context.Context, userID uuid.UUID) (*models.TowTruck, error) {
	lang := utils.GetLang(ctx)
	truck, err := u.towTruckRepository.GetOneByUserID(lang, userID)
	if err != nil {
		return nil, err
	}
	return truck, nil
}

func (u *towTruckUsecaseImpl) existLicensePlate(licensePlate string) (*entities.TowTruck, error) {
	towTruck, err := u.towTruckRepository.GetByLicensePlate(licensePlate)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}
	return towTruck, nil
}

func (u *towTruckUsecaseImpl) existInsuranceAndPolicyNumber(insuranceID uuid.UUID, policyNumber string) *apierrors.CustomError {
	towTruck, err := u.towTruckRepository.GetByInsuranceAndPolicyNumber(insuranceID, policyNumber)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
	}
	if towTruck != nil {
		return &apierrors.ExistPolicyNumber
	}
	return nil
}

func (u *towTruckUsecaseImpl) validateRequest(req *models.CreateTowTruck) *apierrors.CustomError {
	// Channle erros
	errorsChan := make(chan *apierrors.CustomError, 2)

	currentYear := time.Now().Year()
	if req.Year < 1700 || req.Year > uint(currentYear+1) {
		return &apierrors.InvalidYear
	}

	// Goroutine regexp
	go func() {
		req.LicensePlate = strings.TrimSpace(req.LicensePlate)
		if !regexp.MustCompile("^[a-zA-Z0-9-]{6,}$").MatchString(req.LicensePlate) {
			errorsChan <- &apierrors.InvalidLicensePlate
			return
		}

		v, err := u.existLicensePlate(req.LicensePlate)
		if err != nil {
			errorsChan <- &apierrors.ErrorServer
			return
		}
		if v != nil {
			errorsChan <- &apierrors.ExistLicensePlate
			return
		}

		errorsChan <- nil
	}()

	// Goroutine db
	go func() {
		if req.PolicyNumber != nil && *req.PolicyNumber != "" {
			policyNumber := strings.TrimSpace(*req.PolicyNumber)
			req.PolicyNumber = &policyNumber
			if !regexp.MustCompile("^[a-zA-Z0-9]+$").MatchString(policyNumber) || len(policyNumber) < 3 {
				errorsChan <- &apierrors.InvalidPolicyNumber
				return
			}
			if err := u.existInsuranceAndPolicyNumber(*req.InsuranceID, policyNumber); err != nil {
				errorsChan <- &apierrors.ExistPolicyNumber
				return
			}
		}
		errorsChan <- nil
	}()

	for i := 0; i < 2; i++ {
		err := <-errorsChan
		if err != nil {
			return err
		}
	}

	return nil
}

func (u *towTruckUsecaseImpl) Activate(ctx context.Context, userId uuid.UUID, towTruckId uuid.UUID) *apierrors.CustomError {
	//inactive others and remove driverId
	// find tt.driver_id = userId -> active = false

	//active
	//update
	active := true
	err := u.Update(ctx, &models.UpdateTowTruck{
		ID:       towTruckId,
		DriverId: &userId,
		Active:   &active,
	})

	if err != nil {
		log.Printf("Error TowTruck(Services).activate %v", err)
		return &apierrors.InvalidRequest
	}

	return nil
}

func (u *towTruckUsecaseImpl) GetAllByCompanyId(ctx context.Context, companyId uuid.UUID) (*[]models.TowTruck, error) {
	lang := utils.GetLang(ctx)
	towTrucks, err := u.towTruckRepository.GetAllByCompanyId(lang, companyId)
	if err != nil {
		return nil, err
	}
	return towTrucks, nil
}

func (u *towTruckUsecaseImpl) RegisterFromFile(ctx context.Context, companyId uuid.UUID, dst *os.File) (*[]models.ErrorListTowTruck, *apierrors.CustomError) {
	// Leer el archivo Excel
	f, err := excelize.OpenFile(dst.Name())
	if err != nil {
		log.Printf("Error RegisterFromFile(OpenFile) %v", err)
		return nil, &apierrors.InvalidRequest
	}

	// Obtener todas las hojas del archivo
	sheetNames := f.GetSheetMap()
	if len(sheetNames) == 0 {
		log.Printf("Error RegisterFromFile: No sheets found in the Excel file")
		return nil, &apierrors.InvalidRequest
	}

	// Obtener el nombre de la primera hoja
	firstSheetName := sheetNames[1]

	// Obtener todas las filas de la primera hoja
	rows, err := f.GetRows(firstSheetName)
	if err != nil {
		log.Printf("Error RegisterFromFile(GetRows) %v", err)
		return nil, &apierrors.InvalidRequest
	}

	// default data
	// var towTruk types.TowTruckRequest
	// towTruck.CompanyId = &companyId

	var listError []models.ErrorListTowTruck

	for i, row := range rows {
		if i == 0 {
			continue
		}
		if len(row) >= 6 {
			fmt.Println("LicensePlate:", row[0])
			fmt.Println("Year:		  ", row[1])
			fmt.Println("Make:		  ", row[2])
			fmt.Println("EngineType:  ", row[3])
			fmt.Println("Color:       ", row[4])
			fmt.Println("DriveTrain:  ", row[5])
			fmt.Println("CraneType:   ", row[6])
			//op
			fmt.Println("Insurance:", row[7])
			// fmt.Println("Weight:", row[6])
			// fmt.Println("CountryID:", row[4])
			fmt.Println("--------------")

			// driver.FirstName = row[0]
			// driver.LastName = row[1]
			// driver.Email = row[2]
			// driver.Mobile = row[3]
			// errDriver := s.RegisterDriver(&driver)
			// if errDriver != nil {
			// log.Printf("Error RegisterFromfile.RegisterDriver %v", errDriver)
			// add to list return err
			// 	listError = append(listError, types.ErrorListDriver{
			// 		Email: driver.Email,
			// 		Error: *errDriver,
			// 	})
			// }
		}
	}

	// fmt.Println("Error Driver:")
	// for _, d := range listError {
	// 	fmt.Println("Email:", d.Email)
	// 	fmt.Println("Code:", d.Error.Code)
	// 	fmt.Println("Motivo:", d.Error.Name)
	// }

	return &listError, nil
}

func (s *towTruckUsecaseImpl) AddExpenseHistory(ctx context.Context, req *models.AddExpenseTowTruckRequest) *apierrors.CustomError {
	expense := entities.TowTruckExpenseHistory{
		UserId:            req.UserID,
		TowTruckId:        req.TowTruckId,
		CompanyId:         req.CompanyId,
		Amount:            req.Amount,
		CoinId:            req.CoinId,
		UnixDate:          req.UnixDate,
		FuelLiters:        req.FuelLiters,
		RepairDescription: req.RepairDescription,
		ExpenseType:       req.ExpenseType,
	}

	if err := s.towTruckRepository.CreateExpenseHistory(&expense); err != nil {
		return err
	}
	return nil
}

func (s *towTruckUsecaseImpl) GetExpenseHistoryByTTId(ctx context.Context, ttId uuid.UUID, expenseType *uint) ([]entities.TowTruckExpenseHistory, *apierrors.CustomError) {
	histories, err := s.towTruckRepository.GetExpenseHistoryByTTId(ttId, expenseType)
	if err != nil {
		log.Printf("Error towTruckService.GetExpenseHistoryByTTId: %v", err)
		return nil, &apierrors.TowtruckNotFound
	}
	return *histories, nil
}

func (s *towTruckUsecaseImpl) GetExpenseHistoryByCompanyId(ctx context.Context, companyId uuid.UUID) ([]entities.TowTruckExpenseHistory, *apierrors.CustomError) {
	histories, err := s.towTruckRepository.GetExpenseHistoryByCompanyId(companyId)
	if err != nil {
		return nil, &apierrors.TowtruckNotFound
	}
	return *histories, nil
}
