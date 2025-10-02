package handlers

import (
	"crashsaver/incident/types"
	"crashsaver/incident/util"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

func (ih *IncidentsHandler) CreateMobile(c echo.Context) error {
	userId := c.Get("userId").(string)
	var req types.IncidentMobileRequest

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

	incident, err := ih.service.CreateIncidentMobile(req)
	if err != nil {
		return ResponseCodeError(c, err)
	}

	incidentsRes := *util.ConvertIncidentMobileResponse(incident)
	res := types.IncidentMobileRes{
		IncidentMobileResponse: incidentsRes,
		Ok:                     true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) GetMobileList(c echo.Context) error {
	incidents, err := ih.service.ListIncidentMobile()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	incidentsRes := []types.IncidentMobileResponse{}
	for _, i := range *incidents {
		incidentsRes = append(incidentsRes, *util.ConvertIncidentMobileResponse(&i))
	}
	res := types.SuccessResponse{
		Message: "list incidents mobile",
		Data:    incidentsRes,
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) GetMobileById(c echo.Context) error {
	id := c.Param("id")

	incident, err := ih.service.GetIncidentMobile(id)

	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	incidentRes := *util.ConvertIncidentMobileResponse(incident)
	res := types.SuccessResponse{
		Data:    incidentRes,
		Message: "incident Data",
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) UpdateStatusMobile(c echo.Context) error {
	id := c.Param("id")

	var req types.UpdateIncidentRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	if req.Status == 0 {
		return ResponseInternalServerError(c, "status invalid")
	}

	err := ih.service.UpdateStatusMobile(id, req.Status)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	msg := fmt.Sprintf("updated id: %s", id)

	res := types.SuccessResponse{
		Message: msg,
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) UpdateLocationMobile(c echo.Context) error {
	id := c.Param("id")

	var req types.UpdateLocationIncidentRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := ih.service.UpdateIncidentLocationMobile(id, req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	msg := fmt.Sprintf("updated id: %s", id)

	res := types.SuccessResponse{
		Message: msg,
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}
