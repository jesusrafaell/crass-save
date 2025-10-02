package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listMakeTowTruck = []string{
	"Miller Industries",
	"Jerr-Dan",
	"Vulcan",
	"Century",
	"Chevron",
	"Holmes",
	"Dynamic",
	"NRC Industries",
	"Fassi",
	"Palfinger",
	"Hiab",
	"Effer",
	"Bonfiglioli",
	"Zacklift",
	"Rotator",
	"Recovery Solutions",
	"Custom Built",
	"Eagle Towing Equipment",
	"Landoll",
	"Wrecker Bodies",
}

func SaveMakeTowTruck(db *gorm.DB) {
	repo := repository.NewMakeTowTruckRepository(db)
	for _, s := range listMakeTowTruck {
		i := model.MakeTowTruck{
			Name: s,
		}
		err := repo.Create(&i)
		if err != nil {
			log.Fatalf("Error Make -> Name%s: %v\n", i.Name, err)
		} else {
			fmt.Printf("Make: %s\n", i.Name)
		}
	}
}

// func DeleteTableBrand(db *gorm.DB) {
// 	err := db.Migrator().DropTable(&model.Brand{})
// 	if err != nil {
// 		log.Fatalf("Error Delete Model: %v", err)
// 	}
// }
