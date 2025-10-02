package server

import (
	"authorization/app"
	pb "authorization/proto"
	"context"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/anypb"
)

func loggingInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (resp interface{}, err error) {
	startTime := time.Now()

	resp, err = handler(ctx, req)

	// methodName := util.GetMethodName(info.FullMethod)
	methodName := info.FullMethod

	log.Printf("Method: %s took %s to complete with error: %v\n", methodName, time.Since(startTime), err)

	return resp, err
}

func GRPCServerAndRun(port string, svc app.Authorization) error {

	grpcService := NewGRPCServicesServer(svc)

	ln, err := net.Listen("tcp", port)
	if err != nil {
		return err
	}

	// opts := []grpc.ServerOption{}
	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(loggingInterceptor),
	}

	server := grpc.NewServer(opts...)

	pb.RegisterAuthServiceServer(server, grpcService)

	log.Printf("Server AUTH (gRPC) running on localhost%s \n", port)

	return server.Serve(ln)
}

type GRPCServer struct {
	svc app.Authorization
	pb.UnimplementedAuthServiceServer
}

func NewGRPCServicesServer(svc app.Authorization) *GRPCServer {
	return &GRPCServer{
		svc: svc,
	}
}

func errorTokenResponse(err *app.ErrorAuth) *pb.TokenResponse {
	return &pb.TokenResponse{
		Error: errorResponse(err),
	}
}

func errorSessionReponse(err *app.ErrorAuth) *pb.SessionResponse {
	return &pb.SessionResponse{
		Error: errorResponse(err),
	}
}

func errorResponse(err *app.ErrorAuth) *pb.ErrorResponse {
	return &pb.ErrorResponse{
		MsgError:  err.Name,
		CodeError: err.Code,
	}
}

func ErrorResponse(err *app.ErrorAuth, code codes.Code) error {
	errProto := pb.ErrorAuth{
		Code: err.Code,
		Name: err.Name,
	}
	anyError, errAny := anypb.New(&errProto)
	if errAny != nil {
		return status.Errorf(codes.Internal, "Error converting details: %v", errAny)
	}

	st := status.New(code, err.Name)

	st, detailErr := st.WithDetails(anyError)
	if detailErr != nil {
		return status.Errorf(codes.Internal, "Error attaching details: %v", detailErr)
	}

	return st.Err()
}
