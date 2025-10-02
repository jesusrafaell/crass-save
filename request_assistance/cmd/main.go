package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

// consumidor
func main() {
	// groupId := uuid.New()
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "localhost:9092", // Dirección de tu broker de Kafka
		"group.id":          "group" + "assistances",
		"auto.offset.reset": "earliest", // Lee mensajes desde el principio si no hay offset
	})
	if err != nil {
		log.Fatalf("Error al crear consumidor: %s", err)
	}
	defer consumer.Close()

	// Suscribirse al tema
	topic := "_requests"
	err = consumer.SubscribeTopics([]string{topic}, nil)
	if err != nil {
		log.Fatalf("Error al suscribirse al tema: %s", err)
	}

	fmt.Printf("Esperando mensajes del tema %s...\n", topic)

	// Bucle para leer mensajes
	for {
		msg, err := consumer.ReadMessage(-1)
		if err == nil {
			fmt.Printf("Mensaje recibido en %s: %s\n", msg.TopicPartition, string(msg.Value))
		} else {
			fmt.Printf("Error al leer mensaje: %v (%v)\n", err, msg)
		}
	}
}

// #create theme
/*
 bin/kafka-topics.sh --create --topic _requests --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
*/

// eliminar menajes
/*
 bin/kafka-configs.sh --alter --zookeeper localhost:2181 --entity-type topics --entity-name mi_tema --add-config retention.ms=60000

 3 minutes
bin/kafka-configs.sh --alter --bootstrap-server localhost:9092 --entity-type topics --entity-name _requests --add-config retention.ms=180000
bin/kafka-topics.sh --describe --topic _requests --bootstrap-server localhost:9092



*/

// consumer
/*
bin/kafka-console-consumer.sh --topic _requests --bootstrap-server localhost:9092 --from-beginning
*/
