package util

import (
	"api/driveassist/data/model"
	"api/driveassist/types"
)

func ConvertTowTruckResponse(t model.TowTruck, lang string) *types.TowTruckResponse {
	return &types.TowTruckResponse{
		ID:           t.ID,
		Year:         t.Year,
		LicensePlate: t.LicensePlate,
		ImagePath:    t.ImagePath,
		PolicyNumber: t.PolicyNumber,
		UserID:       t.UserID,
		CreatedAt:    t.CreatedAt,
		UpdatedAt:    t.UpdatedAt,
		Make: types.BaseName{
			ID:   t.Make.ID,
			Name: t.Make.Name,
		},
		CraneType:      *CraneTypeToBase(&t.CraneType, lang),
		TypeMachine:    *TypeMachineToBase(&t.TypeMachine, lang),
		Weight:         *WeightToBase(&t.Weight, lang),
		Color:          *ColorToBase(&t.Color, lang),
		DriveTrainType: *DriveTrainToBase(&t.DriveTrainType, lang),
		Country:        *CountryToBase(&t.Country, lang),
		Insurance: types.BaseName{
			ID:   t.Insurance.ID,
			Name: t.Insurance.Name,
		},
		MaximumLoad: t.MaximumLoad,
		Length:      t.Length,
		Height:      t.Height,
	}
}
