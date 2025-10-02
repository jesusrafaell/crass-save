package handler

import (
	"fmt"
	"io"
	"log"
	"os"
	"strconv"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type TowTruckHandler interface {
	CreateByUser(c echo.Context) error
	GetListByUser(c echo.Context) error
	GetList(c echo.Context) error
	Update(c echo.Context) error
	Delete(c echo.Context) error
	Activate(c echo.Context) error
	GetListByCompany(c echo.Context) error
	CreateByCompany(c echo.Context) error
	UpdateDriver(c echo.Context) error
	AddExpenseTT(c echo.Context) error
	GetHistoryExpenseByTTId(c echo.Context) error
	GetHistoryByCompany(c echo.Context) error
	// RegisterFromXLSX(c echo.Context) error
}

type towTruckHandler struct {
	towTruckUsecase usecases.TowTruckUsecase
}

func NewTowTruckHandler(towTruckUsecase usecases.TowTruckUsecase) TowTruckHandler {
	return &towTruckHandler{
		towTruckUsecase: towTruckUsecase,
	}
}

func (h *towTruckHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	req := new(models.CreateTowTruck)

	userId, _ := uuid.Parse(userIdStr)
	req.UserID = &userId
	// transform
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if errCustom := h.towTruckUsecase.Create(c.Request().Context(), req); errCustom != nil {
		return responses.CodeError(c, errCustom)
	}

	return responses.Created(c)
}

func (h *towTruckHandler) GetListByUser(c echo.Context) error {
	// lang := c.Get("lang").(string)
	// user_Id := c.Get("userId").(string)
	// userID, err := uuid.Parse(user_Id)
	// if err != nil {
	// 	return responses.BadRequest(c, err.Error())
	// }
	res, errc := h.towTruckUsecase.GetByUserID(c.Request().Context())
	if errc != nil {
		return responses.CodeError(c, errc)
	}
	return responses.Success(c, "List TowTrucks", res)
}

func (h *towTruckHandler) GetList(c echo.Context) error {
	// lang := c.Get("lang").(string)
	res, err := h.towTruckUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List TowTrucks", res)
}

func (h *towTruckHandler) Update(c echo.Context) error {
	req := new(models.UpdateTowTruck)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	towTruckId, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	req.ID = towTruckId

	if err := h.towTruckUsecase.Update(c.Request().Context(), req); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Updated(c)
}

func (h *towTruckHandler) Delete(c echo.Context) error {
	towTruckId, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	if err := h.towTruckUsecase.Delete(c.Request().Context(), towTruckId); err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "TowTruck Deleted", c.Param("id"))
}

func (h *towTruckHandler) Activate(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	towTruckId, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	if err := h.towTruckUsecase.Activate(c.Request().Context(), userId, towTruckId); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "TowTruck Updated")
}

func (h *towTruckHandler) GetListByCompany(c echo.Context) error {
	// lang := c.Get("lang").(string)
	companyIdStr := c.Param("id")
	companyId, err := uuid.Parse(companyIdStr)
	if err != nil {
		return responses.BadRequest(c, "company not found")
	}

	res, err := h.towTruckUsecase.GetAllByCompanyId(c.Request().Context(), companyId)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List TowTrucks company", res)
}

func (h *towTruckHandler) CreateByCompany(c echo.Context) error {
	req := new(models.CreateTowTruck)
	// transform
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if err := h.towTruckUsecase.Create(c.Request().Context(), req); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Created(c)
}

func (h *towTruckHandler) UpdateDriver(c echo.Context) error {
	req := new(models.UpdateTowTruck)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if req.DriverId == nil && req.RemoveDriver == nil {
		return responses.CodeError(c, &apierrors.DriverNotFound)
	}
	if req.ID == (uuid.UUID{}) {
		return responses.CodeError(c, &apierrors.TowtruckNotFound)
	}

	if err := h.towTruckUsecase.Update(c.Request().Context(), req); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "TowTruck Updated")
}

func (h *towTruckHandler) RegisterFromXLSX(c echo.Context) error {
	companyIdStr := c.Param("id")
	companyId, err := uuid.Parse(companyIdStr)
	if err != nil {
		return responses.BadRequest(c, "company not found")
	}
	// Obtiene el archivo del formulario

	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("Error RegisterFromXLSX.formfile %v", err)
		return responses.BadRequest(c, "invalid file")
	}

	// Abrir el archivo
	src, err := file.Open()
	if err != nil {
		log.Printf("Error RegisterFromXLSX.open %v", err)
		return responses.BadRequest(c, "invalid file")
	}
	defer src.Close()

	// Guardar el archivo temporalmente
	dst, err := os.Create(fmt.Sprintf("./files/%s", file.Filename))
	if err != nil {
		log.Printf("Error RegisterFromXLSX.Create %v", err)
		return responses.BadRequest(c, "invalid file")
	}
	defer dst.Close()

	// Copiar el archivo al destino
	if _, err = io.Copy(dst, src); err != nil {
		log.Printf("Error RegisterFromXLSX.copy %v", err)
		return err
	}

	listErrors, errC := h.towTruckUsecase.RegisterFromFile(c.Request().Context(), companyId, dst)
	if errC != nil {
		return responses.CodeError(c, errC)
	}

	return responses.Success(c, "driver registered, data = lista de errores", listErrors)
}

func (h *towTruckHandler) AddExpenseTT(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	req := new(models.AddExpenseTowTruckRequest)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return responses.BadRequest(c, "user not found")
	}

	req.UserID = userId
	// transform
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if err := h.towTruckUsecase.AddExpenseHistory(c.Request().Context(), req); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Created(c)
}

func (h *towTruckHandler) GetHistoryExpenseByTTId(c echo.Context) error {
	ttIdStr := c.Param("id")
	towTruckId, err := uuid.Parse(ttIdStr)
	if err != nil {
		return responses.BadRequest(c, "towTruck not found")
	}

	var expenseType *uint
	if typeParm := c.QueryParam("type"); typeParm != "" {
		parsedType, err := strconv.ParseUint(typeParm, 10, 32)
		if err != nil {
			return responses.BadRequest(c, "Invalid type parameter")
		}
		convertedType := uint(parsedType)
		//  if *expenseType == 1 || *expenseType == 2 || *expenseType == 3
		expenseType = &convertedType
	}

	res, errCustom := h.towTruckUsecase.GetExpenseHistoryByTTId(c.Request().Context(), towTruckId, expenseType)
	if errCustom != nil {
		return responses.CodeError(c, errCustom)
	}
	return responses.Success(c, "List expense history", res)
}

func (h *towTruckHandler) GetHistoryByCompany(c echo.Context) error {
	companyIdStr := c.Param("id")
	companyId, err := uuid.Parse(companyIdStr)
	if err != nil {
		return responses.BadRequest(c, "company not found")
	}

	res, errCustom := h.towTruckUsecase.GetExpenseHistoryByCompanyId(c.Request().Context(), companyId)
	if errCustom != nil {
		return responses.CodeError(c, errCustom)
	}
	return responses.Success(c, "List expense history by company ", res)
}
