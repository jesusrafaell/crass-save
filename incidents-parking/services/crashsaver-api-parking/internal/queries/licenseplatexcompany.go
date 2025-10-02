package queries

type LicensePlateXCompanyQuery struct{}

func (q *LicensePlateXCompanyQuery) Create() string {
	return `
		INSERT INTO licenseplatexcompany(licenseplate, id_company)
		VALUES ($1,$2) RETURNING id
	`
}

func (q *LicensePlateXCompanyQuery) ListByCompanyId() string {
	return `		
		SELECT id, licenseplate, id_company
		FROM licenseplatexcompany
		WHERE id_company = $1
	`
}
