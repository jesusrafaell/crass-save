package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/company/models"
	"bitbucket.org/mya/mya-assistance-core/internal/company/usecases"
	"bitbucket.org/mya/mya-assistance-core/internal/responses"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type CompanyHandler interface {
	Create(c echo.Context) error
	GetList(c echo.Context) error
	Update(c echo.Context) error
	GetListInfo(c echo.Context) error
}

type companyHandler struct {
	companyUsecase usecases.CompanyUsecase
}

func NewCompanyHandler(companyUsecase usecases.CompanyUsecase) CompanyHandler {
	return &companyHandler{
		companyUsecase: companyUsecase,
	}
}

func (h *companyHandler) Create(c echo.Context) error {
	reqBoby := new(models.CreateCompany)

	if err := c.Bind(&reqBoby); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(reqBoby); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.companyUsecase.Create(c.Request().Context(), reqBoby)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Created(c)
}

func (h *companyHandler) GetList(c echo.Context) error {
	res, err := h.companyUsecase.GetAll(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List companies", res)
}

func (h *companyHandler) Update(c echo.Context) error {
	reqBody := new(models.Company)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	idStr := c.Param("id")
	id, errParse := uuid.Parse(idStr)
	if errParse != nil {
		return responses.InternalServerError(c, errParse.Error())
	}

	err := h.companyUsecase.Update(c.Request().Context(), id, reqBody)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Updated(c)
}

func (h *companyHandler) GetListInfo(c echo.Context) error {
	res, err := h.companyUsecase.GetAllInfo(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List companies info", res)
}
