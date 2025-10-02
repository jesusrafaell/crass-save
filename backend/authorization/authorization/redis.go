package authorization

import (
	"context"
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
)

func newClientRedis() (*redis.Client, error) {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")

	rdb := redis.NewClient(&redis.Options{
		Addr: host + ":" + port,
		DB:   0,
	})

	if err := rdb.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}

	fmt.Printf("Redis connected %s\n", host+":"+port)

	return rdb, nil
}
