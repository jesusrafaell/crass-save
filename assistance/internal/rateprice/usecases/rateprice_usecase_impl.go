package usecases

import (
	"context"
	"sort"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/repositories"
	"bitbucket.org/mya/mya-assistance-core/utils"

	"github.com/google/uuid"
)

type ratePriceUsecaseImpl struct {
	ratePriceRepository repositories.RatePriceRepository
}

func NewRatePriceUsecaseImpl(ratePriceRepository repositories.RatePriceRepository) RatePriceUsecase {
	return &ratePriceUsecaseImpl{
		ratePriceRepository: ratePriceRepository,
	}
}

func (u *ratePriceUsecaseImpl) GetAll(ctx context.Context) (*[]entities.RatePriceXType, error) {
	lang := utils.GetLang(ctx)
	return u.ratePriceRepository.GetAll(lang)
}

func (u *ratePriceUsecaseImpl) GetTypeRatePrices(ctx context.Context) (*models.TypeRatePrices, error) {
	lang := utils.GetLang(ctx)
	ratePrices, err := u.ratePriceRepository.GetAll(lang)
	if err != nil {
		return nil, err
	}

	typeMap := make(map[uuid.UUID]*models.VTypesAndRatePrices)
	kmSet := make(map[float64]struct{}) // Set para los km únicos

	// group `TypeID` and unique kms
	for _, price := range *ratePrices {
		kmSet[price.Km] = struct{}{}

		if _, exists := typeMap[price.TypeID]; !exists {
			typeMap[price.TypeID] = &models.VTypesAndRatePrices{
				Type: *price.Type,
				RatePriceXType: []models.RatesPrices{
					{
						ID:      price.ID,
						Km:      price.Km,
						PriceKm: price.PriceKm,
						Key:     price.Key,
						CoinID:  price.CoinID,
						Coin:    price.Coin,
					},
				},
			}
		} else {
			typeMap[price.TypeID].RatePriceXType = append(typeMap[price.TypeID].RatePriceXType, models.RatesPrices{
				ID:      price.ID,
				Km:      price.Km,
				PriceKm: price.PriceKm,
				Key:     price.Key,
				CoinID:  price.CoinID,
				Coin:    price.Coin,
			})
		}
	}

	kmList := make([]float64, 0, len(kmSet))
	for km := range kmSet {
		kmList = append(kmList, km)
	}
	sort.Float64s(kmList)

	// Convert typeMap to list -> ratePricesList y order by Km
	ratePricesList := make([]models.VTypesAndRatePrices, 0, len(typeMap))
	for _, v := range typeMap {
		// Order by`Km`
		sort.Slice(v.RatePriceXType, func(i, j int) bool {
			return v.RatePriceXType[i].Km < v.RatePriceXType[j].Km
		})

		ratePricesList = append(ratePricesList, *v)
	}

	// Order atePricesList` -> `Key` in type
	sort.Slice(ratePricesList, func(i, j int) bool {
		return ratePricesList[i].Type.Key < ratePricesList[j].Type.Key
	})

	return &models.TypeRatePrices{
		KeysKm:     kmList,
		RatePrices: ratePricesList,
	}, nil
}

func (u *ratePriceUsecaseImpl) Update(ctx context.Context, id uuid.UUID, ratePriceXType *models.UpdateRatePriceXType) *apierrors.CustomError {
	if err := u.ratePriceRepository.Update(&entities.RatePriceXType{
		ID:      id,
		Km:      ratePriceXType.Km,
		PriceKm: ratePriceXType.PriceKm,
		Key:     ratePriceXType.Key,
		TypeID:  ratePriceXType.TypeID,
		Base:    ratePriceXType.Base,
		CoinID:  ratePriceXType.CoinID,
	}); err != nil {
		// log.Printf("Error ratePriceUsecaseImpl.update %v", err)
		return &apierrors.ErrorServer
	}
	return nil
}

func (u *ratePriceUsecaseImpl) GetPriceXKm(ctx context.Context, vehicleType uuid.UUID, distanceMeters float64) (*models.Price, *apierrors.CustomError) {
	lang := utils.GetLang(ctx)
	distanceKm := distanceMeters / 1000.0
	price, err := u.ratePriceRepository.GetPriceXKm(lang, vehicleType, distanceKm)
	if err != nil {
		return nil, &apierrors.PriceNotFound
	}
	return price, nil
}
