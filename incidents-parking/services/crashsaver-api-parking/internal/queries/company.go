package queries

type CompanyQuery struct{}

func (cq *CompanyQuery) CreateCompany() string {
	return `
    INSERT INTO pkl_companies (name, description, email) VALUES ($1, $2, $3) RETURNING id`
}

func (cq *CompanyQuery) GetListCompanies() string {
	return `
    SELECT 
        id,
        name,
        description,
        email,
        credits
    FROM pkl_companies
    ORDER BY created_at ASC;`
}

func (cq *CompanyQuery) GetCompanyByID() string {
	return `
    SELECT
        id,
        name,
        email,
        description,
        credits
    FROM pkl_companies
    WHERE id = $1;`
}
