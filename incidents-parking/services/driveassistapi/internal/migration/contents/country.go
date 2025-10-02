package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listCountries = []model.Country{
	{
		ES: "Colombia",
		EN: "Colombia",
	},
	{
		ES: "España",
		EN: "Spain",
	},
	{
		ES: "Venezuela",
		EN: "Venezuela",
	},
	{
		ES: "Argentina",
		EN: "Argentina",
	},
}

func SaveCountries(db *gorm.DB) {
	repo := repository.NewCountryRepository(db)
	for _, c := range listCountries {
		err := repo.Create(&c)
		if err != nil {
			log.Fatalf("Error saving country -> EN: %s, ES: %s, Error: %v\n", c.EN, c.ES, err)
		} else {
			fmt.Printf("Country: EN:%s, ES:%s\n", c.EN, c.ES)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
