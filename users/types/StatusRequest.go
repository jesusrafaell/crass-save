package types

type StatusOp string

const (
	StatusActive   StatusOp = "active"
	StatusInactive StatusOp = "inactive"
	StatusDriver   StatusOp = "driver"
)

type FilterDashboardRequest struct {
	Status *StatusOp `json:"status"`
	Limit  *uint64   `jons:"limit"`
}
