package auth

import (
	"appassistence/auth/pkg/users"
	"appassistence/auth/pkg/utility"
	"appassistence/auth/pkg/verify"
	"fmt"
	"io"
	"log"
	"os"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	service  *AuthService
	validate *validator.Validate
}

func NewAuthHandler(
	service *AuthService,
) *AuthHandler {
	return &AuthHandler{
		service:  service,
		validate: validator.New(),
	}
}

func (h *AuthHandler) Register(c echo.Context) error {
	lang := c.Get("lang").(string)
	var req RegisterUser

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	errValid := h.validate.Struct(req)
	if errValid != nil {
		errors := errValid.(validator.ValidationErrors)
		return utility.BadRequestErrors(c, &errors)
	}

	err := h.service.Register(lang, &req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Created(c)
}

func (h *AuthHandler) LoginMobile(c echo.Context) error {
	lang := c.Get("lang").(string)
	var req LoginRequest

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	res, err := h.service.LoginMobile(lang, &req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "login successfully", res)
}

func (h *AuthHandler) LoginManager(c echo.Context) error {
	lang := c.Get("lang").(string)
	var req LoginRequest

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	res, err := h.service.LoginManager(lang, &req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "login manger successfully", res)
}

func (h *AuthHandler) Logout(c echo.Context) error {
	companyKeyStr := c.Get("companyKey").(string)

	userIDStr := c.Get("userId").(string)
	userID, errUUID := uuid.Parse(userIDStr)

	if errUUID != nil {
		return utility.BadRequest(c, "invalid UUID format")
	}

	err := h.service.Logout(userID, companyKeyStr)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.MsgSuccess(c, "logout successfully")
}

func (h *AuthHandler) DeleteAccount(c echo.Context) error {
	userIDStr := c.Get("userId").(string)
	userID, errUUID := uuid.Parse(userIDStr)

	if errUUID != nil {
		return utility.BadRequest(c, "invalid UUID format")
	}

	err := h.service.DeleteAccount(userID)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.MsgSuccess(c, "deleted successfully")
}

func (h *AuthHandler) VerifyAccount(c echo.Context) error {
	var req verify.TokenRequest

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	email, err := h.service.VerifyAccount(req.Token)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "account verified", map[string]string{"email": email})
}

func (h *AuthHandler) ChangeCurrentRole(c echo.Context) error {
	lang := c.Get("lang").(string)
	//req.RoleKey deberia llegar en el body
	userIDStr := c.Get("userId").(string)
	userId, errUUID := uuid.Parse(userIDStr)
	if errUUID != nil {
		return utility.BadRequest(c, "invalid UUID format")
	}

	os := c.Get("os").(string)

	var req users.ChangeRoleCurrent
	req.OS = os

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}
	res, err := h.service.ChangeCurrentRole(lang, userId, &req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "currrent role changed", res)
}

func (h *AuthHandler) RemoveAccountCompany(c echo.Context) error {
	userIdStr := c.Param("id")
	userId, errParse := uuid.Parse(userIdStr)
	if errParse != nil {
		return utility.BadRequest(c, "user not found")
	}

	err := h.service.RemoveAccountCompany(userId)

	if err != nil {
		return utility.CodeError(c, err)
	}
	return utility.MsgSuccess(c, "remove user company")
}

func (h *AuthHandler) RegisterDriver(c echo.Context) error {
	var req RegisterDriver

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	errValid := h.validate.Struct(req)
	if errValid != nil {
		errors := errValid.(validator.ValidationErrors)
		return utility.BadRequestErrors(c, &errors)
	}

	err := h.service.RegisterDriver(&req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Created(c)
}

func (h *AuthHandler) RegisterDriverXLSX(c echo.Context) error {
	companyIdStr := c.Param("id")
	companyId, err := uuid.Parse(companyIdStr)
	if err != nil {
		return utility.BadRequest(c, "company not found")
	}
	// Obtiene el archivo del formulario

	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("Error RegisterDriverXLSX.formfile %v", err)
		return utility.BadRequest(c, "invalid file")
	}

	// Abrir el archivo
	src, err := file.Open()
	if err != nil {
		log.Printf("Error RegisterDriverXLSX.open %v", err)
		return utility.BadRequest(c, "invalid file")
	}
	defer src.Close()

	// Guardar el archivo temporalmente
	dst, err := os.Create(fmt.Sprintf("./files/%s", file.Filename))
	if err != nil {
		log.Printf("Error RegisterDriverXLSX.Create %v", err)
		return utility.BadRequest(c, "invalid file")
	}
	defer dst.Close()

	// Copiar el archivo al destino
	if _, err = io.Copy(dst, src); err != nil {
		log.Printf("Error RegisterDriverXLSX.copy %v", err)
		return err
	}

	listErrors, errC := h.service.RegisterFromFile(companyId, dst)
	if errC != nil {
		return utility.CodeError(c, errC)
	}

	return utility.Success(c, "driver registered, data = lista de errores", listErrors)
}

func (h *AuthHandler) RegisterAdmin(c echo.Context) error {
	var req RegisterAdmin

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	errValid := h.validate.Struct(req)
	if errValid != nil {
		errors := errValid.(validator.ValidationErrors)
		return utility.BadRequestErrors(c, &errors)
	}

	err := h.service.RegisterAdmin(&req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Created(c)
}

func (h *AuthHandler) ForgotPassword(c echo.Context) error {
	// lang := c.Get("lang").(string)
	var req ForgotPassword

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	err := h.service.ForgotPassword(req.Email)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.MsgSuccess(c, "sended email")
}

func (h *AuthHandler) ChangePassword(c echo.Context) error {
	var req ChangePassword

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	err := h.service.ChangePassword(req.Token, req.Password)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.MsgSuccess(c, "sended email")
}

func (h *AuthHandler) Test(c echo.Context) error {
	var req users.AddDriverRole

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	errValid := h.validate.Struct(req)
	if errValid != nil {
		errors := errValid.(validator.ValidationErrors)
		return utility.BadRequestErrors(c, &errors)
	}

	return utility.MsgSuccess(c, fmt.Sprintf("Pio Pio dice: %s", req.Path))
}

func (h *AuthHandler) VerifyInfo(c echo.Context) error {
	lang := c.Get("lang").(string)
	var req verify.TokenRequest

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	res, err := h.service.VerifyInfo(lang, req.Token)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "Info user By Token", res)
}

func (h *AuthHandler) HandleVerifiedAccountInfo(c echo.Context) error {
	var req VerifyInfoRequest

	if err := c.Bind(&req); err != nil {
		return utility.InternalServerError(c, err.Error())
	}

	res, err := h.service.VerifiedAccountInfo(req.Token, &req)
	if err != nil {
		return utility.CodeError(c, err)
	}

	return utility.Success(c, "Save data user By Token", res)
}
