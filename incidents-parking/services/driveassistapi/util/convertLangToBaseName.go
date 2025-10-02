package util

import (
	"api/driveassist/data/model"
	"api/driveassist/types"
)

func ColorToBase(color *model.Color, lang string) *types.BaseColor {
	item := types.BaseColor{
		ID:  color.ID,
		HEX: color.HEX,
	}
	if lang == "en" {
		item.Name = color.EN
	} else {
		item.Name = color.ES
	}
	return &item
}

func TypeToBase(typ *model.Type, lang string) *types.BaseName {
	item := types.BaseName{
		ID: typ.ID,
	}
	if lang == "en" {
		item.Name = typ.EN
	} else {
		item.Name = typ.ES
	}
	return &item
}

func TypeMachineToBase(typeMachine *model.TypeMachine, lang string) *types.BaseName {
	item := types.BaseName{
		ID: typeMachine.ID,
	}
	if lang == "en" {
		item.Name = typeMachine.EN
	} else {
		item.Name = typeMachine.ES
	}
	return &item
}

func DriveTrainToBase(driveTrain *model.DriveTrainType, lang string) *types.BaseName {
	item := types.BaseName{
		ID: driveTrain.ID,
	}
	if lang == "en" {
		item.Name = driveTrain.EN
	} else {
		item.Name = driveTrain.ES
	}
	return &item
}

func CountryToBase(country *model.Country, lang string) *types.BaseName {
	item := types.BaseName{
		ID: country.ID,
	}
	if lang == "en" {
		item.Name = country.EN
	} else {
		item.Name = country.ES
	}
	return &item
}

func WeightToBase(w *model.Weight, lang string) *types.BaseName {
	item := types.BaseName{
		ID: w.ID,
	}
	if lang == "en" {
		item.Name = w.EN
	} else {
		item.Name = w.ES
	}
	return &item
}

func CraneTypeToBase(typ *model.CraneType, lang string) *types.BaseName {
	item := types.BaseName{
		ID: typ.ID,
	}
	if lang == "en" {
		item.Name = typ.EN
	} else {
		item.Name = typ.ES
	}
	return &item
}

func StatusToBase(status *model.Status, lang string) *types.BaseName {
	item := types.BaseName{
		ID: status.ID,
	}
	if lang == "en" {
		item.Name = status.EN
	} else {
		item.Name = status.ES
	}
	return &item
}
