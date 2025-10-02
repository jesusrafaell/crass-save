package handlers

import (
	"crashsaver/incident/types"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

func (ih *IncidentsHandler) VerifyStaticIncident(c echo.Context) error {
	userId := c.Get("userId").(string)
	var req types.VerifyIncidentRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	req.UserID = userId

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	verify, err := ih.service.CreateVerifyIncident(req)
	if err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	verifyRes := types.VerifyIncidentResponse{
		ID:          verify.ID.Hex(),
		IncidentID:  verify.IncidentID.Hex(),
		UserID:      verify.UserID,
		Option:      verify.Option,
		CreatedTime: verify.CreateTime,
		UpdatedTime: verify.UpdateTime,
	}

	res := types.CreatedResponse{
		Data:    verifyRes,
		Message: "create verify incident",
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}
