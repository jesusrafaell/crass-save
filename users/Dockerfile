FROM golang:1.22.6-alpine AS builder

WORKDIR /app

COPY . .
RUN go mod download

RUN go build -o bin/api cmd/api/main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/bin/api .
COPY --from=builder /app/firabase/ ./firabase/
COPY --from=builder /app/.env .

CMD ["./api"]
