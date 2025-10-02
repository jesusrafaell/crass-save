package usecases

import (
	"context"
	"database/sql"
	"errors"
	"strings"

	assistanceModels "bitbucket.org/mya/mya-assistance-core/internal/assistance/models"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/constants"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/whatsapp/models"
	"bitbucket.org/mya/mya-assistance-core/pkg/status"
	"bitbucket.org/mya/mya-assistance-core/pkg/users"
	"bitbucket.org/mya/mya-assistance-core/utils"
	"github.com/google/uuid"

	"fmt"
	"log"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	vehicleEntity "bitbucket.org/mya/mya-assistance-core/internal/vehicle/entities"
)

func (u *wsUsecaseImpl) CreateAssistance(ctx context.Context, req *models.CreateWSAssistance) (*assistanceModels.AssistanceResponse, *apierrors.CustomError) {
	// lang := utils.GetLang(ctx)
	req.Email = strings.TrimSpace(strings.ToLower(strings.ReplaceAll(req.Email, " ", "")))
	req.Mobile = strings.TrimSpace(strings.ToLower(strings.ReplaceAll(req.Mobile, " ", "")))
	req.DocIdent = strings.TrimSpace(strings.ToUpper(strings.ReplaceAll(req.DocIdent, " ", "")))

	req.Mobile = fmt.Sprintf("+%s", req.Mobile)
	// valid not active
	exist, err := u.repository.GetAssistanceRequestsByUser(req.DocIdent, req.Mobile)
	if err != nil {
		return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorServer, err.Error())
		// return nil, &apierrors.AssistRequestAlready
	}
	if exist != nil {
		message := "reqID:" + exist.AssistanceID
		if exist.IdentityDocument == req.DocIdent {
			message += " - docIdent"
		}
		if exist.Mobile == req.Mobile {
			message += " - mobile"
		}
		return nil, apierrors.NewCustomErrMsg(&apierrors.AssistRequestAlready, message)
	}

	//exist
	wsUser, errapi := u.createUserWS(ctx, &models.WsUserBotize{
		DocIdent:      req.DocIdent,
		FullName:      req.FullName,
		DoctIdentPath: req.DoctIdentPath,
		Mobile:        req.Mobile,
		Email:         req.Email,
		CountryKey:    req.CountryKey,
	})
	if errapi != nil {
		return nil, errapi
	}

	// vehicle
	wsVehicle, errapi := u.createVehicleWS(ctx, &models.WSVehicleBotize{
		WsUserID:     wsUser.ID,
		LicensePlate: req.LicensePlate,
		Year:         req.Year,
		ModelID:      req.ModelID,
		TypeKey:      req.TypeKey,
		WeightKey:    req.WeightKey,
		CountryKey:   req.CountryKey,
	})
	if errapi != nil {
		return nil, errapi
	}

	log.Printf("Create Request (WS): \nwsUserId:   %s\nvehicleId: %s", wsUser.ID, wsVehicle.ID)

	//assistance
	request, errC := u.assistanceUsecase.Create(ctx, &assistanceModels.CreateAssistance{
		UserId: uuid.Nil,
		User: assistanceModels.UserAssistance{
			VehicleId: wsVehicle.ID,
			Images:    []string{constants.NoImageAvailable},
			// Images:    []string{req.AssistencePhoto},
		},
		From: assistanceModels.OriginAssitence{
			Latitude:  req.OriginLat,
			Longitude: req.OriginLng,
			Address:   "",
		},
		To: assistanceModels.DestinationAssistance{
			Latitude:  req.DestinationLat,
			Longitude: req.DestinationLng,
		},
		Description: req.Description,
		WsUserID:    &wsUser.ID,
	})
	if errC != nil {
		return nil, errC
	}

	bodyEmail := utils.GetTemplateUserWS(&utils.TemplateWSParams{
		Title:  "Saludos,  " + req.FullName,
		Desc:   "Usted ha solicitado un servicio en Mya.",
		Footer: "Si no solicitó este servicio, por favor contacte a administracion@myappssistance.com.",
	})

	users.SendMail(req.Email, users.MessageMail{
		Title: "Solicitud de asistencia  - Mya",
		Body:  bodyEmail,
	})

	return request, nil
}

func (u *wsUsecaseImpl) GetAssistanceByMobile(ctx context.Context, parms *models.GetByMobile) (*assistanceModels.AssistanceResponse, *apierrors.CustomError) {
	if len(parms.Mobile) < 3 && parms.ReqID == nil {
		return nil, &apierrors.ErrorServer
	}
	parms.Mobile = fmt.Sprintf("+%s", utils.DecodePhoneNumber(parms.Mobile))
	var assistance *assistanceModels.AssistanceResponse
	var errapi *apierrors.CustomError
	if parms.ReqID != nil {
		assistance, errapi = u.assistanceUsecase.GetByIDWithDetails(ctx, *parms.ReqID)
	} else {
		assistance, errapi = u.assistanceUsecase.GetByWS(ctx, parms.Mobile)
	}
	if errapi != nil {
		return nil, errapi
	}

	return assistance, nil
}

