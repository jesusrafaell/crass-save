package contents

// import (
// 	"bitbucket.org/mya/mya-assistance-core/internal/vehicles/vmakes"
// 	"log"

// 	"gorm.io/gorm"
// )

// var listMakes = []string{
// 	"Acura",
// 	"Alfa Romeo",
// 	"Aston Martin",
// 	"Audi",
// 	"Bentley",
// 	"BMW",
// 	"Bugatti",
// 	"Buick",
// 	"Cadillac",
// 	"Chevrolet",
// 	"Chrysler",
// 	"Citroën",
// 	"Dodge",
// 	"Ferrari",
// 	"Fiat",
// 	"Ford",
// 	"Genesis",
// 	"GMC",
// 	"Honda",
// 	"Hyundai",
// 	"Infiniti",
// 	"Jaguar",
// 	"Jeep",
// 	"Kia",
// 	"Lamborghini",
// 	"Land Rover",
// 	"Lexus",
// 	"Lincoln",
// 	"Lotus",
// 	"Maserati",
// 	"Mazda",
// 	"McLaren",
// 	"Mercedes-Benz",
// 	"Mini",
// 	"Mitsubishi",
// 	"Nissan",
// 	"Pagani",
// 	"Peugeot",
// 	"Porsche",
// 	"Ram",
// 	"Renault",
// 	"Rolls-Royce",
// 	"Saab",
// 	"Subaru",
// 	"Suzuki",
// 	"Tesla",
// 	"Toyota",
// 	"Volkswagen",
// 	"Volvo",
// }

// func SaveMake(db *gorm.DB) {
// 	repo := vmakes.NewMakeRepository(db)
// 	for _, s := range listMakes {
// 		i := vmakes.Make{
// 			Name: s,
// 		}
// 		err := repo.Create(&i)
// 		if err != nil {
// 			log.Fatalf("Error Make -> Name%s: %v\n", i.Name, err)
// 			// } else {
// 			// fmt.Printf("Make: %s\n", i.Name)
// 		}
// 	}
// }
