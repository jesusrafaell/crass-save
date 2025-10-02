FROM golang:alpine AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/api cmd/api/main.go

FROM alpine:latest

WORKDIR /app

COPY env.production .

RUN mv env.production .env

COPY --from=builder /app/bin/api .

CMD ["./api"]
