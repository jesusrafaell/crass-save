package server

import (
	"context"
	model "crashsaver/fcm/data"
	"crashsaver/fcm/internal/services"
	"crashsaver/fcm/proto"
	"crashsaver/fcm/util"
	"log"
	"net"
	"time"

	"google.golang.org/grpc"
)

func loggingInterceptor(
	ctx context.Context,
	req interface{},
	info *grpc.UnaryServerInfo,
	handler grpc.UnaryHandler,
) (resp interface{}, err error) {
	startTime := time.Now()

	resp, err = handler(ctx, req)

	methodName := util.GetMethodName(info.FullMethod)

	log.Printf("Method: %s took %s to complete with error: %v\n", methodName, time.Since(startTime), err)

	return resp, err
}

func GRPCServerAndRun(port string, svc services.Service) error {

	grpcFCMService := NewGRPCFCMServicesServer(svc)

	ln, err := net.Listen("tcp", port)
	if err != nil {
		return err
	}

	// opts := []grpc.ServerOption{}
	opts := []grpc.ServerOption{
		grpc.UnaryInterceptor(loggingInterceptor),
	}

	server := grpc.NewServer(opts...)

	proto.RegisterServiceMsgServer(server, grpcFCMService)

	log.Printf("Server FCM (gRPC) running on localhost%s \n", port)

	return server.Serve(ln)
}

type GRPCServer struct {
	svc services.Service
	proto.UnimplementedServiceMsgServer
}

func NewGRPCFCMServicesServer(svc services.Service) *GRPCServer {
	return &GRPCServer{
		svc: svc,
	}
}

func (s *GRPCServer) SendMessageFCM(ctx context.Context, req *proto.SendMessageFCMRequest) (*proto.SendMessageFCMResponse, error) {
	fcm := model.MessageFCM{
		FCMToken:  req.Fcm.FcmToken,
		Title:     req.Fcm.Title,
		Message:   req.Fcm.Message,
		Sound:     req.Fcm.Sound,
		ChannelID: req.Fcm.Channel,
	}

	_, err := s.svc.SendFCM(ctx, fcm)

	if err != nil {
		return nil, err
	}

	response := &proto.SendMessageFCMResponse{
		Fcm: req.Fcm,
		Ok:  true,
	}

	return response, nil
}

func (s *GRPCServer) SendMessgeWS(ctx context.Context, req *proto.SendMessageWSRequest) (*proto.BaseResponse, error) {

	ws := model.MessageWS{
		To:   req.Ws.To,
		Body: req.Ws.Msg,
	}

	err := s.svc.SendOTPWithWS(ctx, ws)

	if err != nil {
		return nil, err
	}

	return &proto.BaseResponse{
		Ok: true,
	}, nil
}
