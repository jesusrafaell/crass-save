package contents

// var listMakeTowTruck = []string{
// 	"Miller Industries",
// 	"Jerr-Dan",
// 	"Vulcan",
// 	"Century",
// 	"Chevron",
// 	"Holmes",
// 	"Dynamic",
// 	"NRC Industries",
// 	"Fassi",
// 	"Palfinger",
// 	"Hiab",
// 	"Effer",
// 	"Bonfiglioli",
// 	"Zacklift",
// 	"Rotator",
// 	"Recovery Solutions",
// 	"Custom Built",
// 	"Eagle Towing Equipment",
// 	"Landoll",
// 	"Wrecker Bodies",
// }

// func SaveMakeTowTruck(db *gorm.DB) {
// 	repo := ttmakes.NewMakeTowTruckRepository(db)
// 	for _, s := range listMakeTowTruck {
// 		i := ttmakes.Makes{
// 			Name: s,
// 		}
// 		err := repo.Create(&i)
// 		if err != nil {
// 			log.Fatalf("Error Make -> Name%s: %v\n", i.Name, err)
// 			// } else {
// 			// 	fmt.Printf("Make: %s\n", i.Name)
// 		}
// 	}
// }
