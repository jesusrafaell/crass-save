API_DOCKER_COMPOSE_FILE := docker-compose.user.dev.yml
GRPC_DOCKER_COMPOSE_FILE := docker-compose.grpc.dev.yml

api-dev-up:
	sudo docker-compose -f $(API_DOCKER_COMPOSE_FILE) up -d --build

grpc-dev-up:
	sudo docker-compose -f $(GRPC_DOCKER_COMPOSE_FILE) up -d --build

PROTO_DIR=./src/proto/auth

proto-auth:
	protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=${PROTO_DIR} \
    --ts_proto_opt=outputServices=grpc-js \
    --ts_proto_opt=esModuleInterop=true \
    -I ${PROTO_DIR}  \
    ${PROTO_DIR}/*.proto

.PHONY: proto protojs protots