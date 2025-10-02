package entities

import (
	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"

	"github.com/google/uuid"
)

type TowTruckExpenseHistory struct {
	ID        uuid.UUID `db:"id" json:"id"`
	CreatedAt int64     `db:"created_at" json:"createdAt,omitempty"`
	UpdatedAt int64     `db:"updated_at" json:"updatedAt,omitempty"`
	// DeletedAt        *int64     `db:"deleted_at" json:"deletedAt,omitempty"`
	CompanyId  uuid.UUID      `db:"company_id" json:"companyId"`
	TowTruckId uuid.UUID      `db:"tow_truck_id" json:"towTruckId"`
	UserId     uuid.UUID      `db:"user_id" json:"userId,omitempty"`
	Amount     float64        `db:"amount" json:"amount"`
	CoinId     uuid.UUID      `db:"coin_id" json:"coinId"`
	Coin       coinModel.Coin `json:"coin"`
	UnixDate   int64          `db:"unix_date" json:"unixDate"`
	// Opcionales
	FuelLiters        *float64 `db:"fuel_liters" json:"fuelLiters,omitempty"`
	RepairDescription *string  `db:"repair_description" json:"repairDescription,omitempty"`
	ExpenseType       uint     `db:"expense_type" json:"expenseType"`
}
