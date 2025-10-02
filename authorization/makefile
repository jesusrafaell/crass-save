dev:
	go run main.go

build:
	go build -o bin/app main.go

run:build
	./bin/app

proto:
	protoc --go_out=. --go_opt=paths=source_relative \
	--go-grpc_out=. --go-grpc_opt=paths=source_relative \
	proto/service.proto

.PHONY: proto