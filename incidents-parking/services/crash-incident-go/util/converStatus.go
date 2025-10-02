package util

import (
	"crashsaver/incident/data/model"
)

func ConvertStatusToKey(status string) int32 {
	switch status {
	case model.Active.Name:
		return model.Active.Key
	case model.InProgress.Name:
		return model.InProgress.Key
	case model.Resolved.Name:
		return model.Resolved.Key
	default:
		return model.Undefined.Key
	}
}

func ConvertStatusToName(key int32) string {
	switch key {
	case model.Active.Key:
		return model.Active.Name
	case model.InProgress.Key:
		return model.InProgress.Name
	case model.Resolved.Key:
		return model.Resolved.Name
	default:
		return model.Undefined.Name
	}
}
