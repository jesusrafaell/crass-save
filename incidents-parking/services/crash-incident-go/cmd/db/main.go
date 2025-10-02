package main

// import (
// 	"crashsaver/incident/db"
// 	"crashsaver/incident/internal/initializations"
// 	"log"
// 	"os"

// 	"github.com/fatih/color"
// 	"github.com/joho/godotenv"
// )

// func main() {

// 	if err := godotenv.Load(); err != nil {
// 		log.Fatal("Error loading .env file")
// 	}

// 	env := os.Getenv("ENV")
// 	log.Printf("%s\n", env)

// 	uriRead := os.Getenv("MONGO_URL_CONNECTION_READ")
// 	uriWrite := os.Getenv("MONGO_URL_CONNECTION_WRITE")

// 	dbName := os.Getenv("DB_NAME")

// 	clientsMongo := db.NewConnectionMongo(uriRead, uriWrite)
// 	database := db.ConectionDB(clientsMongo, dbName)

// 	//Incidents Mobile
// 	errIM := initializations.CreateCollecionIncidents(database, db.CollectionMobileincidents)
// 	if errIM != nil {
// 		log.Fatalf("Error in mobileincidents %v", errIM)
// 	}

// 	//Incidents Static
// 	errIS := initializations.CreateCollecionIncidents(database, db.CollectionStaticIncidents)
// 	if errIS != nil {
// 		log.Fatalf("Error in mobileincidents %v", errIS)
// 	}

// 	//VerifyIncidents
// 	errV := initializations.CreateCollecionVerifyIncidents(database, db.CollectionVerifyIncidents)
// 	if errV != nil {
// 		log.Fatalf("Error in verifyincidents %v", errV)
// 	}

// 	color.Yellow("Created Collections")

// }
