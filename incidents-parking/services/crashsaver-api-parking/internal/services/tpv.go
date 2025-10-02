package services

import (
	"bytes"
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type TpvService struct {
	db            *sqlx.DB
	paycometToken string
	queries       *queries.TpvQuery
}

func NewTpvService(db *sqlx.DB) *TpvService {
	token := os.Getenv("PAYCOMET_API_TOKEN")
	return &TpvService{
		db:            db,
		paycometToken: token,
		queries:       &queries.TpvQuery{},
	}
}

func (s *TpvService) Payment(payment *data.Payment) (*data.ResponseTPV, error) {
	fmt.Println("Data :")
	fmt.Println(payment)
	// Definir la URL de la API
	url := "https://rest.paycomet.com/v1/form"

	// Crear una solicitud
	reqTPV := data.RequestTPV{
		OperationType:      1,
		Language:           payment.Language,
		Terminal:           payment.Terminal,
		ProductDescription: payment.ProductDescription,
		Payment: data.PaymentTPV{
			Terminal: payment.Terminal,
			Order:    payment.Order,
			Amount:   payment.Amount,
			Currency: payment.Currency,
			MethodID: "1",
			Secure:   1,
		},
	}

	// JSON
	jsonReq, err := json.Marshal(reqTPV)
	if err != nil {
		fmt.Println("Error al convertir la solicitud a JSON:", err)
		return nil, err
	}

	fmt.Printf("Request JSON: %v", reqTPV)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonReq))
	if err != nil {
		fmt.Println("Error al crear la solicitud HTTP:", err)
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("PAYCOMET-API-TOKEN", s.paycometToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error al realizar la solicitud:", err)
		return nil, err
	}
	defer resp.Body.Close()

	var resTPV data.ResponseTPV
	if err := json.NewDecoder(resp.Body).Decode(&resTPV); err != nil {
		fmt.Println("Error al decodificar la resTPV:", err)
		return nil, err
	}

	if resTPV.ChallengeUrl == "" || resTPV.ErrorCode != 0 {
		fmt.Println("Respuesta ChallengeUrl:", resTPV.ChallengeUrl)
		fmt.Println("Respuesta ErrorCode:", resTPV.ErrorCode)
		return nil, fmt.Errorf("%d", resTPV.ErrorCode)
	}

	return &resTPV, nil
}

func (s *TpvService) Notification(req data.TransactionRequest) error {
	fmt.Println("Data Notification:")
	fmt.Println(req.Order)
	var prodcredits float64
	var compcredits float64

	if req.Response == "KO" {

		fmt.Println("Data Notification:")
		var id uuid.UUID
		err := s.db.QueryRow(
			s.queries.DeleteHistoryPay(),
			req.Order,
		).Scan(&id)
		if err != nil {
			log.Println(err)
			return nil
		}
		return nil
	}

	//Select compania de historico_ payment con order
	var id_companies uuid.UUID
	err := s.db.QueryRow(
		s.queries.GetIdCompany(),
		req.Order,
	).Scan(&id_companies)
	if err != nil {
		log.Println(err)
		return nil
	}

	//Select producto de historico_ payment con order
	var id_products uuid.UUID
	err2 := s.db.QueryRow(
		s.queries.GetIdProduct(),
		req.Order,
	).Scan(&id_products)
	if err2 != nil {
		log.Println(err2)
		return nil
	}

	//Select Monto del company con id_compani
	err3 := s.db.QueryRow(
		s.queries.GetCreditCompany(),
		id_companies,
	).Scan(&compcredits)
	if err3 != nil {
		log.Println(err3)
		return err3
	}

	//Select Monto del producto con id_compani
	err4 := s.db.QueryRow(
		s.queries.GetCreditProduct(),
		id_products,
	).Scan(&prodcredits)
	if err4 != nil {
		log.Println(err4)
		return err4
	}

	var update1 float64
	//Update Historico_payment_credit
	err5 := s.db.QueryRow(
		s.queries.UpdateHistoryPayment(),
		req.Order,
	).Scan(&update1)
	if err5 != nil {
		log.Println(err5)
		return err5
	}

	//Update Credit Comercio
	total := (prodcredits + compcredits)
	var update2 float64
	err6 := s.db.QueryRow(
		s.queries.UpdateCompanyCredit(),
		id_companies,
		total,
	).Scan(&update2)
	if err6 != nil {
		log.Println(err6)
		return err6
	}

	return nil
}
