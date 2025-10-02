package util

import (
	"api/driveassist/data/model"
	"api/driveassist/types"
)

func ConvertAssistanceReqToResponse(assistance *model.AssistanceRequest, lang string) *types.AssistanceResponse {
	var imagesUser []string
	imagesUser = append(imagesUser, assistance.ImagePath1)
	imagesUser = append(imagesUser, assistance.ImagePath2)

	priceValue := 250.0 // Assuming the price is a constant, but this could be dynamic

	return &types.AssistanceResponse{
		ID: assistance.ID,
		User: types.UserAssistance{
			Latitude:  assistance.UserLat,
			Longitude: assistance.UserLong,
			VehicleID: assistance.VehicleID,
			Images:    imagesUser,
		},
		Destination: types.DestinationAssistance{
			Latitude:    assistance.Latitude,  // Corrected to use the destination's latitude
			Longitude:   assistance.Longitude, // Corrected to use the destination's longitude
			Address:     assistance.Address,
			Description: assistance.Description,
		},
		Status:    *StatusToBase(&assistance.Status, lang),
		Price:     &priceValue,
		CreatedAt: assistance.CreatedAt,
	}
}
