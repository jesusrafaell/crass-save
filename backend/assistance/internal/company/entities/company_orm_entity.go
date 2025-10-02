package entities

import "bitbucket.org/mya/mya-assistance-core/data/model"

type CompanyORM struct {
	Company
	Location *model.LocationPointer `json:"location,omitempty"`
}

func (CompanyORM) TableName() string {
	return "u_companies"
}
