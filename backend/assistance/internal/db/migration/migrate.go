package migrate

import (
	"reflect"

	"github.com/fatih/color"
	"gorm.io/gorm"
)

func RunMigrate(db *gorm.DB) {
	var err error
	models := []interface{}{
		// &model.DriveTrainType{},
		// &model.Country{},
		// &model.Insurance{},
		// &model.Color{},
		// &model.Weight{},
		// &model.EngineType{},
		// &model.Type{},
		// &model.CraneType{},
		// &model.Model{},
		// &model.Make{},
		// &model.MakeTowTruck{},
		// &model.MakeModel{},
		// &model.Vehicle{},
		// &model.TowTruck{},
		// &model.AssistanceRequest{},
		// &model.RequestDriver{},
		// &model.HistoryGasolineTowTruck{},
		// &model.TowTruckExpenseHistory{},
		// &model.CompanyPriceKm{},
	}

	for _, model := range models {
		err = db.AutoMigrate(model)
		if err != nil {
			panic("Error migration: " + err.Error())
		}
		color.Green("Migrated: %v", reflect.TypeOf(model).Elem().Name())
	}

	color.Blue("Finish Migration")
}

func RunDropTables(db *gorm.DB) {
	models := []interface{}{
		// &model.DriveTrainType{},
		// &model.Country{},
		// &model.Insurance{},
		// &model.Color{},
		// &model.Weight{},
		// &model.EngineType{},
		//types
		// &model.Type{},
		// &model.CraneType{},
		//models and makes
		// &model.Model{},
		// &model.Make{},
		// &model.MakeTowTruck{},
		// &model.MakeModel{},
		//vehicles
		// &model.Vehicle{},
		// &model.TowTruck{},
		//request
		// &model.AssistanceRequest{},
		// &model.RequestDriver{},
		// &model.HistoryGasolineTowTruck{},
		// &model.TowTruckExpenseHistory{},
		// &model.CompanyPriceKm{},
	}

	for _, model := range models {
		// log.Printf("%s\n", reflect.TypeOf(model).Elem().Name())
		err := db.Migrator().DropTable(model)
		if err != nil {
			panic("Error dropping table: " + err.Error())
		}
		color.Red("Dropped: %v", reflect.TypeOf(model).Elem().Name())
	}

	color.Yellow("Finished dropping")
}
