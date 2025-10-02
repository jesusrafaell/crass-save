package migrate

import (
	"github.com/fatih/color"
	"gorm.io/gorm"
)

// func vehiclesData(db *gorm.DB) {
// 	//vehicles
// 	// contents.SaveMake(db)
// 	color.Green("Makes")
// 	// contents.SaveCarModels(db)
// 	color.Green("Makes_Models")

// 	// contents.SaveTypes(db)
// 	color.Green("Types")

// 	// contents.SaveWeights(db)
// 	color.Green("Weights")

// 	// contents.SaveEngineTypes(db)
// 	color.Green("EngineTypes")

// 	// contents.SaveDriveDriveTypes(db)
// 	color.Green("DriveDriveTypes")

// 	color.Blue("Finished Vehicle")
// }

// func towTruckData(db *gorm.DB) {
// 	color.Blue("Tow Truck:")
// 	// contents.SaveMakeTowTruck(db)
// 	color.Green("Make TowTruck")
// 	// contents.SaveCraneTypes(db)
// 	color.Green("Crane Types")
// 	color.Blue("Finished Tow Truck")
// }

func PreData(db *gorm.DB) {
	// contents.SaveColor(db)
	color.Green("Color")
	// contents.SaveCountries(db)
	color.Green("Countries")
	// contents.SaveInsurances(db)
	color.Green("Insurances - Countries")

	// vehiclesData(db)
	// towTruckData(db)

	color.Green("Finished Contents")
}
