package handlers

import (
	"fmt"
	"strconv"

	"bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/assistance/usecases"

	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type assistanceHandler struct {
	assistanceService usecases.AssistanceUsecase
}

func NewAssistanceHandler(assistanceService usecases.AssistanceUsecase) AssistanceHandler {
	return &assistanceHandler{
		assistanceService: assistanceService,
	}
}

func (h *assistanceHandler) GetList(c echo.Context) error {
	params := new(models.ParamsRequestGet)
	if param := c.QueryParam("userId"); param != "" {
		tempUUID, errUUID := uuid.Parse(param)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		params.UserId = &tempUUID
	}

	if param := c.QueryParam("driverId"); param != "" {
		tempUUID, errUUID := uuid.Parse(param)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		params.DriverId = &tempUUID
	}

	if param := c.QueryParam("towTruckId"); param != "" {
		tempUUID, errUUID := uuid.Parse(param)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		params.TowTruckId = &tempUUID
	}

	if param := c.QueryParam("companyId"); param != "" {
		tempUUID, errUUID := uuid.Parse(param)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		params.CompanyId = &tempUUID
	}

	statusParam := c.QueryParam("status")
	if statusParam != "" {
		switch statusParam {
		case status.AcceptedKey, status.CancelledKey, status.CompletedKey, status.PendingKey:
			params.Status = &statusParam
		default:
			return responses.BadRequest(c, fmt.Errorf("invalid status value").Error())
		}
	}

	assitances, err := h.assistanceService.GetList(c.Request().Context(), params)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, fmt.Sprintf("List assistance %d", len(*assitances)), assitances)

}

func (h *assistanceHandler) GetById(c echo.Context) error {
	requestIdStr := c.Param("id")
	requestId, errParse := uuid.Parse(requestIdStr)
	if errParse != nil || requestIdStr == "" {
		return responses.BadRequest(c, "invalid company")
	}

	res, err := h.assistanceService.GetByIDWithDetails(c.Request().Context(), requestId)
	if err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "Request", res)

}

func (h *assistanceHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)

	req := new(models.CreateAssistance)

	// transform
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	userId, errUUID := uuid.Parse(userIdStr)
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}
	req.UserId = userId

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	assistanceResponse, err := h.assistanceService.Create(c.Request().Context(), req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Success(c, "Request Created", assistanceResponse)
}

func (h *assistanceHandler) GetByUser(c echo.Context) error {
	assistance, err := h.assistanceService.GetByUserID(c.Request().Context())
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Success(c, "By User", assistance)
}

func (h *assistanceHandler) GetByDriver(c echo.Context) error {
	assistance, err := h.assistanceService.GetByDriverID(c.Request().Context())
	if err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "Request by Driver", assistance)
}

func (h *assistanceHandler) GetDriverPending(c echo.Context) error {
	userIdStr := c.Get("userId").(string)

	userId, errUUID := uuid.Parse(userIdStr)
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}

	assitances, err := h.assistanceService.GetPendingByDriverID(c.Request().Context(), userId)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, fmt.Sprintf("List assistance Pedding %d", len(*assitances)), assitances)

}

func (h *assistanceHandler) Cancel(c echo.Context) error {
	req := new(models.CancelAssistance)

	userIdStr := c.Get("userId").(string)
	roleKeyStr := c.Get("roleKey").(string)

	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return responses.InternalServerError(c, err.Error())
	}
	req.UserID = userId

	roleKey, err := strconv.ParseUint(roleKeyStr, 10, 0)
	if err != nil {
		return responses.BadRequest(c, "Invalid roleKey")
	}

	req.RoleKey = uint(roleKey)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if err := h.assistanceService.Cancel(c.Request().Context(), req); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Request Cancelled")
}

func (h *assistanceHandler) DriverConfirmed(c echo.Context) error {
	companyKeyStr, ok := c.Get("companyKey").(string)
	if !ok {
		return responses.InternalServerError(c, "invalid company (H)")
	}

	userIdStr, ok := c.Get("userId").(string)
	if !ok {
		return responses.BadRequest(c, "invalid user (H)")
	}
	// Parsear valores de string a tipos específicos
	companyKeyUint, err := strconv.ParseUint(companyKeyStr, 10, 32)
	if err != nil {
		return responses.InternalServerError(c, "invalid company (H)")
	}
	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return responses.BadRequest(c, "invalid user (H)")
	}

	req := new(models.ConfirmedAssistance)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	req.CompanyKey = uint(companyKeyUint)
	req.DriverId = userId

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	assistence, errc := h.assistanceService.ConfirmedDriver(c.Request().Context(), req)
	if errc != nil {
		return responses.CodeError(c, errc)
	}

	return responses.Success(c, "Assistence Confirmed", assistence)
}

