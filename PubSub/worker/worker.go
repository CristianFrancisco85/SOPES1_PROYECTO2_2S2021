package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"sync"
	"time"

	"cloud.google.com/go/pubsub"
	"github.com/go-redis/redis"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Winner struct {
	Game    string `json:"game"`
	Player  int    `json:"player"`
	Players int    `json:"players"`
	Gameid  int    `json:"gameid"`
}

type WinnerLog struct {
	Game    string
	Player  int
	Players int
	Gameid  int
	Worker  string
}

func main() {

	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS", "./GCPKey.json")

	psctx := context.Background()
	proj := "sapient-ground-324600"

	psclient, err := pubsub.NewClient(psctx, proj)
	if err != nil {
		log.Fatalf("Could not create pubsub Client: %v", err)
	}
	var mu sync.Mutex
	received := 0
	sub := psclient.Subscription("dbUpdates-sub")
	cctx, cancel := context.WithCancel(psctx)
	errps := sub.Receive(cctx, func(ctx context.Context, msg *pubsub.Message) {
		msg.Ack()
		fmt.Printf("Got message: %q\n", string(msg.Data))
		mu.Lock()
		defer mu.Unlock()
		received++
		if received == -1 {
			cancel()
		}

		//Convert string to Winner struct and insert to mongodb
		var winner Winner
		err = json.Unmarshal([]byte(string(msg.Data)), &winner)
		if err != nil {
			log.Fatal(err)
		}
		var winnerLog WinnerLog
		winnerLog.Game = winner.Game
		winnerLog.Player = winner.Player
		winnerLog.Players = winner.Players
		winnerLog.Gameid = winner.Gameid
		winnerLog.Worker = "PubSub"

		//Connect to mongodb
		client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://DummyAdmin:password85@104.197.101.28:27017/?authSource=admin"))
		if err != nil {
			log.Fatal(err)
		}
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		err = client.Connect(ctx)
		if err != nil {
			log.Fatal(err)
		}

		//Insert winner to mongodb
		collectionWinners := client.Database("squidgame").Collection("winners")
		_, err = collectionWinners.InsertOne(context.Background(), winner)
		if err != nil {
			log.Fatal(err)
		}
		collectionLogs := client.Database("squidgame").Collection("logs")
		_, err = collectionLogs.InsertOne(context.Background(), winnerLog)
		if err != nil {
			log.Fatal(err)
		}

		//Create Redis connection
		redisURL := os.Getenv("redisURL")
		redisPassword := os.Getenv("redisPassword")
		redisClient := redis.NewClient(&redis.Options{
			Addr:     redisURL,
			Password: redisPassword,
		})
		defer redisClient.Close()

		//Insert winner to redis
		redisClient.LPush("gamesList", winnerLog.Game)
		redisClient.ZIncrBy("gamesSort", 1, winnerLog.Game)
		redisClient.ZIncrBy("playersSort", 1, strconv.Itoa(winnerLog.Player))
		redisClient.ZIncrBy("workersSort", 1, winnerLog.Worker)

	})
	if errps != nil {
		log.Fatal(errps)
	}

}
