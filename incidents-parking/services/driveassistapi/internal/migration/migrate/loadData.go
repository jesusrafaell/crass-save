package migrate

import (
	"api/driveassist/internal/migration/contents"

	"github.com/fatih/color"
	"gorm.io/gorm"
)

func vehiclesData(db *gorm.DB) {
	// var wg sync.WaitGroup
	// wg.Add(0) //-1

	//vehicles
	// go func() { //1
	// 	defer wg.Done()
	contents.SaveBrand(db)
	color.Green("Brands")
	contents.SaveCarModels(db)
	color.Green("Models - Brands")
	// }()

	// go func() { //2
	// 	defer wg.Done()
	contents.SaveTypes(db)
	color.Green("Types")
	// }()

	// go func() { //3
	contents.SaveWeights(db)
	color.Green("Weights")
	// }()

	// go func() { //4
	// defer wg.Done()
	contents.SaveTypesMachine(db)
	color.Green("TypesMachine")
	// }()

	// go func() { //5
	// 	defer wg.Done()
	contents.SaveDriveDriveTypes(db)
	color.Green("DriveDriveTypes")
	// }()

	color.Blue("Finished Vehicle")
}

func towTruckData(db *gorm.DB) {
	color.Blue("Tow Truck:")
	// var wg sync.WaitGroup
	// wg.Add(0) //-1

	//vehicles
	// go func() { //1
	// 	defer wg.Done()
	contents.SaveMakeTowTruck(db)
	color.Green("Make")
	// }()

	// go func() { //2
	// 	defer wg.Done()
	contents.SaveCraneTypes(db)
	color.Green("Crane Types")
	// }()

	color.Blue("Finished Tow Truck")
}

func LoadData(db *gorm.DB) {
	// var wg sync.WaitGroup
	// go func() { //1
	// 	defer wg.Done()
	contents.SaveColor(db)
	color.Green("Color")
	contents.SaveCountries(db)
	color.Green("Countries")
	contents.SaveInsurances(db)
	color.Green("Insurances - Countries")

	vehiclesData(db)
	towTruckData(db)
	// }()

	// wg.Wait()

	color.Green("Finished Contents")
}
