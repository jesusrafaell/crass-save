package handlers

import (
	"crashsaver/parking/internal/services"
	"crashsaver/parking/types"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type BookingHandler struct {
	service services.BookingService
}

func NewBookingHandler(service services.BookingService) *BookingHandler {
	return &BookingHandler{
		service,
	}
}

func (ph *BookingHandler) GetList(c echo.Context) error {
	lang := c.Get("lang").(string)
	filter := new(types.FilterBooking)

	if lp := c.QueryParam("licensePlate"); lp != "" {
		filter.LicensePlate = &lp
	}
	if lpc := c.QueryParam("lpContainer"); lpc != "" {
		filter.LPContainer = &lpc
	}
	if uid := c.QueryParam("userId"); uid != "" {
		filter.UserID = &uid
	}
	if pid := c.QueryParam("parkingId"); pid != "" {
		filter.ParkingID = &pid
	}
	if cid := c.QueryParam("companyId"); cid != "" {
		filter.CompanyID = &cid
	}
	if did := c.QueryParam("driverId"); did != "" {
		filter.DriverID = &did
	}

	if allStr := c.QueryParam("all"); allStr != "" {
		all, err := strconv.ParseBool(allStr)
		if err == nil {
			filter.All = &all
		}
	}

	res, err := ph.service.List(lang, *filter)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "list bookings", res)
}

func (ph *BookingHandler) GetListByDriveId(c echo.Context) error {
	lang := c.Get("lang").(string)
	driveIdStr := c.Get("userId").(string)
	driveId, err := uuid.Parse(driveIdStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}

	filter := new(types.FilterDriveBooking)

	if lp := c.QueryParam("licensePlate"); lp != "" {
		filter.LicensePlate = &lp
	}

	if allStr := c.QueryParam("all"); allStr != "" {
		all, err := strconv.ParseBool(allStr)
		if err == nil {
			filter.All = &all
		}
	}

	length := c.QueryParam("length")
	if length != "" {
		res, err := ph.service.GetCountByDriverId(driveId, *filter)
		if err != nil {
			return ResponseBadRequest(c, err.Error())
		}
		return ResponseSuccess(c, "total booking", res)
	}

	res, err := ph.service.GetListByDriveId(lang, driveId, *filter)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "list bookings", res)
}

func (bh *BookingHandler) Create(c echo.Context) error {
	lang := c.Get("lang").(string)
	userIdStr := c.Get("userId").(string)
	userId, err := uuid.Parse(userIdStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}

	var req types.BookingCreate

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	req.UserID = userId

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	res, err := bh.service.Create(lang, &req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "booking created", res)
}

func (bh *BookingHandler) GetById(c echo.Context) error {
	lang := c.Get("lang").(string)
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}
	res, err := bh.service.GetById(lang, id)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseSuccess(c, "parking data", res)
}

func (bh *BookingHandler) Update(c echo.Context) error {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		return ResponseBadRequest(c, "invalid UUID format")
	}

	var req types.BookingUpdate

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err = bh.service.Update(id, &req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseUpdated(c)
}

func (bh *BookingHandler) Asignate(c echo.Context) error {
	var req types.BookingAsignate

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	err := bh.service.Asignate(req)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}
	return ResponseUpdated(c)
}

func (bh *BookingHandler) Cancel(c echo.Context) error {
	lang := c.Get("lang").(string)

	var req types.CancelBooking

	if err := c.Bind(&req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		return ResponseInternalServerError(c, err.Error())
	}

	if err := bh.service.CancelById(lang, req.BookingID); err != nil {
		return ResponseCodeError(c, err)
	}
	return ResponseMsgSuccess(c, "Booking Cancelled")
}
