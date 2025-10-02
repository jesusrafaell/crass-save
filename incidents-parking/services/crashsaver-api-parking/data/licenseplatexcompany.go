package data

import "github.com/google/uuid"

type LicensePlateXCompany struct {
	ID           uuid.UUID `db:"id" json:"id"`
	LicensePlate string    `db:"licenseplate" json:"licensePlate"`
	CompanyId    uuid.UUID `db:"id_company" json:"companyId"`
}
