package responses

import (
	"net/http"

	"bitbucket.org/mya/mya-assistance-core/apierrors"

	"github.com/labstack/echo/v4"
)

type ErrorResponse struct {
	Error   string  `json:"error"`
	Name    string  `json:"name"`
	Message *string `json:"message,omitempty"`
	Ok      bool    `json:"ok"`
}

type ErrorsResponse struct {
	Errors []Error `json:"errors"`
	Ok     bool    `json:"ok"`
}

type Error struct {
	Path string `json:"path"`
	Code string `json:"code"`
}

type SuccessResponse struct {
	Ok      bool        `json:"ok"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type MsgResponse struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}

type ErrorsValidatorResponse struct {
	Errors []Error `json:"errors"`
	Ok     bool    `json:"ok"`
}

func CodeError(c echo.Context, err *apierrors.CustomError) error {
	return c.JSON(http.StatusBadRequest, ErrorResponse{
		Error:   err.Code,
		Name:    err.Name,
		Message: err.Message,
		Ok:      false,
	})
}

func BadRequest(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, ErrorResponse{
		Error:   apierrors.ErrorServer.Code,
		Name:    apierrors.ErrorServer.Name,
		Message: &err,
		Ok:      false,
	})
}

func InternalServerError(c echo.Context, err string) error {
	return c.JSON(http.StatusBadRequest, ErrorResponse{
		Error:   apierrors.ErrorServer.Code,
		Name:    apierrors.ErrorServer.Name,
		Message: &err,
		Ok:      false,
	})
}

func Success(c echo.Context, message string, data interface{}) error {
	return c.JSON(http.StatusOK,
		SuccessResponse{
			Ok:      true,
			Message: message,
			Data:    data,
		})
}

func Created(c echo.Context) error {
	return c.JSON(http.StatusCreated,
		MsgResponse{
			Ok:      true,
			Message: "successfully created",
		})
}

func Updated(c echo.Context) error {
	return c.JSON(http.StatusOK,
		MsgResponse{
			Ok:      true,
			Message: "successfully updated",
		})
}

func MsgSuccess(c echo.Context, message string) error {
	return c.JSON(http.StatusOK,
		MsgResponse{
			Ok:      true,
			Message: message,
		})
}

func Errors(c echo.Context, errs []Error) error {
	return c.JSON(http.StatusBadRequest, ErrorsResponse{
		Errors: errs,
		Ok:     false,
	})
}
