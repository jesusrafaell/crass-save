package queries

import (
	"fmt"
)

type TpvQuery struct{}

func (q *TpvQuery) GetAllStatus(lang string) string {
	query := fmt.Sprintf(`
		SELECT 
			id, 
			%[1]s as "name"
		FROM public.status
	`, lang)

	return query
}

func (q *TpvQuery) GetStatusByNameEN() string {
	return `
		SELECT 
			id, 
			en as "name"
		FROM public.status
		WHERE en = $1`
}

func (q *TpvQuery) GetIdCompany() string {
	return `
	select id_companies from public.history_payments_credits where n_order = $1 `
}

func (q *TpvQuery) DeleteHistoryPay() string {
	return `
	DELETE FROM public.history_payments_credits
	WHERE  n_order = $1 `
}

func (q *TpvQuery) GetIdProduct() string {
	return `
	select id_products from public.history_payments_credits where n_order = $1 `
}

func (q *TpvQuery) GetCreditCompany() string {
	return `SELECT credits FROM public.pkl_companies WHERE id = $1`

}

func (q *TpvQuery) GetCreditProduct() string {
	return `
		SELECT credits
		FROM public.pkl_products 
		WHERE id = $1`

}

func (q *TpvQuery) UpdateHistoryPayment() string {
	return `
	UPDATE history_payments_credits
		SET id_status = (
    		SELECT id
    			FROM status
   		 WHERE en = 'completed'
		)
	WHERE n_order = $1 RETURNING 1`
}
func (q *TpvQuery) UpdateCompanyCredit() string {
	return `
	UPDATE public.pkl_companies
	SET credits= $2 WHERE id = $1 RETURNING 1`
}
