package types

type UploadPhotoRequest struct {
}

type UploadPhotoReponse struct {
	UrlPhoto     string `json:"url_photo"`
	UrlThumbnail string `json:"url_thumbnail"`
}
