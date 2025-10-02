package server

import (
	"authorization/app"
	"context"
	"log"

	pb "authorization/proto"

	"google.golang.org/grpc/codes"
)

func (s *GRPCServer) GenerateToken(ctx context.Context, req *pb.CreateAuth) (*pb.TokenResponse, error) {

	claims := app.Claims{
		UserID:     req.Claims.UserId,
		Email:      req.Claims.Email,
		RoleKey:    req.Claims.RoleKey,
		CompanyKey: req.Claims.CompanyKey,
		OS:         req.Claims.Os,
		SessionID:  "",
	}

	token, err := s.svc.GenerateToken(&claims, req.ExpHours)
	if err != nil {
		log.Println("Error GenerateToken userId:", claims.UserID, err)
		return errorTokenResponse(err), nil
	}

	response := &pb.TokenResponse{
		Token: token,
	}
	return response, nil
}

func (s *GRPCServer) VerifyToken(ctx context.Context, req *pb.TokenRequest) (*pb.VerifyTokenReponse, error) {

	claims, err := s.svc.VerifyToken(req.Token)
	if err != nil {
		log.Printf("Error VerifyToken: %s, %v", req.Token, err)
		// return errorTokenResponse(err), nil
		return nil, ErrorResponse(err, codes.InvalidArgument)
	}

	response := &pb.VerifyTokenReponse{
		Claims: &pb.Claims{
			UserId:     claims.UserID,
			Email:      claims.Email,
			RoleKey:    claims.RoleKey,
			CompanyKey: claims.CompanyKey,
			Os:         claims.OS,
		},
	}
	return response, nil
}
