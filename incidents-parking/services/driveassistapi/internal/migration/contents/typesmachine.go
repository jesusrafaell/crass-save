package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listTypeMachine = []model.TypeMachine{
	{ES: "Eléctrico", EN: "Electric"},
	{ES: "Gasolina", EN: "Gasoline"},
	{ES: "Gasoil", EN: "Diesel"},
	{ES: "Híbrido", EN: "Hybrid"},
}

func SaveTypesMachine(db *gorm.DB) {
	repo := repository.NewTypeMachineRepository(db)
	for _, t := range listTypeMachine {
		err := repo.Create(&t)
		if err != nil {
			log.Fatalf("Error saving TypeMachine -> EN: %s, ES: %s, Error: %v\n", t.EN, t.ES, err)
		} else {
			fmt.Printf("TypeMachine: EN:%s, ES:%s\n", t.EN, t.ES)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
