package contents

// var listDriveTrainType = []drivetraintypes.DriveTrainType{
// 	{ES: "Tracción Delantera (FWD)", EN: "Front Wheel Drive (FWD)"},
// 	{ES: "Tracción Trasera (FWD)", EN: "Rear Wheel Drive (RWD)"},
// 	{ES: "Tracción cuatro ruedas (4x4)", EN: "Four Wheel Drive (4x4)"},
// 	{ES: "Tracción Total (AWD)", EN: "All Wheel Drive (AWD)"},
// }

// func SaveDriveDriveTypes(db *gorm.DB) {
// 	repo := drivetraintypes.NewDriveTrainTypeRepository(db)
// 	for _, t := range listDriveTrainType {
// 		err := repo.Create(&t)
// 		if err != nil {
// 			log.Fatalf("Error saving DriveTrainType  -> EN: %s, ES: %s, Error: %v\n", t.EN, t.ES, err)
// 			// } else {
// 			// 	fmt.Printf("DriveTrainType -> EN: %s, ES: %s\n", t.EN, t.ES)
// 		}
// 	}
// }
