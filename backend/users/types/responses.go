package types

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
