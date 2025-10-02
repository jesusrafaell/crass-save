package main

import (
	"fmt"
	"log"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/google/uuid"
)

// productor (api)
func main() {
	producer, err := kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": "localhost:9092", // Dirección de tu broker de Kafka
		"batch.size":        16384,
		"linger.ms":         1,
	})
	if err != nil {
		log.Fatalf("Error al crear productor: %s", err)
	}
	defer producer.Close()

	topic := "_requests"

	// Función para manejar eventos de entrega
	go func() {
		for e := range producer.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					fmt.Printf("Error al enviar mensaje: %v\n", ev.TopicPartition)
				} else {
					fmt.Printf("Mensaje entregado en el tema %s [%d] en la partición %d\n",
						*ev.TopicPartition.Topic, ev.TopicPartition.Partition, ev.TopicPartition.Offset)
				}
			}
		}
	}()

	// Mensaje que vamos a enviar
	// menaje = uuid
	mensaje := uuid.New().String()

	// Enviar el mensaje al tema especificado
	err = producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          []byte(mensaje),
	}, nil)

	if err != nil {
		fmt.Printf("Error al producir el mensaje: %v\n", err)
	}

	// Asegurar que todos los mensajes se envíen antes de cerrar el productor
	producer.Flush(15 * 1000)
}
