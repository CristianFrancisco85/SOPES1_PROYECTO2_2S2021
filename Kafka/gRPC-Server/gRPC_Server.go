package gRPC_Server

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"

	kafka "github.com/segmentio/kafka-go"
)

type Server struct {
}

type client struct {
	bufferSize uint
	writer     *kafka.Writer
}

func getKafkaWriter(kafkaURL, topic string) *kafka.Writer {
	return &kafka.Writer{
		Addr:     kafka.TCP(kafkaURL),
		Topic:    topic,
		Balancer: &kafka.LeastBytes{},
	}
}

func (s *Server) SendMessage(ctx context.Context, in *GameRequest) (*GameReply, error) {
	kafkaURL := os.Getenv("kafkaURL")
	topic := os.Getenv("topic")
	kafkaWriter := getKafkaWriter(kafkaURL, topic)
	defer kafkaWriter.Close()
	var winner GameWinner
	if in.GetName() == "random" {
		winner.Game = "random"
		winner.Player = random(int(in.GetPlayers()))
	}
	if in.GetName() == "evenNumber" {
		winner.Game = "evenNumber"
		winner.Player = evenNumber(int(in.GetPlayers()))
	}
	if in.GetName() == "oddNumber" {
		winner.Game = "oddNumber"
		winner.Player = oddNumber(int(in.GetPlayers()))
	}
	producerHandler(kafkaWriter, &winner)
	return &GameReply{Body: "OK"}, nil
}

func producerHandler(kafkaWriter *kafka.Writer, myItem *GameWinner) {

	id := strconv.Itoa(rand.Int())
	//Convert proto to string

	data, err := json.MarshalIndent(myItem, "", "\t")
	if err != nil {
		return
	}
	msg := kafka.Message{
		Key:   []byte(id),
		Value: data,
	}
	err = kafkaWriter.WriteMessages(context.Background(), msg)
	if err != nil {
		log.Fatalln(err)
	}

}

func random(players int) int32 {

	rand.Seed(time.Now().UnixNano())
	min := 0
	max := players
	winner := rand.Intn(max-min+1) + min

	return int32(winner)
}

func evenNumber(players int) int32 {

	rand.Seed(time.Now().UnixNano())
	min := 0
	max := players
	var winner = rand.Intn(max-min+1) + min

	for winner%2 != 0 {
		rand.Seed(time.Now().UnixNano())
		winner = rand.Intn(max-min+1) + min
	}
	return int32(winner)
}

func oddNumber(players int) int32 {

	rand.Seed(time.Now().UnixNano())
	min := 0
	max := players
	var winner = rand.Intn(max-min+1) + min

	for winner%2 == 0 {
		rand.Seed(time.Now().UnixNano())
		winner = rand.Intn(max-min+1) + min
	}
	return int32(winner)
}
