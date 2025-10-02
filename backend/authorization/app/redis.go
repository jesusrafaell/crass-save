package app

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/go-redis/redis/v8"
)

func NewClientRedis(host, port string) (*redis.Client, error) {

	rdb := redis.NewClient(&redis.Options{
		Addr:         host + ":" + port,
		DB:           0,
		Password:     "",
		PoolSize:     100,
		MinIdleConns: 10,
	})

	// Ping a Redis con un timeout para evitar bloqueos si no responde
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("Error connecting to Redis at %s: %v", host+":"+port, err)
		return nil, err
	}

	fmt.Printf("Redis connected %s\n", host+":"+port)

	return rdb, nil
}
