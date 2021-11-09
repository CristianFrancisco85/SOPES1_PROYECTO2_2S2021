package main

//Imports
import (
	"context"
	gRPC_Server "grpcTutorial/gRPC-Server"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

type game struct {
	Players int32 `json:"players"`
}

var g gRPC_Server.GameServiceClient

//Main definition
func main() {

	//Configuracion y conexion de gRPC
	var conn *grpc.ClientConn
	conn, err := grpc.Dial(":9000", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Did not connect: %s", err)
	}
	defer conn.Close()

	//Se inicia el cliente gRPC
	g = gRPC_Server.NewGameServiceClient(conn)
	//Se inicia servidor HTTP
	router := gin.Default()
	router.GET("/", defaultPath)
	router.POST("/random", random)
	router.POST("/evenNumber", evenNumber)
	router.POST("/oddNumber", oddNumber)
	router.Run("0.0.0.0:8080")

}

func defaultPath(c *gin.Context) {
	c.Status(http.StatusOK)
}

func random(c *gin.Context) {

	var newGame game
	if err := c.BindJSON(&newGame); err != nil {
		return
	}

	response, err := g.SendMessage(context.Background(), &gRPC_Server.GameRequest{Name: "random", Players: newGame.Players})
	if err != nil {
		log.Fatalf("Error when calling SendMessage: %s", err)
	}
	log.Printf("Response from server: %s", response.Body)
	c.Status(http.StatusOK)

}

func evenNumber(c *gin.Context) {

	var newGame game
	if err := c.BindJSON(&newGame); err != nil {
		return
	}

	response, err := g.SendMessage(context.Background(), &gRPC_Server.GameRequest{Name: "evenNumber", Players: newGame.Players})
	if err != nil {
		log.Fatalf("Error when calling SendMessage: %s", err)
	}
	log.Printf("Response from server: %s", response.Body)
	c.Status(http.StatusOK)
}

func oddNumber(c *gin.Context) {

	var newGame game
	if err := c.BindJSON(&newGame); err != nil {
		return
	}

	response, err := g.SendMessage(context.Background(), &gRPC_Server.GameRequest{Name: "oddNumber", Players: newGame.Players})
	if err != nil {
		log.Fatalf("Error when calling SendMessage: %s", err)
	}
	log.Printf("Response from server: %s", response.Body)
	c.Status(http.StatusOK)
}
