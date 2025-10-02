package handlers

import (
	"crashsaver/photos/internal/services"
	"crashsaver/photos/types"

	"github.com/labstack/echo/v4"
)

type UploadPhotoHandler struct {
	service services.UploadPhotoService
}

func NewUploadPhotoHandler(service services.UploadPhotoService) *UploadPhotoHandler {
	return &UploadPhotoHandler{
		service,
	}
}

func (h *UploadPhotoHandler) Save(c echo.Context) error {
	userId := c.Get("userId").(string)

	fileHeader, err := c.FormFile("photo")
	if err != nil {
		return ResponseBadRequest(c, "FileNotFound")
	}

	file, err := h.service.UploadPhoto(userId, fileHeader)
	if err != nil {
		return ResponseBadRequest(c, err.Error())
	}

	res := types.UploadPhotoReponse{
		UrlPhoto:     file.UrlPhoto,
		UrlThumbnail: file.UrlThumbnail,
	}
	return ResponseSuccess(c, "uploaded image", res)
}
