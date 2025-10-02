package handlers

import (
	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/models"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/usecases"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type WsHandler interface {
	Test(c echo.Context) error
	// vehcile
	GetVehicleMakes(c echo.Context) error
	GetVehicleModelsByMake(c echo.Context) error
	GetVehicleTypes(c echo.Context) error
	GetVehicleMakeModel(c echo.Context) error
	//request
	CreateAssistance(c echo.Context) error
	// GetOptionsRequest(c echo.Context) error
	GetAssistanceByMobile(c echo.Context) error
	CancelRequest(c echo.Context) error
	ConfirmedRequest(c echo.Context) error
	GetWsUser(c echo.Context) error
	GetWsVehicle(c echo.Context) error
}

type wsHandler struct {
	wsUsecase usecases.WSUsecase
}

func NewWsHandler(wsUsecase usecases.WSUsecase) WsHandler {
	return &wsHandler{
		wsUsecase: wsUsecase,
	}
}

func (h *wsHandler) Test(c echo.Context) error {
	reqBody := new(models.CreateWSAssistance)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	return responses.Success(c, "List Ws", reqBody)

}

func (h *wsHandler) GetVehicleMakes(c echo.Context) error {
	reqBody := new(models.WSVehicleMakeAndModel)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	makes, err := h.wsUsecase.GetVehicleMakeModel(c.Request().Context(), reqBody)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List Make Vehicle", makes)
}

func (h *wsHandler) GetVehicleModelsByMake(c echo.Context) error {
	req := new(models.WSVehicleMake)

	if err := c.Bind(&req); err != nil {
		return responses.InternalServerError(c, err.Error())
	}
	makes, err := h.wsUsecase.GetVehicleModelsByMake(c.Request().Context(), req.MakeName)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List Makes Vehicle", makes)
}

func (h *wsHandler) GetVehicleTypes(c echo.Context) error {
	list, err := h.wsUsecase.GetVehicleTypes(c.Request().Context())
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List types vehicles", list)
}

func (h *wsHandler) GetVehicleMakeModel(c echo.Context) error {
	reqBody := new(models.WSVehicleMakeAndModel)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	marmod, err := h.wsUsecase.GetVehicleMakeModel(c.Request().Context(), reqBody)
	if err != nil {
		return responses.BadRequest(c, err.Error())
	}

	return responses.Success(c, "List w Model & Make", marmod)

}

func (h *wsHandler) CreateAssistance(c echo.Context) error {
	reqBody := new(models.CreateWSAssistance)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}
	res, err := h.wsUsecase.CreateAssistance(c.Request().Context(), reqBody)
	if err != nil {
		return responses.CodeError(c, err)
	}

	return responses.Success(c, "created request", res)
}

// func (h *wsHandler) GetOptionsRequest(c echo.Context) error {
// 	lang := c.Get("lang").(string)
// 	reqBody := new(models.CreateWSAssistance)

// 	if err := c.Bind(&reqBody); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}
// 	res, err := h.wsUsecase.GetOptionsRequest(lang, reqBody)
// 	if err != nil {
// 		return responses.CodeError(c, err)
// 	}

// 	return responses.Success(c, "list prices", res)
// }

// func (h *wsHandler) GetAssistanceByMobileStr(c echo.Context) error {
// 	lang := c.Get("lang").(string)
// 	reqBody := new(models.GetByMobile)

// 	if err := c.Bind(&reqBody); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	// validator
// 	validate := validator.New()
// 	if err := validate.Struct(reqBody); err != nil {
// 		return responses.InternalServerError(c, err.Error())
// 	}

// 	if reqBody.Mobile == "" {
// 		return responses.BadRequest(c, "invalid mobile")
// 	}

// 	res, err := h.wsUsecase.GetAssistanceByMobileStr(lang, reqBody.Mobile)
// 	if err != nil {
// 		return responses.BadRequest(c, err.Error())
// 	}

// 	return responses.Success(c, "request by mobile", res)

// }

func (h *wsHandler) GetAssistanceByMobile(c echo.Context) error {
	parms := new(models.GetByMobile)

	if reqParam := c.QueryParam("req_id"); reqParam != "" {
		reqIdParse, errUUID := uuid.Parse(reqParam)
		if errUUID != nil {
			return responses.BadRequest(c, errUUID.Error())
		}
		parms.ReqID = &reqIdParse
	}
	parms.Mobile = c.QueryParam("from_number")

	res, errapi := h.wsUsecase.GetAssistanceByMobile(c.Request().Context(), parms)
	if errapi != nil {
		return responses.CodeError(c, errapi)
	}

	return responses.Success(c, "request by mobile", res)

}

func (h *wsHandler) CancelRequest(c echo.Context) error {
	reqBody := new(models.CancelAssistanceByWS)

	if err := c.Bind(&reqBody); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if err := h.wsUsecase.CancelRequest(c.Request().Context(), reqBody.ID, reqBody.Description); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Request Cancelled")
}

func (h *wsHandler) GetWsUser(c echo.Context) error {
	identDoc := c.QueryParam("identdoc")
	if identDoc == "" {
		return responses.BadRequest(c, "invalid identityDocument")
	}

	res, errapi := h.wsUsecase.GetDataUserWs(c.Request().Context(), identDoc)
	if errapi != nil {
		return responses.CodeError(c, errapi)
	}

	return responses.Success(c, "request by mobile", res)

}

func (h *wsHandler) GetWsVehicle(c echo.Context) error {
	licensePlate := c.QueryParam("licenseplate")
	if licensePlate == "" {
		return responses.BadRequest(c, "invalid licenseplate")
	}

	res, errapi := h.wsUsecase.GetDataVehicleWs(c.Request().Context(), licensePlate)
	if errapi != nil {
		return responses.CodeError(c, errapi)
	}

	return responses.Success(c, "request by mobile", res)

}

func (h *wsHandler) ConfirmedRequest(c echo.Context) error {
	body := new(models.ConfirmedRequest)

	if err := c.Bind(&body); err != nil {
		return responses.InternalServerError(c, err.Error())
	}

	if err := h.wsUsecase.ConfirmatedRequest(c.Request().Context(), body); err != nil {
		return responses.CodeError(c, err)
	}

	return responses.MsgSuccess(c, "Request confirmed")
}
