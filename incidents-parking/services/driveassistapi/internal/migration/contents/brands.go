package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listBrands = []string{
	"Acura",
	"Alfa Romeo",
	"Aston Martin",
	"Audi",
	"Bentley",
	"BMW",
	"Bugatti",
	"Buick",
	"Cadillac",
	"Chevrolet",
	"Chrysler",
	"Citroën",
	"Dodge",
	"Ferrari",
	"Fiat",
	"Ford",
	"Genesis",
	"GMC",
	"Honda",
	"Hyundai",
	"Infiniti",
	"Jaguar",
	"Jeep",
	"Kia",
	"Lamborghini",
	"Land Rover",
	"Lexus",
	"Lincoln",
	"Lotus",
	"Maserati",
	"Mazda",
	"McLaren",
	"Mercedes-Benz",
	"Mini",
	"Mitsubishi",
	"Nissan",
	"Pagani",
	"Peugeot",
	"Porsche",
	"Ram",
	"Renault",
	"Rolls-Royce",
	"Saab",
	"Subaru",
	"Suzuki",
	"Tesla",
	"Toyota",
	"Volkswagen",
	"Volvo",
}

func SaveBrand(db *gorm.DB) {
	repo := repository.NewBrandRepository(db)
	for _, s := range listBrands {
		i := model.Brand{
			Name: s,
		}
		err := repo.Create(&i)
		if err != nil {
			log.Fatalf("Error brand -> Name%s: %v\n", i.Name, err)
		} else {
			fmt.Printf("Brand: %s\n", i.Name)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
