package tests

import (
	"context"
	"testing"

	"bitbucket.org/mya/mya-assistance-core/apierrors"
	coinModel "bitbucket.org/mya/mya-assistance-core/internal/coin/models"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/tests/mocks"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/usecases"
	"bitbucket.org/mya/mya-assistance-core/types"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetAll_Success(t *testing.T) {
	mockRepo := new(mocks.MockRatePriceRepository)
	lang := "en"
	expectedRates := []entities.RatePriceXType{
		{ID: uuid.New(), Km: 5, PriceKm: 10, Key: "key1"},
		{ID: uuid.New(), Km: 10, PriceKm: 15, Key: "key2"},
	}

	mockRepo.On("GetAll", lang).Return(&expectedRates, nil)

	usecase := usecases.NewRatePriceUsecaseImpl(mockRepo)
	result, err := usecase.GetAll(context.Background())

	assert.NoError(t, err)
	assert.Equal(t, &expectedRates, result)
	mockRepo.AssertExpectations(t)
}

func TestGetTypeRatePrices_Success(t *testing.T) {
	mockRepo := new(mocks.MockRatePriceRepository)
	lang := "en"

	type1 := &types.BaseKey{ID: uuid.New(), Name: "Type1"}
	type2 := &types.BaseKey{ID: uuid.New(), Name: "Type2"}

	expectedRates := []entities.RatePriceXType{
		{ID: uuid.New(), Km: 5, PriceKm: 10, Key: "key1", TypeID: uuid.New(), Type: type1},
		{ID: uuid.New(), Km: 10, PriceKm: 15, Key: "key2", TypeID: uuid.New(), Type: type2},
	}

	ratePrice1 := expectedRates[0]
	ratePrice2 := expectedRates[1]

	expectedResult := &models.TypeRatePrices{
		KeysKm: []float64{5, 10},
		RatePrices: []models.VTypesAndRatePrices{
			{
				Type: *ratePrice1.Type, //type1
				RatePriceXType: []models.RatesPrices{
					{
						ID:      ratePrice1.ID,
						Km:      ratePrice1.Km,
						PriceKm: ratePrice1.PriceKm,
						Key:     ratePrice1.Key,
					},
				},
			},
			{
				Type: *ratePrice2.Type, //type2
				RatePriceXType: []models.RatesPrices{
					{
						ID:      ratePrice2.ID,
						Km:      ratePrice2.Km,
						PriceKm: ratePrice2.PriceKm,
						Key:     ratePrice2.Key,
					},
				},
			},
		},
	}

	mockRepo.On("GetAll", lang).Return(&expectedRates, nil)

	usecase := usecases.NewRatePriceUsecaseImpl(mockRepo)
	result, err := usecase.GetTypeRatePrices(context.Background())

	assert.NoError(t, err)
	assert.Equal(t, expectedResult, result)
	mockRepo.AssertExpectations(t)
}

func TestGetPriceXKm_Success(t *testing.T) {
	mockRepo := new(mocks.MockRatePriceRepository)
	lang := "en"
	vType := uuid.New()
	distanceMeters := 10000.0 // 10 km
	expectedPrice := &models.Price{
		Km:          10,
		PriceKm:     100,
		Coin:        coinModel.Coin{ID: uuid.New(), Name: "USD", Symbol: "$"},
		VehicleType: &types.BaseKey{ID: vType, Name: "Car"},
	}

	mockRepo.On("GetPriceXKm", lang, vType, distanceMeters/1000).Return(expectedPrice, nil)

	usecase := usecases.NewRatePriceUsecaseImpl(mockRepo)
	result, err := usecase.GetPriceXKm(context.Background(), vType, distanceMeters)

	assert.NoError(t, err)
	assert.Equal(t, expectedPrice, result)
	assert.Equal(t, distanceMeters/1000, result.Km)
	mockRepo.AssertExpectations(t)
}

func TestUpdate_Success(t *testing.T) {
	mockRepo := new(mocks.MockRatePriceRepository)
	id := uuid.New()
	updateData := &models.UpdateRatePriceXType{
		Km:      10,
		PriceKm: 15,
		Key:     "key-update",
		TypeID:  uuid.New(),
		Base:    100,
		CoinID:  uuid.New(),
	}

	mockRepo.On("Update", mock.MatchedBy(func(data *entities.RatePriceXType) bool {
		return data.ID == id && data.Km == updateData.Km && data.PriceKm == updateData.PriceKm && data.Key == updateData.Key
	})).Return(nil)

	usecase := usecases.NewRatePriceUsecaseImpl(mockRepo)
	err := usecase.Update(context.Background(), id, updateData)

	assert.Nil(t, err.ErrorGo())
	mockRepo.AssertExpectations(t)
}

func TestUpdate_Error(t *testing.T) {
	mockRepo := new(mocks.MockRatePriceRepository)
	id := uuid.New()
	updateData := &models.UpdateRatePriceXType{
		Km:      10,
		PriceKm: 15,
		Key:     "key-update",
		TypeID:  uuid.New(),
		Base:    100,
		CoinID:  uuid.New(),
	}

	mockRepo.On("Update", mock.Anything).Return(apierrors.ErrorServer)

	usecase := usecases.NewRatePriceUsecaseImpl(mockRepo)
	err := usecase.Update(context.Background(), id, updateData)

	assert.Equal(t, &apierrors.ErrorServer, err)
	mockRepo.AssertExpectations(t)
}
