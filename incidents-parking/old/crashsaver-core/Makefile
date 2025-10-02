PROTO_DIR=./src/proto/incident
PROTO_DIR_FCM=./src/proto/fcm

proto-incident:
	protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=${PROTO_DIR} \
    --ts_proto_opt=outputServices=grpc-js \
    --ts_proto_opt=esModuleInterop=true \
    -I ${PROTO_DIR}  \
    ${PROTO_DIR}/*.proto

proto-fcm:
	protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=${PROTO_DIR_FCM} \
    --ts_proto_opt=outputServices=grpc-js \
    --ts_proto_opt=esModuleInterop=true \
    -I ${PROTO_DIR_FCM}  \
    ${PROTO_DIR_FCM}/*.proto

.PHONY: proto protojs protots
