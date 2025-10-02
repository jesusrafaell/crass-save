package auth

import (
	"appassistence/auth/data"
	"appassistence/auth/errs"
	"appassistence/auth/pkg/roles"
	"appassistence/auth/pkg/users"
	"appassistence/auth/pkg/utility"
	"fmt"
	"log"
	"os"

	"github.com/google/uuid"
	"github.com/xuri/excelize/v2"
)

func (s *AuthService) Register(lang string, req *RegisterUser) *errs.CustomError {

	imgUUID := uuid.New()

	photoAWS, docAWS := true, true

	photoUrl, err := s.s3.GenerateNewURL(req.Photo, imgUUID)
	if err != nil {
		photoUrl = req.Photo
		photoAWS = false
	}
	documentUrl, err := s.s3.GenerateNewURL(req.Identification.Path, imgUUID)
	if err != nil {
		documentUrl = req.Photo
		docAWS = false
	}

	fmt.Println("A1:", req.Photo)
	fmt.Println("I1:", req.Identification.Path)

	_, tokenUUID, errC := s.users.CreateUser(lang, users.CreateUser{
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  req.Password,
		Mobile:    req.Mobile,
		UTC:       req.UTC,
		Photo:     photoUrl,
		Identification: users.IdentityDocuments{
			DocumentTypeKey: &req.Identification.Key,
			Path:            documentUrl,
			DocumentNumber:  req.Identification.DocumentNumber,
		},
	})
	if errC != nil {
		return errC
	}

	// str := ""
	// tokenUUID := &str

	log.Println("User created")
	link := fmt.Sprintf(`%[1]s/verify/%[2]s`, s.mail.SupportURL, *tokenUUID)
	bodyEmail := utility.GetTemplateByParams(&utility.TemplateParams{
		Title: "Saludos,",
		Desc:  "Para verificar tu cuenta, haz click en el siguiente botón",
		Button: utility.Button{
			Ref:   link,
			Label: "Verificar cuenta",
		},
	})

	err = s.mail.SendMail(req.Email, "Verificación de Email - Mya", bodyEmail)
	if err != nil {
		return &errs.ErrorServer
	}

	//uploadimg
	if photoAWS {
		_, err := s.s3.MoveTempToFileHttp(req.Photo, imgUUID)
		fmt.Println("A2:", photoUrl)
		if err != nil {
			log.Printf("register photo MoveTempToFileHttp %v", err)
		}
	}

	if docAWS {
		_, err := s.s3.MoveTempToFileHttp(req.Identification.Path, imgUUID)
		fmt.Println("I2:", documentUrl)
		if err != nil {
			log.Printf("register doc MoveTempToFileHttp %v", err)
		}
	}

	return nil
}

func (s *AuthService) DeleteAccount(userId uuid.UUID) *errs.CustomError {
	//valid email, mobile
	err := s.users.DeleteDataUserByID(userId)
	if err != nil {
		log.Printf("Error: Account(DeleteAccount,users.DeleteUserByID): %v", err)
		return &errs.UserNotFound
	}
	err = s.users.DeleteLocationByUserID(userId)
	if err != nil {
		log.Printf("Error: Account(DeleteAccount,userLocation.DeleteByUserID): %v", err)
		return &errs.UserNotFound
	}
	//with data identify use for delete ident

	return nil
}

func (s *AuthService) RegisterDriver(req *RegisterDriver) *errs.CustomError {
	roleDriver := roles.RoleKeyDriver
	_, tokenUUID, errC := s.users.CreateUser("en", users.CreateUser{
		CompanyID: &req.CompanyId,

		Role:      &roleDriver,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  "",
		Mobile:    req.Mobile,
		UTC:       req.UTC,
		Photo:     req.Photo,
		Identification: users.IdentityDocuments{
			DocumentTypeKey: &req.Identification.Key,
			Path:            req.Identification.Path,
			DocumentNumber:  req.Identification.DocumentNumber,
		},
	})
	if errC != nil {
		return errC
	}
	//aqui
	link := fmt.Sprintf(`%[1]s/verify/info/%[2]s`, s.mail.SupportURL, *tokenUUID)
	bodyEmail := utility.GetTemplateByParams(&utility.TemplateParams{
		Title: "Saludos,",
		Desc:  "Para verificar tu cuenta, haz click en el siguiente botón",
		Button: utility.Button{
			Ref:   link,
			Label: "Verificar cuenta",
		},
	})

	err := s.mail.SendMail(req.Email, "Verificación de Email (Info) - Mya", bodyEmail)
	if err != nil {
		return &errs.ErrorServer
	}

	return nil
}

