package handlers

import (
	"crashsaver/incident/internal/services"
	"crashsaver/incident/types"
	"crashsaver/incident/util"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type IncidentsHandler struct {
	service services.IncidentService
}

func NewIncidentsHandler(s services.IncidentService) *IncidentsHandler {
	return &IncidentsHandler{
		service: s,
	}
}

func (ih *IncidentsHandler) GetNearbyIncidents(c echo.Context) error {
	userId := c.Get("userId").(string)

	var req types.GetNearIncidentRequest

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

	list, err := ih.service.GetNearbyIncidents(req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	incidents := []types.IncidentResponse{}
	for _, i := range *list.Incidents {
		incidents = append(incidents, *util.ConvertIncidentResponse(&i))
	}

	myIncidents := []types.IncidentResponse{}
	for _, i := range *list.MyIncidents {
		myIncidents = append(myIncidents, *util.ConvertIncidentResponse(&i))
	}

	incidentsMobile := []types.IncidentMobileResponse{}
	for _, i := range *list.IncidentsMobiles {
		incidentsMobile = append(incidentsMobile, *util.ConvertIncidentMobileResponse(&i))
	}

	res := types.GetNearIncidentResponse{
		Incidents:        incidents,
		MyIncidents:      myIncidents,
		IncidentsMobiles: incidentsMobile,
		Ok:               true,
	}

	if list.MyIncidentMobile != nil {
		res.MyIncidentMobile = util.ConvertIncidentMobileResponse(list.MyIncidentMobile)
	}

	return ResponseSuccess(c, "Request", res)
}

func (ih *IncidentsHandler) GetListIncidents(c echo.Context) error {

	istatics, imobiles, err := ih.service.ListIncidents()
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	staticRes, mobileRes, err := util.ConvertIncidentsAll(istatics, imobiles)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	res := types.AllIncidentsResponse{
		Statics: staticRes,
		Mobiles: mobileRes,
		Ok:      true,
	}

	return ResponseSuccess(c, "Request", res)
}
