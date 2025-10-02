package contents

// var listEngineTypes = []enginetypes.EngineType{
// 	{ES: "Eléctrico", EN: "Electric"},
// 	{ES: "Gasolina", EN: "Gasoline"},
// 	{ES: "Gasoil", EN: "Diesel"},
// 	{ES: "Híbrido", EN: "Hybrid"},
// }

// func SaveEngineTypes(db *gorm.DB) {
// 	repo := enginetypes.NewEngineTypeRepository(db)
// 	for _, t := range listEngineTypes {
// 		err := repo.Create(&t)
// 		if err != nil {
// 			log.Fatalf("Error saving EngineType -> EN: %s, ES: %s, Error: %v\n", t.EN, t.ES, err)
// 			// } else {
// 			// 	fmt.Printf("EngineType: EN:%s, ES:%s\n", t.EN, t.ES)
// 		}
// 	}
// }
