package autotask

import (
	"crashsaver/incident/internal/repository"
	"fmt"
	"log"

	"github.com/robfig/cron/v3"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupScheduledTasks(db *mongo.Database) {
	c := cron.New()

	incidentStaticRepo := repository.NewIncidentStatictRepository(db)

	hour := 23
	minutes := 59

	//minutes, hour, moth, day
	schedule := fmt.Sprintf("%d %d * * *", minutes, hour)
	_, err := c.AddFunc(schedule, func() {
		//tasks 12:00 am
		total, err := incidentStaticRepo.UpdateAllIncidentsStatus(12)
		if err != nil {
			log.Printf("error (UpdateAllIncidentsStatus), %s", err)
		}

		//Time exec, and res
		log.Printf("AutoTask runed")
		log.Printf("Incidents static Closed: %d", total)
	})
	if err != nil {
		log.Printf("%v", err)
	}

	fmt.Printf("AutoTask Run: %d:%d \n", hour, minutes)
	c.Start()
}
