package types

type ErrorResponse struct {
	Error string `json:"error"`
	Name  string `json:"name"`
	Ok    bool   `json:"ok"`
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
	Ok      bool        `json:"ok"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

type MsgResponse struct {
	Ok      bool   `json:"ok"`
	Message string `json:"message"`
}
