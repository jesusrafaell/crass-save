package contents

// type insurancesContent struct {
// 	Name      string
// 	Countries []string // Nombres de los países en inglés
// }

// var listInsurances = []insurancesContent{
// 	{"Mapfre", []string{"Spain", "Venezuela"}},
// 	{"Allianz", []string{"Spain", "Colombia"}},
// 	{"Sancor", []string{"Argentina"}},
// }

// func SaveInsurances(db *gorm.DB) {
// 	insuranceRepo := insurances.NewInsuranceRepository(db)
// 	countryRepo := countries.NewCountryRepository(db)

// 	for _, ins := range listInsurances {
// 		var countries []countries.Country
// 		// Encuentra y añade los países a la aseguradora
// 		for _, countryName := range ins.Countries {
// 			country, err := countryRepo.GetByName(countryName)
// 			if err != nil {
// 				log.Fatalf("Error finding country '%s': %v\n", countryName, err)
// 			}
// 			countries = append(countries, *country)
// 		}

// 		// Crea la aseguradora con sus países
// 		insurance := insurances.Insurance{
// 			Name:      ins.Name,
// 			Countries: countries,
// 		}

// 		err := insuranceRepo.Create(&insurance)
// 		if err != nil {
// 			log.Fatalf("Error saving Insurance: '%s', %v\n", ins.Name, err)
// 			// } else {
// 			// fmt.Printf("Insurance: %s\n", insurance.Name)
// 		}
// 	}
// }
