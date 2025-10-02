package handler

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type TowTruckTypesHandler interface {
	Create(c echo.Context) error
	GetList(c echo.Context) error
	GetListData(c echo.Context) error
	Update(c echo.Context) error
}

type towTruckTypesHandler struct {
	towTruckTypeUsecases usecases.TowTruckTypesUsecase
}

func NewCraneTypesHandler(towTruckTypeUsecases usecases.TowTruckTypesUsecase) TowTruckTypesHandler {
	return &towTruckTypesHandler{
		towTruckTypeUsecases,
	}
}

func (h *towTruckTypesHandler) Create(c echo.Context) error {
	reqBody := new(entities.TowTruckType)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.towTruckTypeUsecases.Create(reqBody)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Created(c)
}

func (vh *towTruckTypesHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	craneTypes, err := vh.towTruckTypeUsecases.GetAll(lang)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List towTruckTypes", craneTypes)
}

func (vh *towTruckTypesHandler) GetListData(c echo.Context) error {
	lang := c.Get("lang").(string)
	craneTypes, err := vh.towTruckTypeUsecases.GetAll(lang)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List crane types", craneTypes)
}

func (h *towTruckTypesHandler) Update(c echo.Context) error {
	towTruckType := new(entities.TowTruckType)

	if err := c.Bind(&towTruckType); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	idStr := c.Param("id")

	id, errParse := uuid.Parse(idStr)
	if errParse != nil {
		return responses.InternalServerError(c, errParse.Error())
	}
	towTruckType.ID = id

	err := h.towTruckTypeUsecases.Update(towTruckType)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Updated(c)
}
