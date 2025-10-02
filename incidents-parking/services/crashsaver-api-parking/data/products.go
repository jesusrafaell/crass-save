package data

import "github.com/google/uuid"

type BDProducts struct {
	ID      uuid.UUID `json:"id"`
	Name    string    `json:"name"`
	Price   string    `json:"price"`
	Credits string    `json:"credits"`
}

type PaymentCredits struct {
	ProductID   uuid.UUID `json:"productId"`
	CompanyID   uuid.UUID `json:"companyId"`
	UserID      uuid.UUID `json:"userId"`
	Description string    `json:"description"`
}
