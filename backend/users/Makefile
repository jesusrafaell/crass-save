tester:
	SECRETKEY=mysecretkey go test ./... -v

dev:
	go run ./cmd/api/main.go

build:
	go build -o bin/api main.go

run:build
	./bin/api

proto-auth:
	protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	proto/auth/service.proto

proto-msg:
	protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	proto/fcm/service.proto

.PHONY: proto