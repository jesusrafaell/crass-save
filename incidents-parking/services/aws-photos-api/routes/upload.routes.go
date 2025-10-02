package routes

import (
	"crashsaver/photos/handlers"

	"github.com/labstack/echo/v4"
)

func UploadPhoto(e *echo.Echo, uph *handlers.UploadPhotoHandler) {
	uploadGroup := e.Group("/upload")
	uploadGroup.POST("", uph.Save)
}
