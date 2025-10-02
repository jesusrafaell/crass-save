package data

type PaymentTPV struct {
	Terminal string `json:"terminal"`
	Order    string `json:"order"`
	Amount   string `json:"amount"`
	Currency string `json:"currency"`
	MethodID string `json:"methodId"`
	Secure   int    `json:"secure"`
}

type RequestTPV struct {
	OperationType      int        `json:"operationType"`
	Language           string     `json:"language"`
	Terminal           string     `json:"terminal"`
	ProductDescription string     `json:"productDescription"`
	Payment            PaymentTPV `json:"payment"`
}

type ResponseTPV struct {
	ErrorCode    int    `json:"errorCode"`
	ChallengeUrl string `json:"challengeUrl"`
}

type TransactionRequest struct {
	TransactionType   string `form:"TransactionType"`
	TransactionName   string `form:"TransactionName"`
	CardCountry       string `form:"CardCountry"`
	BankDateTime      string `form:"BankDateTime"`
	ClearanceDateTime string `form:"ClearanceDateTime"`
	Signature         string `form:"Signature"`
	Order             string `form:"Order"`
	Response          string `form:"Response"`
	ErrorID           string `form:"ErrorID"`
	ErrorDescription  string `form:"ErrorDescription"`
	AuthCode          string `form:"AuthCode"`
	Currency          string `form:"Currency"`
	Amount            string `form:"Amount"`
	AmountEur         string `form:"AmountEur"`
	Language          string `form:"Language"`
	AccountCode       string `form:"AccountCode"`
	TpvID             string `form:"TpvID"`
	Concept           string `form:"Concept"`
	DCC_Currency      string `form:"DCC_Currency"`
	DCC_CurrencyName  string `form:"DCC_CurrencyName"`
	DCC_Amount        string `form:"DCC_Amount"`
	DCC_Markup        string `form:"DCC_Markup"`
	DCC_ExchangeRate  string `form:"DCC_ExchangeRate"`
	DCC_EcbPercentage string `form:"DCC_EcbPercentage"`
	ExtendedSignature string `form:"ExtendedSignature"`
	NotificationHash  string `form:"NotificationHash"`
	IdUser            string `form:"IdUser"`
	TokenUser         string `form:"TokenUser"`
	SecurePayment     string `form:"SecurePayment"`
	CardBrand         string `form:"CardBrand"`
	BicCode           string `form:"BicCode"`
	SepaCard          string `form:"sepaCard"`
	CardType          string `form:"cardType"`
	CardCategory      string `form:"cardCategory"`
	MethodId          string `form:"MethodId"`
	MethodName        string `form:"MethodName"`
	XPAYORIGIN        string `form:"XPAYORIGIN"`
}
