package main

import (
	"fmt"
	gRPC_Server "grpcTutorial/gRPC-Server"
	"log"
	"net"

	"google.golang.org/grpc"
)

func main() {

	println("gRPC Server")
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", 9000))
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	println("gRPC Server now listening on port 9000")

	grpcServer := grpc.NewServer()
	s := gRPC_Server.Server{}
	gRPC_Server.RegisterGameServiceServer(grpcServer, &s)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %s", err)
	}
}
