package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listType = []model.Type{
	{ES: "Automóvil", EN: "Car"},
	{ES: "Motocicleta", EN: "Motorcycle"},
	{ES: "Camión", EN: "Truck"},
	{ES: "Autobús", EN: "Bus"},
	{ES: "Furgoneta", EN: "Van"},
	{ES: "Camioneta", EN: "Pick-up"},
	{ES: "SUV", EN: "SUV"},
	{ES: "Furgón", EN: "Cargo Van"},
	{ES: "Semi-remolque", EN: "Semi-trailer Truck"},
	{ES: "Minivan", EN: "Minivan"},
	{ES: "Vehículo deportivo", EN: "Sports Car"},
	{ES: "Vehículo eléctrico", EN: "Electric Vehicle"},
	{ES: "Vehículo híbrido", EN: "Hybrid Vehicle"},
}

func SaveTypes(db *gorm.DB) {
	repo := repository.NewTypeRepository(db)
	for _, t := range listType {
		err := repo.Create(&t)
		if err != nil {
			log.Fatalf("Error saving type -> EN: %s, ES: %s, Error: %v\n", t.EN, t.ES, err)
		} else {
			fmt.Printf("Type: EN:%s, ES:%s\n", t.EN, t.ES)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
