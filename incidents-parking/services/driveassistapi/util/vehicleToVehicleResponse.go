package util

import (
	"api/driveassist/data/model"
	"api/driveassist/types"
)

func ConvertVehicleToVehicleResponse(vehicle model.Vehicle, lang string) *types.VehicleResponse {
	return &types.VehicleResponse{
		ID:           vehicle.ID,
		Year:         vehicle.Year,
		Tuition:      vehicle.Tuition,
		ImagePath:    vehicle.ImagePath,
		PolicyNumber: vehicle.PolicyNumber,
		UserID:       vehicle.UserID,
		CreatedAt:    vehicle.CreatedAt,
		UpdatedAt:    vehicle.UpdatedAt,
		Brand: types.BaseName{
			ID:   vehicle.Brand.ID,
			Name: vehicle.Brand.Name,
		},
		Model: types.BaseName{
			ID:   vehicle.Model.ID,
			Name: vehicle.Model.Name,
		},
		Type:           *TypeToBase(&vehicle.Type, lang),
		TypeMachine:    *TypeMachineToBase(&vehicle.TypeMachine, lang),
		Weight:         *WeightToBase(&vehicle.Weight, lang),
		Color:          *ColorToBase(&vehicle.Color, lang),
		DriveTrainType: *DriveTrainToBase(&vehicle.DriveTrainType, lang),
		Country:        *CountryToBase(&vehicle.Country, lang),
		Insurance: types.BaseName{
			ID:   vehicle.Insurance.ID,
			Name: vehicle.Insurance.Name,
		},
	}
}
