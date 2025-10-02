package tests

// func TestTowTruckUsecase_GetAll(t *testing.T) {
// 	mockRepo := new(mocks.MockTowTruckRepository)
// 	mockUsecase := usecases.NewTowTruckService(mockRepo, nil, nil)
// 	lang := "en"

// 	t.Run("Success", func(t *testing.T) {
// 		mockTowTrucks := []models.TowTruck{
// 			{ID: uuid.New(), LicensePlate: "ABC123"},
// 			{ID: uuid.New(), LicensePlate: "XYZ789"},
// 		}
// 		mockRepo.On("GetAll", lang).Return(&mockTowTrucks, nil)

// 		towTrucks, err := mockUsecase.GetAll(lang)
// 		assert.NoError(t, err)
// 		assert.Equal(t, &mockTowTrucks, towTrucks)
// 		mockRepo.AssertExpectations(t)
// 	})

// 	// t.Run("Error", func(t *testing.T) {
// 	// 	expectedError := errors.New("database error")
// 	// 	mockRepo.On("GetAll", lang).Return(nil, expectedError)

// 	// 	towTrucks, err := mockUsecase.GetAll(lang)
// 	// 	assert.Error(t, err)
// 	// 	assert.Nil(t, towTrucks)
// 	// 	mockRepo.AssertExpectations(t)
// 	// })
// }

// func TestTowTruckUsecase_Create(t *testing.T) {
// 	//company
// 	mockCompanyRepo := new(mockCompany.MockCompaniesRepository)
// 	usecaseCompany := companies.NewCompaniesService(mockCompanyRepo)

// 	mockInsuranceRepo := new(mockInsurance.MockInsuranceRepository)
// 	usecaseInsurance := insuranceUsecase.NewInsurancesUsecaseImpl(mockInsuranceRepo)

// 	// Tow truck repository and usecase
// 	mockRepo := new(mocks.MockTowTruckRepository)
// 	mockUsecase := usecases.NewTowTruckService(mockRepo, usecaseCompany, usecaseInsurance)

// 	userID := uuid.New()

// 	t.Run("Success", func(t *testing.T) {
// 		// Mock request and expected data
// 		mockTowTruckRequest := &models.CreateTowTruck{
// 			Year:         2021,
// 			LicensePlate: "ABC123",
// 			UserID:       &userID,
// 		}
// 		mockCompany := &companies.Company{ID: uuid.New()}

// 		// Set expectations for mocks
// 		mockRepo.On("GetByLicensePlate", mockTowTruckRequest.LicensePlate).Return(nil, nil) // License plate does not exist
// 		mockRepo.On("Create", mock.AnythingOfType("*entities.TowTruck")).Return(nil)        // Creation succeeds
// 		mockCompanyRepo.On("GetByKey", 1).Return(mockCompany, nil)                          // Company exists

// 		// Call the Create function
// 		err := mockUsecase.Create(mockTowTruckRequest)

// 		// Assertions
// 		assert.NoError(t, err)
// 		mockRepo.AssertExpectations(t)
// 		mockCompanyRepo.AssertExpectations(t)
// 	})

// 	// t.Run("Validation Error - License Plate Exists", func(t *testing.T) {
// 	// 	mockTowTruckRequest := &types.TowTruckRequest{
// 	// 		Year:         2021,
// 	// 		LicensePlate: "ABC123",
// 	// 		UserID:       uuid.New(),
// 	// 	}
// 	// 	mockRepo.On("GetByLicensePlate", "ABC123").Return(&entities.TowTruck{}, nil)

// 	// 	err := mockUsecase.Create(mockTowTruckRequest)
// 	// 	assert.Equal(t, &apierrors.ExistLicensePlate, err)
// 	// 	mockRepo.AssertExpectations(t)
// 	// })

// 	// t.Run("Company Not Found", func(t *testing.T) {
// 	// 	mockTowTruckRequest := &types.TowTruckRequest{
// 	// 		Year:         2021,
// 	// 		LicensePlate: "ABC123",
// 	// 		UserID:       uuid.New(),
// 	// 	}
// 	// 	mockRepo.On("Create", mock.AnythingOfType("*entities.TowTruck")).Return(nil)
// 	// 	mockCompanyService.On("GetByKey", 1).Return(nil, errors.New("company not found"))

// 	// 	err := mockUsecase.Create(mockTowTruckRequest)
// 	// 	assert.Equal(t, &apierrors.CompanyNotFound, err)
// 	// 	mockRepo.AssertExpectations(t)
// 	// 	mockCompanyService.AssertExpectations(t)
// 	// })
// }

// func TestTowTruckUsecase_GetByID(t *testing.T) {
// 	mockRepo := new(mocks.MockTowTruckRepository)
// 	mockUsecase := usecases.NewTowTruckService(mockRepo, nil, nil)
// 	towTruckID := uuid.New()

// 	t.Run("Success", func(t *testing.T) {
// 		mockTowTruck := &entities.TowTruck{ID: towTruckID, LicensePlate: "ABC123"}
// 		mockRepo.On("GetByID", towTruckID).Return(mockTowTruck, nil)

// 		towTruck, err := mockUsecase.GetByID(towTruckID)
// 		assert.NoError(t, err)
// 		assert.Equal(t, mockTowTruck, towTruck)
// 		mockRepo.AssertExpectations(t)
// 	})

// 	t.Run("Tow Truck Not Found", func(t *testing.T) {
// 		mockRepo.On("GetByID", towTruckID).Return(nil, errors.New("tow truck not found"))

// 		towTruck, err := mockUsecase.GetByID(towTruckID)
// 		assert.Error(t, err)
// 		assert.Nil(t, towTruck)
// 		mockRepo.AssertExpectations(t)
// 	})
// }

// func TestTowTruckUsecase_Update(t *testing.T) {
// 	mockRepo := new(mocks.MockTowTruckRepository)
// 	mockUsecase := usecases.NewTowTruckService(mockRepo, nil, nil)

// 	t.Run("Success", func(t *testing.T) {
// 		mockTowTruck := &entities.TowTruck{ID: uuid.New(), LicensePlate: "ABC123"}
// 		mockUpdateRequest := &types.TowTruckRequestUpdate{
// 			ID:           mockTowTruck.ID,
// 			LicensePlate: &mockTowTruck.LicensePlate,
// 			Year:         new(uint),
// 		}
// 		mockRepo.On("GetByID", mockTowTruck.ID).Return(mockTowTruck, nil)
// 		mockRepo.On("Update", mock.AnythingOfType("*entities.TowTruck")).Return(nil)

// 		err := mockUsecase.Update(mockUpdateRequest)
// 		assert.NoError(t, err)
// 		mockRepo.AssertExpectations(t)
// 	})

// 	t.Run("Tow Truck Not Found", func(t *testing.T) {
// 		mockTowTruckID := uuid.New()
// 		mockUpdateRequest := &types.TowTruckRequestUpdate{ID: mockTowTruckID}
// 		mockRepo.On("GetByID", mockTowTruckID).Return(nil, errors.New("tow truck not found"))

// 		err := mockUsecase.Update(mockUpdateRequest)
// 		assert.Equal(t, &apierrors.TowtruckNotFound, err)
// 		mockRepo.AssertExpectations(t)
// 	})
// }
