package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"
)

type Game struct {
	Players int `json:"players"`
}

var okPost int = 0
var errorPost int = 0

//35.239.53.123.nip.io
//go run main.go -gameName='random|evenNumber|oddNumber' -players=250 -rungames=50 -concurrence=2 -timeout=150
func main() {

	messages := make(chan string)

	var LOADBALANCER_URL string = "35.239.53.123.nip.io"
	//fmt.Println("Ingrese EndPonit: ")
	//fmt.Scanf("%s", &LOADBALANCER_URL)

	var gameName string
	flag.StringVar(&gameName, "gameName", "", "Game name")

	var players int
	flag.IntVar(&players, "players", 0, "Number of players")

	var rungames int
	flag.IntVar(&rungames, "rungames", 0, "Number of games to run")

	var concurrence int
	flag.IntVar(&concurrence, "concurrence", 0, "Number of simultaneous requests")

	var timeout int
	flag.IntVar(&timeout, "timeout", 0, "Timeout in seconds for each request")

	flag.Parse()

	//Split string gameName in array of strings by separator "|"
	gameNameArray := strings.Split(gameName, "|")

	go myTimeout(timeout)

	for i := 0; i <= rungames; {
		fmt.Println("***********************************************")
		for j := 0; j < concurrence; j++ {

			go func(index int) {
				fmt.Println("Running Game: " + fmt.Sprintf("%d", index))
				var game Game
				var numPlayers int = 1 + (int)((float32(players) * rand.Float32()))
				game.Players = numPlayers
				gameJSON, err := json.Marshal(game)
				if err != nil {
					fmt.Println("Error: ", err)
				}

				var gameNameCounter int = rand.Intn(len(gameNameArray))
				if err != nil {
					fmt.Println("Error: ", err)
				}

				req, err := http.NewRequest("POST", "http://"+LOADBALANCER_URL+"/"+gameNameArray[gameNameCounter], bytes.NewBuffer(gameJSON))
				client := &http.Client{}
				//Set heade Accept
				req.Header.Set("Accept", "*/*")
				resp, err := client.Do(req)
				if err != nil {
					panic(err)
				}
				defer resp.Body.Close()

				if resp.StatusCode == 200 {
					okPost = okPost + 1
					messages <- "OK Game: " + fmt.Sprintf("%d", index)
				} else {
					errorPost = errorPost + 1
					messages <- "ERROR Game: " + fmt.Sprintf("%d", index)
				}

			}(i)
			i++
		}
		for k := 0; k < concurrence; k++ {
			fmt.Println(<-messages)
		}
	}

	fmt.Println("Solicitudes Exitosas:", okPost)
	fmt.Println("Solicitudes Fracasadas:", errorPost)

}

func myTimeout(timeout int) {
	select {
	case <-time.After(time.Second * time.Duration(timeout)):
		fmt.Println("Timeout")
		fmt.Println("Solicitudes Exitosas:", okPost)
		fmt.Println("Solicitudes Fracasadas:", errorPost)
		os.Exit(1)
	}
}
