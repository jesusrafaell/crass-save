FROM golang:alpine AS builder

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o bin/server cmd/server/main.go

FROM alpine:latest

WORKDIR /app

COPY . .

COPY --from=builder /app/bin/server .

CMD ["./server"]
