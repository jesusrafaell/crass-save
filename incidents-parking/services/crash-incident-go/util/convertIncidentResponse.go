package util

import (
	"crashsaver/incident/data/model"
	"crashsaver/incident/types"
)

func ConvertIncidentResponseData(i *model.IncidentStatic) *types.IncidentResponseData {
	return &types.IncidentResponseData{
		ID:             i.ID,
		UserID:         i.UserID,
		Latitude:       i.Location.Coordinates[1],
		Longitude:      i.Location.Coordinates[0],
		Status:         ConvertStatusToKey(i.Status),
		StatusName:     i.Status,
		Description:    i.Description,
		IncidentTypeId: "1",
		CreatedTime:    i.CreateTime,
		UpdatedTime:    i.UpdateTime,
		Icon:           i.Icon,
	}
}

func ConvertIncidentMobileResponse(i *model.IncidentMobile) *types.IncidentMobileResponse {
	return &types.IncidentMobileResponse{
		ID:              i.ID,
		Latitude:        i.Location.Coordinates[1],
		Longitude:       i.Location.Coordinates[0],
		Status:          ConvertStatusToKey(i.Status),
		UserID:          i.UserID,
		CreatedTime:     i.CreateTime,
		UpdatedTime:     i.UpdateTime,
		TransportTypeID: i.TransportKey,
	}
}

func ConvertIncidentResponse(i *model.IncidentStaticNearby) *types.IncidentResponse {
	return &types.IncidentResponse{
		ID:             i.ID,
		Latitude:       i.Location.Coordinates[1],
		Longitude:      i.Location.Coordinates[0],
		Status:         ConvertStatusToKey(i.Status),
		Description:    i.Description,
		IncidentTypeId: "1",
		Distance:       i.Distance,
		CreateUserId:   i.UserID,
		VerifyUser:     i.VerifyUser,
		CreatedTime:    i.CreateTime,
		UpdatedTime:    i.UpdateTime,
		Icon:           i.Icon,
	}
}

func ConvertIncidentResponseModel(i *model.IncidentStatic) *types.IncidentResponse {
	return &types.IncidentResponse{
		ID:             i.ID,
		Latitude:       i.Location.Coordinates[1],
		Longitude:      i.Location.Coordinates[0],
		Status:         ConvertStatusToKey(i.Status),
		Description:    i.Description,
		IncidentTypeId: "1",
		Distance:       0,
		CreateUserId:   i.UserID,
		VerifyUser:     false,
		CreatedTime:    i.CreateTime,
		UpdatedTime:    i.UpdateTime,
		Icon:           i.Icon,
	}
}
