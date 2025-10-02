package contents

import (
	"api/driveassist/data/model"
	"api/driveassist/internal/repository"
	"fmt"
	"log"

	"gorm.io/gorm"
)

var listBrandModels = map[string][]string{
	"Acura":         {"TLX", "RDX", "MDX"},
	"Alfa Romeo":    {"Giulia", "Stelvio"},
	"Aston Martin":  {"Vantage", "DB11", "DBS Superleggera"},
	"Audi":          {"A4", "A6", "Q5", "Q7"},
	"Bentley":       {"Bentayga", "Continental GT", "Flying Spur"},
	"BMW":           {"3 Series", "5 Series", "X5", "i3"},
	"Bugatti":       {"Chiron", "Veyron"},
	"Buick":         {"Enclave", "Encore", "LaCrosse"},
	"Cadillac":      {"Escalade", "CT5", "XT5"},
	"Chevrolet":     {"Camaro", "Silverado", "Malibu", "Equinox"},
	"Chrysler":      {"300", "Pacifica"},
	"Citroën":       {"C3", "C5 Aircross"},
	"Dodge":         {"Charger", "Challenger", "Durango"},
	"Ferrari":       {"488", "Portofino", "Roma"},
	"Fiat":          {"500", "Panda"},
	"Ford":          {"Mustang", "F-150", "Explorer", "Focus"},
	"Genesis":       {"G70", "G80"},
	"GMC":           {"Sierra", "Yukon", "Acadia"},
	"Honda":         {"Civic", "Accord", "CR-V", "Pilot"},
	"Hyundai":       {"Elantra", "Sonata", "Tucson"},
	"Infiniti":      {"Q50", "QX60"},
	"Jaguar":        {"XE", "F-PACE", "F-TYPE"},
	"Jeep":          {"Wrangler", "Grand Cherokee"},
	"Kia":           {"Optima", "Sorento", "Sportage"},
	"Lamborghini":   {"Huracán", "Aventador", "Urus"},
	"Land Rover":    {"Range Rover", "Discovery", "Defender"},
	"Lexus":         {"RX", "ES", "NX", "I7"},
	"Lincoln":       {"Navigator", "Continental"},
	"Lotus":         {"Evora", "Elise"},
	"Maserati":      {"Ghibli", "Levante"},
	"Mazda":         {"Mazda3", "Mazda6", "CX-5"},
	"McLaren":       {"720S", "GT", "P1"},
	"Mercedes-Benz": {"C-Class", "E-Class", "S-Class", "GLE"},
	"Mini":          {"Cooper", "Countryman"},
	"Mitsubishi":    {"Outlander", "Eclipse Cross"},
	"Nissan":        {"Altima", "Maxima", "Rogue"},
	"Pagani":        {"Huayra", "Zonda"},
	"Peugeot":       {"208", "3008", "307CC"},
	"Porsche":       {"911", "Cayenne", "Panamera"},
	"Ram":           {"1500", "2500"},
	"Renault":       {"Clio", "Megane", "Captur"},
	"Rolls-Royce":   {"Phantom", "Ghost", "Cullinan"},
	"Saab":          {"9-3", "9-5"}, // Nota: Saab ya no está en producción activa.
	"Subaru":        {"Outback", "Forester", "Impreza"},
	"Suzuki":        {"Swift", "Vitara"},
	"Tesla":         {"Model S", "Model 3", "Model X", "Model Y"},
	"Toyota":        {"Corolla", "Camry", "Prius", "RAV4"},
	"Volkswagen":    {"Golf", "Passat", "Tiguan"},
	"Volvo":         {"XC90", "S60", "V60"},
}

func SaveCarModels(db *gorm.DB) {
	brandRepo := repository.NewBrandRepository(db)
	modelRepo := repository.NewModelRepository(db)

	for brandName, models := range listBrandModels {
		// Obtener la marca
		brand, err := brandRepo.GetByName(brandName)
		if err != nil {
			log.Fatalf("Error finding brand '%s': %v", brandName, err)
		}
		fmt.Printf("%s:\n", brand.Name)
		for _, modelName := range models {
			modelData := &model.Model{
				Name: modelName,
			}
			err := modelRepo.Create(modelData, brand.ID)
			if err != nil {
				log.Fatalf("Error creating model %s: Brand:%s %v", modelName, brandName, err)
			} else {
				fmt.Printf("Model created: %s, Model: %s, Brand ID: %s\n", modelData.Name, modelData.Name, brand.Name)
			}
		}
	}
}

func DeleteTableModel(db *gorm.DB) {
	err := db.Migrator().DropTable(&model.Model{})
	if err != nil {
		log.Fatalf("Error Delete Model: %v", err)
	}
}
