package middleware

import (
	"strconv"

	"bitbucket.org/mya/mya-assistance-core/internal/responses"
	"bitbucket.org/mya/mya-assistance-core/types"
	"bitbucket.org/mya/mya-assistance-core/utils"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
)

func InjectUserContext(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		lang := c.Request().Header.Get("lang")
		if lang == "" {
			lang = "es"
		}
		userIDStr := c.Request().Header.Get("x-user-id")
		roleKeyStr := c.Request().Header.Get("x-role-key")
		companyKeyStr := c.Request().Header.Get("x-company-key")
		os := c.Request().Header.Get("x-os")

		c.Set("lang", lang)
		c.Set("userId", userIDStr)
		c.Set("roleKey", roleKeyStr)
		c.Set("companyKey", companyKeyStr)
		c.Set("os", os)

		userCtx, err := createUserContext(c)
		if err != nil {
			return responses.BadRequest(c, err.Error())
		}

		ctx := utils.AddDataContext(c.Request().Context(), userCtx)
		c.SetRequest(c.Request().WithContext(ctx))

		return next(c)
	}
}

func createUserContext(c echo.Context) (*types.HeaderContext, error) {
	if isPublicRoute(c.Request().URL.Path) {
		return &types.HeaderContext{
			Lang:       "es",
			UserID:     uuid.Nil,
			RoleKey:    1,
			CompanyKey: 1,
			OS:         "",
		}, nil
	}

	lang := c.Request().Header.Get("lang")
	if lang == "" {
		lang = "es"
	}
	userIDStr := c.Request().Header.Get("x-user-id")
	roleKeyStr := c.Request().Header.Get("x-role-key")
	companyKeyStr := c.Request().Header.Get("x-company-key")
	os := c.Request().Header.Get("x-os")

	c.Set("userId", userIDStr)
	c.Set("roleKey", roleKeyStr)
	c.Set("companyKey", companyKeyStr)
	c.Set("os", os)
	c.Set("lang", lang)

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, err
	}

	var roleKey, companyKey uint
	if roleKeyParsed, err := strconv.ParseUint(roleKeyStr, 10, 32); err == nil {
		roleKey = uint(roleKeyParsed)
	}
	if companyKeyParsed, err := strconv.ParseUint(companyKeyStr, 10, 32); err == nil {
		companyKey = uint(companyKeyParsed)
	}

	return &types.HeaderContext{
		Lang:       lang,
		UserID:     userID,
		RoleKey:    roleKey,
		CompanyKey: companyKey,
		OS:         os,
	}, nil
}
