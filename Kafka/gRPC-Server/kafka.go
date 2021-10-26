package gRPC_Server

import (
	log "grpcTutorial/logger"

	"github.com/segmentio/kafka-go"
)

func Producer(servers []string, topic string) *kafka.Writer {
	return &kafka.Writer{
		Addr:         kafka.TCP(servers...),
		Topic:        topic,
		RequiredAcks: kafka.RequireOne,
		Logger:       kafka.LoggerFunc(log.Logger.Infof),
		ErrorLogger:  kafka.LoggerFunc(log.Logger.Errorf),
	}
}
