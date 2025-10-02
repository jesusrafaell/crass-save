package handlers

import (
	"crashsaver/incident/types"
	"crashsaver/incident/util"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

func (ih *IncidentsHandler) CreateStatic(c echo.Context) error {
	userId := c.Get("userId").(string)
	var req types.IncidentStaticRequest
	req.UserID = userId

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	incident, err := ih.service.CreateIncidentStatic(req)
	if err != nil {
		return ResponseCodeError(c, err)
	}

	incidentRes := *util.ConvertIncidentResponseModel(incident)
	res := types.CreatedIncidentResponse{
		IncidentResponse: incidentRes,
		Ok:               true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) GetStaticList(c echo.Context) error {
	// lang := c.Get("lang").(string)
	incidents, err := ih.service.ListIncidentStatic()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	incidentsRes := []types.IncidentResponseData{}
	for _, i := range *incidents {
		incidentsRes = append(incidentsRes, *util.ConvertIncidentResponseData(&i))
	}
	res := types.SuccessResponse{
		Message: "list incidents static",
		Data:    incidentsRes,
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) GetStaticById(c echo.Context) error {
	id := c.Param("id")

	incident, err := ih.service.GetIncidentStaticById(id)

	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	incidentRes := *util.ConvertIncidentResponseData(incident)
	res := types.SuccessResponse{
		Data:    incidentRes,
		Message: "incident Data",
		Ok:      true,
	}
	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) UpdateStatic(c echo.Context) error {
	id := c.Param("id")

	var req types.UpdateIncidentRequest

	// transform
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}
	// validator
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := ih.service.UpdateIncidentStatic(id, req)
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
