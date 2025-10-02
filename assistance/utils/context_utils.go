package utils

import (
	"context"
	"errors"

	"bitbucket.org/mya/mya-assistance-core/types"
	"github.com/google/uuid"
)

func AddDataContext(ctx context.Context, headersCtx *types.HeaderContext) context.Context {
	return context.WithValue(ctx, types.UserContextKey, headersCtx)
}

func GetDataContext(ctx context.Context) (*types.HeaderContext, error) {
	userCtx, ok := ctx.Value(types.UserContextKey).(*types.HeaderContext)
	if !ok || userCtx == nil {
		return nil, errors.New("user context not found")
	}
	return userCtx, nil
}

func GetUserContext(ctx context.Context) (*types.HeaderContext, bool) {
	userCtx, ok := ctx.Value(types.UserContextKey).(*types.HeaderContext)
	return userCtx, ok
}

func GetLang(ctx context.Context) string {
	if userCtx, ok := GetUserContext(ctx); ok {
		return userCtx.Lang
	}
	return "es"
}

func GetUserID(ctx context.Context) uuid.UUID {
	if userCtx, ok := GetUserContext(ctx); ok {
		return userCtx.UserID
	}
	return uuid.Nil
}

func GetRoleKey(ctx context.Context) uint {
	if userCtx, ok := GetUserContext(ctx); ok {
		return userCtx.RoleKey
	}
	return 1
}

func GetCompanyKey(ctx context.Context) uint {
	if userCtx, ok := GetUserContext(ctx); ok {
		return userCtx.CompanyKey
	}
	return 1
}

func GetOS(ctx context.Context) string {
	if userCtx, ok := GetUserContext(ctx); ok {
		return userCtx.OS
	}
	return ""
}
