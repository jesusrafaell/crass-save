package services

import (
	"crashsaver/parking/data"
	"crashsaver/parking/internal/queries"
	"log"
	"os"
	"strconv"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ProductsService struct {
	db      *sqlx.DB
	tpv     *TpvService
	queries *queries.ProductsQuery
}

func NewProductsService(db *sqlx.DB, tpv *TpvService) *ProductsService {

	return &ProductsService{

		db:      db,
		tpv:     tpv,
		queries: &queries.ProductsQuery{},
	}
}

func (ps *ProductsService) GetList(lang string) ([]*data.BDProducts, error) {
	var products []*data.BDProducts

	query := ps.queries.GetAllProducts(lang)

	err := ps.db.Select(&products, query)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return products, nil
}

func (ps *ProductsService) GetProductsEN(name string) (*data.BDProducts, error) {
	var products data.BDProducts
	err := ps.db.Get(&products, ps.queries.GetProductsByNameEN(), name)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	return &products, nil
}

// payment/credits, tipo post recibe el { productId, companyId}
func (ps *ProductsService) PaymentCredits(payment *data.PaymentCredits, lang string) (*data.ResponseTPV, error) {
	terminal := os.Getenv("PAYTERMINAL")
	currency := os.Getenv("PAYCURRENCY")
	var id uuid.UUID
	var prodcredits float64
	// var compcredits float64
	id = uuid.New()
	idStr := id.String()
	order := "P-" + idStr

	err := ps.db.QueryRow(
		ps.queries.PostPaymentCredits(),
		payment.CompanyID,
		payment.ProductID,
		payment.UserID,
		order,
		payment.Description,
	).Scan(&id)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	///consulta de producto
	err2 := ps.db.QueryRow(
		ps.queries.GetProducts(),
		payment.ProductID,
	).Scan(&prodcredits)
	if err2 != nil {
		log.Println(err2)
		return nil, err2
	}

	////Insert de
	// Convertir el float a string sin coma o punto decimal
	prodcreditsStr := strconv.Itoa(int(prodcredits * 100))
	payments := data.Payment{
		Language:           lang,
		Terminal:           terminal,
		ProductDescription: payment.Description,
		Order:              order,
		Amount:             prodcreditsStr,
		Currency:           currency,
	}

	res, err3 := ps.tpv.Payment(&payments)

	if err3 != nil {
		log.Println(err3)
		return nil, err3
	}

	return res, nil
}
