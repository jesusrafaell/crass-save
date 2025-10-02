package data

type Payment struct {
	Language           string `json:"language"`
	Terminal           string `json:"terminal"`
	ProductDescription string `json:"productDescription"`
	Order              string `json:"order"`
	Amount             string `json:"amount"`
	Currency           string `json:"currency"`
}

// type BDProducts struct {
// 	ID      uuid.UUID `json:"id"`
// 	Name    string    `json:"name"`
// 	Price   string    `json:"price"`
// 	Credits string    `json:"credits"`
// }
