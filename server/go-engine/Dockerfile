FROM golang:1.23-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o engine go_smpp_engine_example.go
FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/engine .
CMD ["./engine"]