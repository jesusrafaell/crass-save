package migrate

import (
	"api/driveassist/data/model"
	"fmt"
	"reflect"

	"github.com/fatih/color"
	"gorm.io/gorm"
)

func RunMigrate(db *gorm.DB) {
	var err error
	models := []interface{}{
		// &model.Vehicle{},
		// &model.DriveTrainType{},
		// &model.Color{},
		// &model.Model{},
		// &model.Brand{},
		// &model.BrandModel{},
		// &model.Type{},
		// &model.Weight{},
		// &model.TypeMachine{},
		// &model.Insurance{},
		// &model.Country{},
		// &model.InsuranceCountry{},
		// //new
		// &model.TowTruck{},
		// &model.CraneType{},
		// &model.MakeTowTruck{},
		//
		&model.AssistanceRequest{},
	}

	for _, model := range models {
		err = db.AutoMigrate(model)
		if err != nil {
			panic("Error migration: " + err.Error())
		}
		color.Green("Migrated: %v", reflect.TypeOf(model).Elem().Name())
	}

	fmt.Println("Finish Migration")
}

func RunDropTables(db *gorm.DB) {
	models := []interface{}{
		// &model.InsuranceCountry{},
		// &model.Country{},
		// &model.Insurance{},
		// &model.TypeMachine{},
		// &model.Weight{},
		// &model.Type{},
		// &model.BrandModel{},
		// &model.Brand{},
		// &model.Model{},
		// &model.Color{},
		// &model.DriveTrainType{},
		// &model.Vehicle{},
		// //new
		// &model.MakeTowTruck{},
		// &model.CraneType{},
		// &model.TowTruck{},
		//
		&model.AssistanceRequest{},
	}

	for _, model := range models {
		// log.Printf("%s\n", reflect.TypeOf(model).Elem().Name())
		err := db.Migrator().DropTable(model)
		if err != nil {
			panic("Error dropping table: " + err.Error())
		}
		color.Green("Dropped: %v", reflect.TypeOf(model).Elem().Name())
	}

	fmt.Println("Finished dropping")
}
