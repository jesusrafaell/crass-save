package handlers

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/services"
	"api/driveassist/types"
	"api/driveassist/util"

	"github.com/labstack/echo/v4"
)

type InsuranceHandler struct {
	service services.InsurancesService
}

func NewInsuranceHandler(s services.InsurancesService) *InsuranceHandler {
	return &InsuranceHandler{
		service: s,
	}
}

func (vh *InsuranceHandler) Create(c echo.Context) error {
	var req types.InsuranceRequest
	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	_, err := vh.service.Create(req)
	if err != nil {
		//errors in create
		return ResponseBadRequest(c, err.Error())
	}

	return ResponseCreated(c, "Insurance Created")
}

func (vh *InsuranceHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	country := c.QueryParam("country")
	countryId := c.QueryParam("countryId")
	var err error
	var baseLang = "en"
	var insurances *[]model.Insurance
	if countryId != "" {
		insurances, err = vh.service.GetByCountryID(countryId)
	} else if country != "" {
		if lang != "" {
			baseLang = lang
		}
		insurances, err = vh.service.GetByCountry(baseLang, country)
	} else {
		insurances, err = vh.service.GetWithCountries()
		if err != nil {
			if err != nil {
				return ResponseBadRequest(c, err.Error())
			}
		}
		res := []types.InsuranceResponse{}
		for _, i := range *insurances {
			countriesRes := []types.BaseName{}
			for _, j := range i.Countries {
				countriesRes = append(countriesRes, *util.CountryToBase(&j, lang))
			}
			insurance := types.InsuranceResponse{
				ID:        i.ID,
				Name:      i.Name,
				CreatedAt: i.CreatedAt,
				UpdatedAt: i.UpdatedAt,
				Countries: countriesRes,
			}
			res = append(res, insurance)
		}
		return ResponseSuccess(c, "List Insurances with Countries", res)
	}
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	res := []types.BaseName{}
	for _, i := range *insurances {
		newItem := types.BaseName{
			ID:   i.ID,
			Name: i.Name,
		}
		res = append(res, newItem)
	}

	return ResponseSuccess(c, "List Insurances", res)
}
