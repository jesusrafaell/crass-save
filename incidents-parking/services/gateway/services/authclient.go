package services

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/fatih/color"
	"google.golang.org/grpc"
	"google.golang.org/grpc/connectivity"
)

var (
	Conn        *grpc.ClientConn
	ConnErr     error
	connMutex   sync.Mutex
	GrpcAddress string
)

// estable connection
func InitGRPCConnection() {
	connMutex.Lock()
	defer connMutex.Unlock()

	if Conn == nil || Conn.GetState() == connectivity.TransientFailure || Conn.GetState() == connectivity.Shutdown {
		color.Green("Create Connection GRPC AUTH: %s", GrpcAddress)
		// Create a context with timeout
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second) // Adjust the timeout duration as needed
		defer cancel()

		Conn, ConnErr = grpc.DialContext(ctx, GrpcAddress, grpc.WithInsecure(), grpc.WithBlock())
		if ConnErr != nil {
			log.Printf("GRPC Connected Error: %v", ConnErr)
		}
	}
}

