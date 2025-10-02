FROM golang:1.22.6-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/app main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bin/app .
COPY --from=builder /app/config/ ./config/
COPY --from=builder /app/.env .

EXPOSE 3000

CMD ["./app", "docker"]