func (u *wsUsecaseImpl) createUserWS(_ context.Context, newWsUser *models.WsUserBotize) (*entities.WsUser, *apierrors.CustomError) {
	//exist
	wsUser, err := u.repository.GetWsUserByIdentity(newWsUser.DocIdent)
	if err != nil {
		log.Printf("Error u.createUserWS.GetWsUserByIdentity: %v", err)
		return nil, &apierrors.ErrorServer
	}

	fmt.Println(newWsUser)
	fmt.Println(wsUser)

	if wsUser != nil {
		if wsUser.Mobile == newWsUser.Mobile && newWsUser.Email == wsUser.Email {
			if !wsUser.Active {
				err := u.repository.UpdateWsUserActive(wsUser.ID, true)
				if err != nil {
					return nil, apierrors.NewCustomErrMsg(&apierrors.ErrorCreateUserWs, err.Error())
				}
			}
			return wsUser, nil
		} else {
			err := u.repository.UpdateWsUserActive(wsUser.ID, false)
			if err != nil {
				return nil, &apierrors.ErrorCreateUserWs
			}
		}
	}

	if err := u.repository.UpdateWsMobileActive(newWsUser.Mobile, false); err != nil {
		return nil, &apierrors.ErrorServer
	}

	firstName, lastName := utils.SplitFullName(newWsUser.FullName)

	wsUser = &entities.WsUser{
		IdentityDocument:     newWsUser.DocIdent,
		IdentityDocumentPath: &newWsUser.DoctIdentPath,
		Email:                newWsUser.Email,
		Mobile:               newWsUser.Mobile,
		FirstName:            firstName,
		LastName:             lastName,
		CountryKey:           newWsUser.CountryKey,
		Active:               true,
	}

	err = u.repository.CreateWsUser(wsUser)
	if err != nil {
		log.Printf("Error u.createUserWS.CreateWsUser: %v", err)
		return nil, &apierrors.ErrorCreateUserWs
	}

	return wsUser, nil
}

func (u *wsUsecaseImpl) createVehicleWS(_ context.Context, vehicleWs *models.WSVehicleBotize) (*vehicleEntity.Vehicle, *apierrors.CustomError) {
	vehicle, err := u.vehicleRepo.GetByLicensePlate(vehicleWs.LicensePlate)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("Error u.createRequest(getlicense): %v", err)
		return nil, &apierrors.ErrorServer
	}

	if vehicle == nil {
		base, err := u.repository.GetBaseWsIds(vehicleWs.TypeKey, vehicleWs.WeightKey, vehicleWs.CountryKey, vehicleWs.ModelID)
		if err != nil {
			log.Printf("Error u.createRequest get base ids %v", err)
			return nil, apierrors.NewCustomErrMsg(&apierrors.InvalidRequest, "error get base ids")
		}

		fmt.Println(base)

		vehicle = &vehicleEntity.Vehicle{
			UserID:           uuid.Nil,
			Year:             vehicleWs.Year,
			LicensePlate:     vehicleWs.LicensePlate,
			PolicyNumber:     nil,
			ImagePath:        constants.VehicleImgDefault,
			MakeID:           base.MakeID,
			ModelID:          vehicleWs.ModelID,
			TypeID:           base.VehicleTypeID,
			WeightID:         base.WeightID,
			CountryID:        base.CountryID,
			ColorID:          base.ColorID,
			DriveTrainTypeID: base.DriveTrainTypeID,
			EngineTypeID:     base.EngineTypeID,
			InsuranceID:      base.InsuranceID,
			Active:           false,
			WsUserID:         &vehicleWs.WsUserID,
		}
		errapi := u.vehicleRepo.Create(vehicle)
		if errapi != nil {
			log.Printf("Error u.createRequest(CreateVehicle): %v", errapi)
			return nil, errapi
		}
	} else {
		if vehicle.WsUserID != nil && vehicleWs.WsUserID != *vehicle.WsUserID {
			err := u.vehicleRepo.UpdateUserWS(vehicle.ID, vehicleWs.WsUserID)
			if err != nil {
				log.Printf("Error u.createRequest(CreateVehicle): %v", err)
				return nil, &apierrors.ErrorServer
			}
		}
	}

	return vehicle, nil

}

func (u *wsUsecaseImpl) ConfirmatedRequest(ctx context.Context, req *models.ConfirmedRequest) *apierrors.CustomError {
	req.Mobile = fmt.Sprintf("+%s", utils.DecodePhoneNumber(req.Mobile))
	// if req.ReqID == nil {
	// 	assistance, errapi := u.assistanceUsecase.GetByWS(ctx, req.Mobile)
	// 	req.ReqID = &assistance.ID
	// 	if errapi != nil {
	// 		return errapi
	// 	}
	// }
	log.Println(req.ReqID)
	if errapi := u.assistanceUsecase.ConfirmedUser(ctx, &assistanceModels.UpdateStatus{
		ID:        req.ReqID,
		StatusKey: status.AcceptedKey,
	}); errapi != nil {
		return errapi
	}

	return nil
}
