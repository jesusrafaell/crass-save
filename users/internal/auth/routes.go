package auth

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

func Routes(e *echo.Echo, h *AuthHandler) {
	fmt.Println("/api/v1/auth")
	group := e.Group("/api/v1/auth")

	group.POST("/register", h.Register)
	group.POST("/login", h.LoginMobile)
	group.POST("/login/manager", h.LoginManager)

	group.POST("/logout", h.Logout)
	group.PUT("/current-role", h.ChangeCurrentRole)
	group.DELETE("", h.DeleteAccount)

	// verify email (account)
	group.POST("/verify-info", h.VerifyInfo)
	group.POST("/verify-info/verified", h.HandleVerifiedAccountInfo)
	group.POST("/verify", h.VerifyAccount)

	group.POST("/forgot-password", h.ForgotPassword)
	group.POST("/change-password", h.ChangePassword)

	//web
	group.POST("/dashboard/register-driver", h.RegisterDriver)
	group.POST("/dashboard/register-admin", h.RegisterAdmin)
	group.POST("/register-driver/upload-excel/company/:id", h.RegisterDriverXLSX)
	group.PUT("/dashboard/remove-account/:id", h.RemoveAccountCompany)
	group.POST("/register/test", h.Test)
}
