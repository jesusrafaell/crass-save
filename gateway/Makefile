dev-docker:
	go run main.go

dev:
	go run main.go dev

build:
	go build -o bin/api main.go

run:build
	./bin/api


proto-auth:
	protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	proto/auth.proto

.PHONY: proto