func (h *assistanceHandler) ChangeStatus(c echo.Context) error {
	req := new(models.UpdateStatusByDriver)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	userIdStr := c.Get("userId").(string)
	userId, errUUID := uuid.Parse(userIdStr)
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}

	req.DriverId = userId

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.assistanceService.UpdateByDriver(c.Request().Context(), req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Assistence status: "+req.StatusKey)
}

func (h *assistanceHandler) ConfirmedCompletedUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)

	req := new(models.CompletedStatus)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	userId, errUUID := uuid.Parse(userIdStr)
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}
	req.UserId = userId

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.assistanceService.UserCompleted(c.Request().Context(), req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Assistence user completed")
}

func (h *assistanceHandler) ConfirmedCompletedDriver(c echo.Context) error {
	userIdStr := c.Get("userId").(string)

	req := new(models.CompletedStatus)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	userId, errUUID := uuid.Parse(userIdStr)
	if errUUID != nil {
		return responses.BadRequest(c, errUUID.Error())
	}

	req.UserId = userId

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	err := h.assistanceService.DriverCompleted(c.Request().Context(), req)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Assistence user completed")
}

func (h *assistanceHandler) GetFilter(c echo.Context) error {
	var reqId *uuid.UUID
	var userId *uuid.UUID
	var driverId *uuid.UUID
	var errUUID error
	var tempUUID uuid.UUID //temp

	if reqParam := c.QueryParam("reqId"); reqParam != "" {
		tempUUID, errUUID = uuid.Parse(reqParam)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		reqId = &tempUUID
	}
	if userParam := c.QueryParam("userId"); userParam != "" {
		tempUUID, errUUID = uuid.Parse(userParam)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		userId = &tempUUID
	}
	if driverParam := c.QueryParam("driverId"); driverParam != "" {
		tempUUID, errUUID = uuid.Parse(driverParam)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		driverId = &tempUUID
	}
	res, err := h.assistanceService.GetByFilter(c.Request().Context(), reqId, userId, driverId)

	if err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "Request", res)
}

func (h *assistanceHandler) GetDashboardByCompanyId(c echo.Context) error {
	companyIdStr := c.Param("id")
	if companyIdStr == "" {
		return responses.BadRequest(c, "invalid company")
	}
	var companyId *uuid.UUID
	companyUUID, errParse := uuid.Parse(companyIdStr)
	if errParse != nil {
	} else {
		companyId = &companyUUID
	}

	res, err := h.assistanceService.GetDashboardDataByCompanyId(c.Request().Context(), companyId)
	if err != nil {
		return responses.CodeError(c, err)
	}
	return responses.Success(c, "Request by User", res)
}

func (h *assistanceHandler) GetListByCompanyId(c echo.Context) error {
	//add filter
	companyIdStr := c.Param("id")
	if companyIdStr == "" {
		return responses.BadRequest(c, "invalid company")
	}
	var companyId *uuid.UUID
	companyUUID, errParse := uuid.Parse(companyIdStr)
	if errParse != nil {
		// return responses.BadRequest(c, "invalid company")
	} else {
		companyId = &companyUUID
	}

	req := new(models.FilterDashboardRequest)
	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	// Verificar y asignar el valor a filter.Status si es válido

	statusParam := c.QueryParam("status")
	if statusParam != "" {
		switch statusParam {
		case status.AcceptedKey, status.CancelledKey, status.CompletedKey, status.PendingKey:
			req.Status = &statusParam
		default:
			return responses.BadRequest(c, fmt.Errorf("invalid status value").Error())
		}
	}

	res, err := h.assistanceService.GetAllByCompanyId(c.Request().Context(), companyId, req)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}
	return responses.Success(c, "Request", res)

}

// func (h *assistanceHandler) FindOptionsDrivers(c echo.Context) error {
// 	userIdStr := c.Get("userId").(string)

// 	req := new(models.CreateAssistance)

// 	// transform
// 	if err := c.Bind(&req); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	userId, errUUID := uuid.Parse(userIdStr)
// 	if errUUID != nil {
// 		return responses.BadRequest(c, errUUID.Error())
// 	}
// 	req.UserId = userId

// 	// validator
// 	validate := validator.New()
// 	if err := validate.Struct(req); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	assistanceResponse, err := h.assistanceService.FindOptionsDrivers(c.Request().Context(), req)
// 	if err != nil {
// 		return responses.CodeError(c, err)
// 	}

// 	return responses.Success(c, "List Drivers for Assistance", assistanceResponse)
// }
