package types

type ErrorResponse struct {
	Error   string  `json:"error"`
	Name    string  `json:"name"`
	Message *string `json:"message,omitempty"`
	Ok      bool    `json:"ok"`
}

type ErrorsResponse struct {
	Error  string   `json:"error"`
	Errors []Errors `json:"errors"`
	Name   string   `json:"name"`
	Ok     bool     `json:"ok"`
}

type Errors struct {
	Path string `json:"path"`
	Code string `json:"code"`
}

type SuccessResponse struct {
	Ok      bool         `json:"ok"`
	Message string       `json:"message"`
	Data    *interface{} `json:"data,omitempty"`
}

type MsgResponse struct {
	Message string `json:"message"`
	Ok      bool   `json:"ok"`
}
