package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

type insurances struct {
	Name      string
	Countries []string // Nombres de los países en inglés
}

var listInsurances = []insurances{
	{"Mapfre", []string{"Spain", "Venezuela"}},
	{"Allianz", []string{"Spain", "Colombia"}},
	{"Sancor", []string{"Argentina"}},
}

func SaveInsurances(db *gorm.DB) {
	insuranceRepo := repository.NewInsuranceRepository(db)
	countryRepo := repository.NewCountryRepository(db)

	for _, ins := range listInsurances {
		var countries []model.Country
		// Encuentra y añade los países a la aseguradora
		for _, countryName := range ins.Countries {
			country, err := countryRepo.GetByName(countryName)
			if err != nil {
				log.Fatalf("Error finding country '%s': %v\n", countryName, err)
			}
			countries = append(countries, *country)
		}

		// Crea la aseguradora con sus países
		insurance := model.Insurance{
			Name:      ins.Name,
			Countries: countries,
		}

		err := insuranceRepo.Create(&insurance)
		if err != nil {
			log.Fatalf("Error saving insurance '%s': %v\n", ins.Name, err)
		} else {
			fmt.Printf("Insurance: Name: %s\n", insurance.Name)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
