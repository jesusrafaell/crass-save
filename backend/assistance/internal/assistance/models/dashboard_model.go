package models

type ServicesData struct {
	Total     int64 `gorm:"total" json:"total"`
	Active    int64 `gorm:"active" json:"active"`
	Cancelled int64 `gorm:"cancelled" json:"cancelled"`
	Completed int64 `gorm:"completed" json:"completed"`
	Pending   int64 `gorm:"pending" json:"pending"`
}

type DriversData struct {
	Total    int64 `gorm:"total" json:"total"`
	Active   int64 `gorm:"active" json:"active"`
	Inactive int64 `gorm:"inactive" json:"inactive"`
}

type DashboarData struct {
	Services ServicesData `gorm:"services" json:"services"`
	Drivers  DriversData  `gorm:"drivers" json:"drivers"`
}

type FilterDashboardRequest struct {
	Status *string `json:"status"`
	Limit  *uint64 `jons:"limit"`
}
