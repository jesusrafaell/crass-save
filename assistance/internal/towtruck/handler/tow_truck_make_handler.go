package handler

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/models"
	"bitbucket.org/mya/mya-assistance-core/internal/towtruck/usecases"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type TowTruckMakeHandler interface {
	Create(c echo.Context) error
	GetAll(c echo.Context) error
	GetListData(c echo.Context) error
	Update(c echo.Context) error
}

type towTruckMakeHandler struct {
	towTruckUsecase usecases.TowTruckMakesUsecase
}

func NewTowTruckMakeHandler(towTruckUsecase usecases.TowTruckMakesUsecase) TowTruckMakeHandler {
	return &towTruckMakeHandler{
		towTruckUsecase,
	}
}

func (h *towTruckMakeHandler) Create(c echo.Context) error {
	req := new(models.TowTruckMake)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.towTruckUsecase.Create(req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Created(c)
}

func (h *towTruckMakeHandler) GetAll(c echo.Context) error {
	makes, err := h.towTruckUsecase.GetAll()
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Makes", makes)
}

func (h *towTruckMakeHandler) GetListData(c echo.Context) error {
	makes, err := h.towTruckUsecase.GetAll()
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Makes", makes)
}

func (h *towTruckMakeHandler) Update(c echo.Context) error {
	reqBody := new(models.TowTruckMake)
	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	idStr := c.Param("id")

	id, errParse := uuid.Parse(idStr)
	if errParse != nil {
		return responses.InternalServerError(c, errParse.Error())
	}

	if err := h.towTruckUsecase.Update(id, reqBody); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Updated(c)
}
