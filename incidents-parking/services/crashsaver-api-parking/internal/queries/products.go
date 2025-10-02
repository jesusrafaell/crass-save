package queries

import (
	"fmt"
)

type ProductsQuery struct{}

func (q *ProductsQuery) GetAllProducts(lang string) string {
	query := fmt.Sprintf(`
		SELECT 
			id, 
			%[1]s as "name",
			price,
			credits
		FROM public.pkl_products
	`, lang)

	return query
}
func (q *ProductsQuery) GetProducts() string {
	return `
		SELECT credits
		FROM public.pkl_products 
		WHERE id = $1`

}

func (q *ProductsQuery) GetCompanyCredit() string {
	return `SELECT credits FROM public.pkl_companies WHERE id = $1`

}

func (q *ProductsQuery) UpdateCompanyCredit() string {
	return `
	UPDATE public.pkl_companies
	SET credits= $2 WHERE id = $1 RETURNING 1`
}

func (q *ProductsQuery) GetProductsByNameEN() string {
	return `
		SELECT 
			id,
			en as "name",
			price,
			credits
		FROM public.pkl_products
	`
}

func (q *ProductsQuery) PostPaymentCredits() string {
	return `
		INSERT INTO public.history_payments_credits(
			id_companies, id_products, id_user, n_order, description)
		VALUES ($1 , $2 ,$3 ,$4 ,$5 ) RETURNING id`
}

