package handlers

import (
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type AssistanceRequestHandler struct {
	service services.AssistanceRequestService
}

func NewAssistanceReqHandler(s services.AssistanceRequestService) *AssistanceRequestHandler {
	return &AssistanceRequestHandler{
		service: s,
	}
}

func (vh *AssistanceRequestHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	assitances, err := vh.service.GetAll()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := []types.AssistanceResponse{}
	for _, t := range *assitances {
		res = append(res, *util.ConvertAssistanceReqToResponse(&t, lang))
	}
	return ResponseSuccess(c, "Request", res)
}

func (vh *AssistanceRequestHandler) CreateByUser(c echo.Context) error {
	userIdStr := c.Get("userId").(string)
	var req types.AssistanceRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	userId, _ := uuid.Parse(userIdStr)
	req.UserID = userId

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	if errCustom := vh.service.Create(req); errCustom != nil {
		return ResponseCodeError(c, errCustom)
	}

	return ResponseCreated(c, "Request Created")
}

func (vh *AssistanceRequestHandler) GetByUser(c echo.Context) error {
	lang := c.Get("lang").(string)
	userIdStr := c.Get("userId").(string)
	userId, _ := uuid.Parse(userIdStr)
	assitance, err := vh.service.GetByUserID(userId)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	res := *util.ConvertAssistanceReqToResponse(assitance, lang)
	return ResponseSuccess(c, "Request", res)

}

func (vh *AssistanceRequestHandler) Cancel(c echo.Context) error {
	var req types.AssistanceCancel
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	if err := vh.service.Cancel(req); err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	return ResponseSuccess(c, "Request Cancelled", nil)
}

// func (vh *AssistanceRequestHandler) Update(c echo.Context) error {
// 	var req types.AssistanceUpdate
// 	if err := c.Bind(&req); err != nil {
// 		return ResponseInternalServerError(c, err.Error())
// 	}

// 	id := c.Param("id")
// 	if err := vh.service.Update(id, req); err != nil {
// 		return ResponseBadRequest(c, err.Error())
// 	}

// 	return ResponseSuccess(c, "Request Updated", nil)
// }
