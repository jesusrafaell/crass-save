package auth

import (
	"appassistence/auth/data"
	"appassistence/auth/errs"
	"appassistence/auth/internal/notification"
	"appassistence/auth/pkg/assistance/vehicles"
	"appassistence/auth/pkg/authorization"
	"appassistence/auth/pkg/companies"
	fileS3 "appassistence/auth/pkg/files"
	oSystem "appassistence/auth/pkg/os"
	"appassistence/auth/pkg/roles"
	"appassistence/auth/pkg/status"
	"appassistence/auth/pkg/users"
	"appassistence/auth/pkg/utility"
	"appassistence/auth/pkg/verify"
	"fmt"
	"log"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AuthService struct {
	db            *sqlx.DB
	users         *users.UsersService
	os            *oSystem.OSystemService
	roles         *roles.RolesService
	status        *status.StatusService
	authorization *authorization.Authorization
	mail          *notification.MailService
	verifyToken   *verify.VerifyService
	company       *companies.CompaniesService
	s3            *fileS3.S3Service
}

func NewAuthService(
	db *sqlx.DB,
	users *users.UsersService,
	os *oSystem.OSystemService,
	roles *roles.RolesService,
	status *status.StatusService,
	authorization *authorization.Authorization,
	mail *notification.MailService,
	vt *verify.VerifyService,
	c *companies.CompaniesService,
	s3 *fileS3.S3Service,
) *AuthService {
	return &AuthService{
		db:            db,
		users:         users,
		os:            os,
		roles:         roles,
		status:        status,
		authorization: authorization,
		mail:          mail,
		verifyToken:   vt,
		company:       c,
		s3:            s3,
	}
}

func (s *AuthService) LoginMobile(lang string, req *LoginRequest) (*LoginResponse, *errs.CustomError) {
	user, errorEmail := s.loginByEmail(lang, req.Email, req.Password)
	if errorEmail != nil {
		return nil, errorEmail
	}

	companyKey := "1"
	if user.Company != nil && user.Company.Key > 0 {
		companyKey = strconv.FormatUint(user.Company.Key, 10)
	}

	//create session
	token, errAuth := s.authorization.GenerateSession(&authorization.Claims{
		UserID:     user.ID.String(),
		Email:      user.Email,
		RoleKey:    strconv.FormatUint(user.CurrentRole.Key, 10),
		CompanyKey: companyKey,
		OS:         req.OS,
	}, 0)
	if errAuth != nil {
		return nil, errs.NewCustomError(errAuth.Code, errAuth.Name, "error generateSession")
	}

	if user.FcmToken != nil {
		log.Printf("Notification close session userId:%s", user.ID)
		s.users.NotificationLogout(*user.FcmToken)
	}

	strFCM := ""
	user.FcmToken = &strFCM
	sn := data.StatusActiveKey
	osn := req.OS
	user.Online = true

	updateData := &users.UserUpdate{
		Status:   &sn,
		OS:       &osn,
		Online:   &user.Online,
		FcmToken: &strFCM,
	}

	if errC := s.users.Update(user.ID, updateData); errC != nil {
		log.Printf("Error auth(Services).loginMobile (update): %v", errC.Name)
		return nil, errC
	}

	go func() {
		if user.CurrentRole.Key != roles.RoleKeyDriver {
			s.users.RemovePositionDriver(user.ID.String(), companyKey)
		}
	}()

	user.Status.Name = sn

	loginRes := &LoginResponse{
		User:        users.ConvertUserResponse(user),
		Company:     user.Company,
		AccessToken: token,
	}

	if user.CurrentRole.Key == 3 && user.DriverMode != nil {
		loginRes.DriverMode = user.DriverMode
	}

	return loginRes, nil
}

func (s *AuthService) LoginManager(lang string, req *LoginRequest) (*LoginResponse, *errs.CustomError) {
	//loginByEmail
	user, errorEmail := s.loginByEmail(lang, req.Email, req.Password)
	if errorEmail != nil {
		return nil, errorEmail
	}

	//get company and valid
	if user.Company == nil {
		return nil, &errs.CompanyNotFound
	}

	var roleAdmin *users.RoleU
	for _, role := range *user.Roles {
		if role.Key == roles.RoleKeyAdmin {
			roleAdmin = &role
			break
		}
	}
	if roleAdmin == nil {
		return nil, &errs.NotAccess
	}

	companyKey := strconv.FormatUint(uint64(user.Company.Key), 10)

	token, errAuth := s.authorization.GenerateToken(&authorization.Claims{
		UserID:     user.ID.String(),
		Email:      user.Email,
		RoleKey:    utility.StrToRole(roleAdmin.Name),
		CompanyKey: companyKey,
		OS:         req.OS,
	}, 4) //4 hours

	if errAuth != nil {
		return nil, errs.NewCustomError(errAuth.Code, errAuth.Name, "generate token")
	}

	return &LoginResponse{
		User:        users.ConvertUserResponse(user),
		Company:     user.Company,
		AccessToken: token,
	}, nil
}

func (s *AuthService) Logout(userId uuid.UUID, companyId string) *errs.CustomError {
	//close session
	errA := s.authorization.DeleteSession(userId.String())
	if errA != nil {
		return errs.NewCustomError(errA.Code, errA.Name, errA.Message)
	}

	sn := "inactive"
	fcmToken := "" //nil
	online := false

	//update info
	put := &users.UserUpdate{
		Status:   &sn,
		FcmToken: &fcmToken,
		Online:   &online,
	}

	if err := s.users.Update(userId, put); err != nil {
		log.Printf("error logout update %v", err)
	}

	go func() {
		if err := s.users.RemovePositionDriver(userId.String(), companyId); err != nil {
			log.Printf("error logout PositionDriver %v", err)
		}
	}()

	return nil
}

func (s *AuthService) loginByEmail(lang, email, password string) (*users.User, *errs.CustomError) {
	email = strings.ToLower(email)

	user, errC := s.users.GetDataByEmail(lang, email)
	if errC != nil {
		return nil, errC
	}

	//valid password
	if utility.VerifyPassword(*user.Password, password) {
		return nil, &errs.InvalidCredentials
	}

	if user.Status.Key == data.StatusPendingKey {
		return nil, &errs.UnverifiedAccount
	} else if user.Status.Key == data.StatusSuspendedKey {
		return nil, &errs.UserSuspended
	}

	return user, nil
}

func (s *AuthService) VerifyAccount(token string) (string, *errs.CustomError) {
	//find token in db
	dataToken, errC := s.verifyToken.GetTokenByID(token)
	if errC != nil {
		log.Printf("Error VerifyAccount.GetTokenByToken: %s-%s", errC.Code, errC.Name)
		return "", errC
	}

	user, err := s.users.GetByID(dataToken.UserId, nil)
	if err != nil {
		log.Printf("Error VerifyAccount.GetTokenByToken(GetUserById): %v", err)
		return "", &errs.UserNotFound
	}

	//updated status user
	// log.Println("user verify:", dataToken.UserId)
	sn := "inactive"
	if err := s.users.Update(dataToken.UserId, &users.UserUpdate{Status: &sn}); err != nil {
		log.Printf("Error VerifyToken,Update: %v", err)
		return "", err
	}

	if err := s.verifyToken.DeleteTokenById(dataToken.ID); err != nil {
		log.Printf("Error VerifyToken,DeleteTokenByIdpdate: %v", err)
		return "", &errs.ErrorServer
	}

	return user.Email, nil
}

func (s *AuthService) ChangeCurrentRole(lang string, userId uuid.UUID, req *users.ChangeRoleCurrent) (*LoginResponse, *errs.CustomError) {
	//data user
	user, errC := s.users.GetByID(userId, &lang)
	if errC != nil {
		return nil, &errs.UserNotFound
	}

	//validate role key to roles
	var currentRole *users.RoleU
	for _, role := range *user.Roles {
		if role.Key == req.Key {
			currentRole = &role
		}
	}
	if currentRole == nil {
		fmt.Printf("ChangeCurrentRole.currentRole not have roleKey: %d\n", req.Key)
		return nil, &errs.NotAccess
	}

	user.CurrentRole = currentRole

	companyKey := "1"
	if user.Company != nil {
		companyKey = strconv.FormatUint(uint64(user.Company.Key), 10)
	}

	//create session
	token, errA := s.authorization.RefreshSession(&authorization.Claims{
		UserID:     user.ID.String(),
		Email:      user.Email,
		RoleKey:    utility.StrToRole(user.CurrentRole.Name),
		CompanyKey: companyKey,
		OS:         req.OS,
	}, 0)
	if errA != nil {
		return nil, errs.NewCustomError(errA.Code, errA.Name, "refreshSession")
	}

	// change current role
	s.users.Update(user.ID, &users.UserUpdate{
		CurrentRole: &req.Key,
	})

	go func() {
		//if go tu user remove possition
		if req.Key == roles.RoleKeyUser {
			s.users.RemovePositionDriver(userId.String(), companyKey)
		}
	}()

	loginRes := &LoginResponse{
		User:        users.ConvertUserResponse(user),
		AccessToken: token,
	}

	if currentRole.Key == 3 {
		loginRes.DriverMode = user.DriverMode
	}

	return loginRes, nil
}

func (s *AuthService) ForgotPassword(email string) *errs.CustomError {
	//find token in db
	user, errC := s.users.GetDataByEmail("en", strings.ToLower(email))
	if errC != nil {
		return errC
	}

	tokenUUID := uuid.New()
	verifyTokenQuery := `INSERT INTO u_verify_tokens (id, user_id, type) VALUES ($1, $2, $3)`
	if _, err := s.db.Exec(verifyTokenQuery, tokenUUID, user.ID, data.ForgotPassword); err != nil {
		log.Println("Error (verifyTokenQuery):", err)
		return &errs.ErrorServer
	}

	link := fmt.Sprintf(`%[1]s/forgot-password/%[2]s`, s.mail.SupportURL, tokenUUID.String())
	bodyEmail := utility.GetTemplateByParams(&utility.TemplateParams{
		Title: "Saludos,",
		Desc:  "Para cambiar tu contraseña, haz click en el siguiente botón",
		Button: utility.Button{
			Ref:   link,
			Label: "Recuperar contrasena",
		},
	})

	err := s.mail.SendMail(user.Email, "Recuperar Cuenta - Mya", bodyEmail)
	if err != nil {
		return &errs.ErrorServer
	}
	return nil
}

func (s *AuthService) ChangePassword(tokenUUID string, password string) *errs.CustomError {
	verify, errC := s.verifyToken.GetTokenByID(tokenUUID)
	if errC != nil {
		return errC
	}

	hashPassword, err := utility.HashPassword(password)
	if err != nil {
		return &errs.ErrorServer
	}

	errC = s.users.Update(verify.UserId, &users.UserUpdate{
		Password: &hashPassword,
	})

	if errC != nil {
		return errC
	}

	go s.verifyToken.DeleteTokenById(verify.ID)

	return nil
}

func (s *AuthService) VerifyInfo(lang, tokenUUID string) (*verify.VerifyInfo, *errs.CustomError) {
	//get userId, and email join,
	dataToken, errC := s.verifyToken.GetTokenByID(tokenUUID)
	if errC != nil {
		log.Printf("Error VerifyAccount.GetTokenByToken: %v", errC)
		return nil, &errs.ExpToken
	}

	if dataToken.Type != data.VerifyAccountInfo {
		//complete invo user
		return nil, &errs.NotAccess
	}

	//buscar data
	user, errC := s.users.GetByID(dataToken.UserId, &lang)
	if errC != nil {
		return nil, errC
	}

	identityDocument, errC := s.users.GetIdentByUserId(user.ID)
	if errC != nil {
		return nil, errC
	}

	user.IdentityDocument = identityDocument

	vehicleService := vehicles.NewVehicleService(s.db)
	uVehicles, err := vehicleService.GetVehiclesByUserId(user.ID, lang)
	if err != nil {
		return nil, &errs.ErrorServer
	}

	res := &verify.VerifyInfo{
		User:     *user,
		Vehicles: uVehicles,
	}

	return res, nil
}

func (s *AuthService) GetUserResponse(lang string, userId uuid.UUID) (*LoginResponse, *errs.CustomError) {
	user, errC := s.users.GetByID(userId, &lang)
	if errC != nil {
		return nil, errC
	}

	loginResponse := &LoginResponse{
		User: users.ConvertUserResponse(user),
	}

	if user.CurrentRole.Key == 3 && user.DriverMode != nil {
		loginResponse.DriverMode = user.DriverMode
	}

	return loginResponse, nil
}

func (s *AuthService) VerifiedAccountInfo(tokenUUID string, req *VerifyInfoRequest) (*string, *errs.CustomError) {
	dataToken, errC := s.verifyToken.GetTokenByID(tokenUUID)
	if errC != nil {
		log.Printf("Error VerifyAccount.GetTokenByToken: %v", errC)
		return nil, &errs.ExpToken
	}

	if dataToken.Type != data.VerifyAccountInfo {
		//complete invo user
		return nil, &errs.NotAccess
	}

	//user
	errCustom := s.users.Update(dataToken.UserId, &req.User)
	if errCustom != nil {
		log.Printf("Error VerifiedAccountInfo.Update: %v ", errCustom.Name)
		return nil, errC
	}

	log.Println("User updated:", dataToken.UserId)

	//vehicles
	vehiclesService := vehicles.NewVehicleService(s.db)

	for _, vehicle := range req.Vehicles {
		err := vehiclesService.UpdateVehicle(vehicle.ID, vehicle)
		if err != nil {
			errText := fmt.Sprintf("Error VerifiedAccountInfo.UpdateVehicle id:[%s]: %v", vehicle.ID, err)
			log.Println(errText)
			return nil, errs.NewCustomErrMsg(&errs.ErrorServer, errText)
		}
	}

	log.Println("Delete token 3312")
	// [3312]
	// err := s.verifyToken.DeleteTokenById(dataToken.ID)
	// if err != nil {
	// 	return nil, &errs.ErrorServer
	// }

	return req.User.Email, nil
}
