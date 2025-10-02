package contents

// var listCountries = []countries.Country{
// 	{
// 		ES: "Colombia",
// 		EN: "Colombia",
// 	},
// 	{
// 		ES: "España",
// 		EN: "Spain",
// 	},
// 	{
// 		ES: "Venezuela",
// 		EN: "Venezuela",
// 	},
// 	{
// 		ES: "Argentina",
// 		EN: "Argentina",
// 	},
// }

// func SaveCountries(db *gorm.DB) {
// 	repo := countries.NewCountryRepository(db)
// 	for _, c := range listCountries {
// 		err := repo.Create(&c)
// 		if err != nil {
// 			log.Fatalf("Error saving country -> EN: %s, ES: %s, Error: %v\n", c.EN, c.ES, err)
// 		} else {
// 			// fmt.Printf("Country: EN:%s, ES:%s\n", c.EN, c.ES)
// 		}
// 	}
// }
