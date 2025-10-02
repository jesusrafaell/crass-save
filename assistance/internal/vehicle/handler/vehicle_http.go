package handler

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/models"
	"bitbucket.org/mya/mya-assistance-core/internal/vehicle/usecases"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type vehicleHandler struct {
	vehicleUseCase usecases.VehicleUsecase
	validator      *validator.Validate
}

func NewVehicleHandler(vehicleUseCase usecases.VehicleUsecase) VehicleHandler {
	return &vehicleHandler{
		vehicleUseCase: vehicleUseCase,
		validator:      validator.New(),
	}
}

func (h *vehicleHandler) GetVehiclesByUser(c echo.Context) error {
	// lang := c.Get("lang").(string)
	// userIdStr := c.Get("userId").(string)
	// UserID, err := uuid.Parse(userIdStr)
	// if err != nil {
	// 	return responses.BadRequest(c, err.Error())
	// }

	vehicles, err := h.vehicleUseCase.GetByUserId(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Vehicle", vehicles)
}

func (h *vehicleHandler) GetAll(c echo.Context) error {
	// lang := c.Get("lang").(string)
	vehicles, err := h.vehicleUseCase.GetVehicles(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "List Vehicle", vehicles)
}

func (h *vehicleHandler) GetById(c echo.Context) error {
	id, errUUID := uuid.Parse(c.Param("id"))
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}
	vehicles, err := h.vehicleUseCase.GetByID(c.Request().Context(), id)
	if err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "Vehicle", vehicles)
}

func (h *vehicleHandler) Update(c echo.Context) error {
	reqBody := new(models.UpdateVehicle)
	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	reqBody.ID = id

	if err := h.vehicleUseCase.Update(c.Request().Context(), reqBody); err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Updated(c)
}

func (h *vehicleHandler) Delete(c echo.Context) error {
	id := c.Param("id")
	if err := h.vehicleUseCase.Delete(c.Request().Context(), id); err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "Vehicle Deleted", c.Param("id"))
}

func (h *vehicleHandler) Create(c echo.Context) error {
	reqBody := new(models.AddVehicle)
	// var req types.VehicleRequest

	// transform
	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
		// return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	// validator
	if err := h.validator.Struct(reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
		// return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	userId := c.Get("userId").(uuid.UUID)

	reqBody.UserID = userId

	if _, errCustom := h.vehicleUseCase.Create(c.Request().Context(), reqBody); errCustom != nil {
		return responses.CodeError(c, errCustom)
	}

	return responses.Created(c)
}

// new
func (h *vehicleHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	reqBody := new(models.AddVehicle)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return responses.InternalServerError(c, "Invalid User ID format")
	}

	reqBody.UserID = userId

	// transform
	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, "Error binding request: "+err.Error())
	}

	if err := h.validator.Struct(reqBody); err != nil {
		return responses.InternalServerError(c, "Validation error: "+err.Error())
	}

	if _, errCustom := h.vehicleUseCase.Create(c.Request().Context(), reqBody); errCustom != nil {
		return responses.CodeError(c, errCustom)
	}

	return responses.Created(c)
}
