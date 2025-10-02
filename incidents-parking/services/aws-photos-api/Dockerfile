FROM golang:alpine AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/api cmd/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bin/api .
COPY --from=builder /app/env.production ./.env

CMD ["./api"]
