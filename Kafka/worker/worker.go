package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/go-redis/redis"
	kafka "github.com/segmentio/kafka-go"
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

func getKafkaReader(kafkaURL, topic, groupID string) *kafka.Reader {
	return kafka.NewReader(kafka.ReaderConfig{
		Brokers:  []string{kafkaURL},
		GroupID:  groupID,
		Topic:    topic,
		MinBytes: 10e3, // 10KB
		MaxBytes: 10e6, // 10MB
	})
}

func main() {

	kafkaURL := os.Getenv("kafkaURL")
	topic := os.Getenv("topic")
	groupID := os.Getenv("groupID")
	reader := getKafkaReader(kafkaURL, topic, groupID)

	defer reader.Close()

	fmt.Println("Start consuming ... !!")

	for {
		msg, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("message at topic:%v partition:%v offset:%v	%s = %s\n", msg.Topic, msg.Partition, msg.Offset, string(msg.Key), string(msg.Value))

		//Convert string to Winner struct and insert to mongodb
		var winner Winner
		err = json.Unmarshal([]byte(string(msg.Value)), &winner)
		if err != nil {
			log.Fatal(err)
		}
		var winnerLog WinnerLog
		winnerLog.Game = winner.Game
		winnerLog.Player = winner.Player
		winnerLog.Players = winner.Players
		winnerLog.Gameid = winner.Gameid
		winnerLog.Worker = "Kafka"

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

	}

}