func (s *AuthService) RegisterAdmin(req *RegisterAdmin) *errs.CustomError {
	roleDriver := roles.RoleKeyAdmin
	_, tokenUUID, errC := s.users.CreateUser("en", users.CreateUser{
		Role: &roleDriver,
	})
	if errC != nil {
		return errC
	}
	//aqui
	link := fmt.Sprintf(`%[1]s/verify/info/%[2]s`, s.mail.SupportURL, *tokenUUID)
	bodyEmail := utility.GetTemplateByParams(&utility.TemplateParams{
		Title: "Saludos,",
		Desc:  "Para verificar tu cuenta, haz click en el siguiente botón",
		Button: utility.Button{
			Ref:   link,
			Label: "Verificar cuenta",
		},
	})

	err := s.mail.SendMail(req.Email, "Verificación de Email (Info) - Mya", bodyEmail)
	if err != nil {
		return &errs.ErrorServer
	}
	return nil
}

func (s *AuthService) RegisterFromFile(companyId uuid.UUID, dst *os.File) (*[]ErrorListDriver, *errs.CustomError) {
	// Leer el archivo Excel
	f, err := excelize.OpenFile(dst.Name())
	if err != nil {
		log.Printf("Error RegisterFromFile(OpenFile) %v", err)
		return nil, &errs.InvalidRequest
	}

	// Obtener todas las hojas del archivo
	sheetNames := f.GetSheetMap()
	if len(sheetNames) == 0 {
		log.Printf("Error RegisterFromFile: No sheets found in the Excel file")
		return nil, &errs.InvalidRequest
	}

	// Obtener el nombre de la primera hoja
	firstSheetName := sheetNames[1]

	// Obtener todas las filas de la primera hoja
	rows, err := f.GetRows(firstSheetName)
	if err != nil {
		log.Printf("Error RegisterFromFile(GetRows) %v", err)
		return nil, &errs.InvalidRequest
	}

	// default data
	var driver RegisterDriver
	driver.CompanyId = companyId
	driver.Identification = Identification{
		Key:  1,
		Path: "",
	}
	driver.Photo = "base"
	driver.UTC = "Colombia/Bogota"

	var listError []ErrorListDriver

	// var users []User
	for i, row := range rows {
		if i == 0 {
			continue
		}
		if len(row) >= 4 {
			// fmt.Println("FirstName:", row[0])
			// fmt.Println("LastName:", row[1])
			// fmt.Println("Email:", row[2])
			// fmt.Println("Mobile:", row[3])
			// fmt.Println("--------------")

			driver.FirstName = row[0]
			driver.LastName = row[1]
			driver.Email = row[2]
			driver.Mobile = row[3]
			errDriver := s.RegisterDriver(&driver)
			if errDriver != nil {
				// log.Printf("Error RegisterFromfile.RegisterDriver %v", errDriver)
				// add to list return err
				listError = append(listError, ErrorListDriver{
					Email: driver.Email,
					Error: *errDriver,
				})
			}
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

func (s *AuthService) RemoveAccountCompany(userId uuid.UUID) *errs.CustomError {
	user, err := s.users.GetByID(userId, nil)
	if err != nil {
		return &errs.UserNotFound
	}

	baseUUID := uuid.UUID{}
	status := data.StatusSuspendedKey
	online := false
	userRoleKey := uint64(1)
	driverRoleKey := uint64(3)
	//remove drvier rol
	errReq := s.users.Update(userId, &users.UserUpdate{
		CompanyId:     &baseUUID,
		Status:        &status,
		Online:        &online,
		DriverMode:    nil,
		CurrentRole:   &userRoleKey,
		RemoveRoleKey: &driverRoleKey,
	})
	if errReq != nil {
		return errReq
	}
	//after remove close session
	if user.Online {
		errA := s.authorization.DeleteSession(userId.String())
		//notificar
		if errA == nil {
			// log.Printf("Closed preSession userId:%s", userId)
			if user.FcmToken != nil {
				log.Printf("Notification close session userId:%s", userId)
				s.users.NotificationLogout(*user.FcmToken)
			}
		}
	}

	return nil
}
