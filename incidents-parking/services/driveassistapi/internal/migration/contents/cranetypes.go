package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listCraneType = []model.CraneType{
	{ES: "Grúa torre", EN: "Tower Crane"},
	{ES: "Grúa móvil", EN: "Mobile Crane"},
	{ES: "Grúa sobre orugas", EN: "Crawler Crane"},
	{ES: "Grúa flotante", EN: "Floating Crane"},
	{ES: "Grúa telescópica", EN: "Telescopic Crane"},
	{ES: "Grúa de carga", EN: "Loader Crane"},
	{ES: "Grúa de horca", EN: "Gantry Crane"},
	{ES: "Grúa pórtico", EN: "Portal Crane"},
	{ES: "Grúa de puente", EN: "Overhead Crane"},
	{ES: "Grúa de brazo", EN: "Jib Crane"},
	{ES: "Grúa de montaje rápido", EN: "Fast Erecting Crane"},
	{ES: "Grúa todoterreno", EN: "All Terrain Crane"},
	{ES: "Grúa de pluma articulada", EN: "Knuckle Boom Crane"},
	{ES: "Grúa de torre automontante", EN: "Self-Erecting Tower Crane"},
}

func SaveCraneTypes(db *gorm.DB) {
	repo := repository.NewCraneTypeRepository(db)
	for _, t := range listCraneType {
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
