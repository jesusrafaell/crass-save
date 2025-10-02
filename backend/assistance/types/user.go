package types

type RegisterUserWs struct {
	FullName      string `json:"fullName" validate:"required"`
	DocIdent      string `json:"docIdent" validate:"required"`
	DoctIdentPath string `json:"doctIdentPath" validate:"required"`
	Mobile        string `json:"mobile" validate:"required"`
	Email         string `json:"email" validate:"required"`
}

type MessageNotif struct {
	Title   string `json:"title"`
	Message string `json:"message"`
	Sound   string `json:"sound"`
}
