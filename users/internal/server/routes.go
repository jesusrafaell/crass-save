package server

import (
	"appassistence/auth/internal/auth"
	"appassistence/auth/internal/notification"
	FCM "appassistence/auth/internal/notification/fcm"
	midd "appassistence/auth/internal/server/middleware"
	"appassistence/auth/pkg/authorization"
	"appassistence/auth/pkg/companies"
	fileS3 "appassistence/auth/pkg/files"
	oSystem "appassistence/auth/pkg/os"
	"appassistence/auth/pkg/roles"
	"appassistence/auth/pkg/status"
	"appassistence/auth/pkg/users"
	"appassistence/auth/pkg/verify"
	"appassistence/auth/pkg/versions"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type Router struct {
	e    *echo.Echo
	db   *sqlx.DB
	auth *authorization.Authorization
}

func NewRouter(e *echo.Echo, db *sqlx.DB, auth *authorization.Authorization) *Router {
	return &Router{
		e:    e,
		db:   db,
		auth: auth,
	}
}

func (app *Router) Start() {
	e := app.e
	db := app.db
	// Middlewares
	e.Use(midd.UserIdRequest)
	e.Use(midd.LangRequest)
	// e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
	// 	Format:           "${time_custom} | ${method} | URL=${host}${uri} | STATUS=${status} | LATENCY=${latency_human}\n",
	// 	CustomTimeFormat: "2006-01-02 15:04:05",
	// }))

	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format:           "${time_custom} | ${method} | URL=${host}${uri} | STATUS=${status} | LATENCY=${latency_human} | USERID=${header:x-user-id} \n",
		CustomTimeFormat: "2006-01-02 15:04:05",
	}))

	//
	firabaseApp := FCM.NewFirabase()
	fcm := FCM.NewFCM(firabaseApp)

	// 	//email service
	mail := notification.NewMailService()
	s3Services := fileS3.NewS3Service()
	fileS3.Routes(e, fileS3.NewS3Handler(s3Services))
	versionS := versions.NewVersionService(db)
	versions.Routes(e, versions.NewVersionHandler(versionS))
	rolesS := roles.NewRolesService(db)
	oSystemsS := oSystem.NewOSystemService(db)
	verifyS := verify.NewVerifyService(db)
	verify.Routes(e, verify.NewVerifyHandler(verifyS))
	statusS := status.NewStatusService(db)
	status.Routes(e, status.NewStatusHandler(statusS))
	companiesS := companies.NewCompaniesService(db)
	usersS := users.NewUsersService(
		db,
		statusS,
		rolesS,
		oSystemsS,
		mail,
		fcm,
		firabaseApp,
	)
	users.Routes(e, users.NewUsersHandler(usersS))
	authService := auth.NewAuthService(
		db,
		usersS,
		oSystemsS,
		rolesS,
		statusS,
		app.auth,
		mail,
		verifyS,
		companiesS,
		s3Services,
	)
	auth.Routes(e, auth.NewAuthHandler(authService))
}
