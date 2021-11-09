package gRPC_Server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"cloud.google.com/go/pubsub"
)

type Server struct {
}

func (s *Server) SendMessage(ctx context.Context, in *GameRequest) (*GameReply, error) {

	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "./gRPC-Server/GCPKey.json")

	psctx := context.Background()
	proj := "sapient-ground-324600"

	psclient, err := pubsub.NewClient(psctx, proj)
	if err != nil {
		log.Fatalf("Could not create pubsub Client: %v", err)
	}
	const topic = "dbUpdates"

	var winner GameWinner
	if in.GetName() == "random" {
		winner.Game = "random"
		winner.Gameid = 1
		winner.Player = random(int(in.GetPlayers()))
	}
	if in.GetName() == "evenNumber" {
		winner.Game = "evenNumber"
		winner.Gameid = 2
		winner.Player = evenNumber(int(in.GetPlayers()))
	}
	if in.GetName() == "oddNumber" {
		winner.Game = "oddNumber"
		winner.Gameid = 3
		winner.Player = oddNumber(int(in.GetPlayers()))
	}
	winner.Players = in.GetPlayers()
	if err := producerHandler(&winner, psclient, topic); err != nil {
		log.Fatalf("Could not publish message: %v", err)
	}
	return &GameReply{Body: "OK"}, nil
}

func producerHandler(myItem *GameWinner, client *pubsub.Client, topic string) error {

	data, err := json.MarshalIndent(myItem, "", "\t")
	if err != nil {
		return nil
	}

	ctx := context.Background()
	t := client.Topic(topic)
	result := t.Publish(ctx, &pubsub.Message{
		Data: []byte(data),
	})
	id, err := result.Get(ctx)
	if err != nil {
		return err
	}
	fmt.Printf("Published a message; msg ID: %v\n", id)
	return nil

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
