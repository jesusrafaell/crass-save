package server

import (
	"authorization/app"
	"context"
	"log"
	"time"

	pb "authorization/proto"

	"google.golang.org/grpc/codes"
)

func (s *GRPCServer) GenerateSession(_ context.Context, req *pb.CreateAuth) (*pb.TokenResponse, error) {
	claims := app.Claims{
		UserID:     req.Claims.UserId,
		Email:      req.Claims.Email,
		RoleKey:    req.Claims.RoleKey,
		CompanyKey: req.Claims.CompanyKey,
		OS:         req.Claims.Os,
		CreatedAt:  time.Now().Unix(),
	}

	token, err := s.svc.GenerateSession(&claims, req.ExpHours)

	if err != nil {
		log.Println("Error GenerateSession userId:", claims.UserID, err)
		return nil, err
	}

	log.Printf("New Session userId: %s, email: %s, os: %s, sessionId: %s\n", claims.UserID, claims.Email, claims.OS, claims.SessionID)

	response := &pb.TokenResponse{
		Token: token,
	}
	return response, nil
}

func (s *GRPCServer) VerifySession(_ context.Context, req *pb.TokenRequest) (*pb.SessionResponse, error) {
	claims, err := s.svc.VerifySession(req.Token, req.IgnoreSession)
	if err != nil {
		return nil, ErrorResponse(err, codes.InvalidArgument)
		// return errorSessionReponse(err), nil
	}

	response := &pb.SessionResponse{
		Claims: &pb.Claims{
			UserId:     claims.UserID,
			Email:      claims.Email,
			RoleKey:    claims.RoleKey,
			CompanyKey: claims.CompanyKey,
			Os:         claims.OS,
		},
		SessionId: claims.SessionID,
		Error:     nil,
	}
	return response, nil
}

func (s *GRPCServer) GetSession(_ context.Context, req *pb.SessionUserRequest) (*pb.SessionResponse, error) {
	session, err := s.svc.GetSession(req.UserId)
	if err != nil {
		return nil, ErrorResponse(err, codes.InvalidArgument)
		// return &pb.SessionResponse{
		// 	Error: errorResponse(err),
		// }, nil
	}
	response := &pb.SessionResponse{
		SessionId: session,
	}
	return response, nil
}

func (s *GRPCServer) CloseSessionByUser(ctx context.Context, req *pb.SessionUserRequest) (*pb.ErrorResponse, error) {
	err := s.svc.DeleteSession(ctx, req.UserId)
	if err != nil {
		log.Printf("Error CloseSessionByUserloseSession: %s, %v", req.UserId, err)
		return errorResponse(err), nil
	}

	log.Printf("Close Session by UserId: %s", req.UserId)

	return nil, nil
}

func (s *GRPCServer) CloseSession(_ context.Context, req *pb.TokenRequest) (*pb.ErrorResponse, error) {
	claims, err := s.svc.CloseSession(req.Token)
	if err != nil {
		log.Printf("Error CloseSession: %s, %v", req.Token, err)
		return nil, ErrorResponse(err, codes.InvalidArgument)
		// return errorResponse(err), nil
	}

	log.Printf("Close Session by Token email:%s | id:%s", claims.Email, claims.UserID)

	return nil, nil
}
