FROM golang:1.21-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o enfor-backend ./cmd/server/main.go

FROM alpine:3.20

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=build /app/enfor-backend ./enfor-backend

RUN mkdir -p uploads && chown -R app:app /app

USER app

EXPOSE 8080

CMD ["./enfor-backend"]
