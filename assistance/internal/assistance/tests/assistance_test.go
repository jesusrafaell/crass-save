package assistance_test

import (
	"github.com/google/uuid"
)

// test ata
var (
	driverID = uuid.MustParse("d91a3798-80fb-4267-8b2d-4510bb0bf8c2")
	coinID   = uuid.MustParse("20b4634f-4d71-4207-b1be-b330f0f9ce32")
)

// func TestRequestDriverRepository(t *testing.T) {
// 	// Connect to test database
// 	envPath := filepath.Join("..", "..", "..", ".env")
// 	err := godotenv.Load(envPath)
// 	if err != nil {
// 		log.Fatalf("Error loading .env file: %v", err)
// 	}

// 	db, err := db.NewPostgres() // Connect to your test database
// 	if err != nil {
// 		log.Fatalf("Error connecting to db: %v\n", err)
// 	}

// 	// Create repository
// 	requestDriverRepository := repositories.NewRequestDriverRepository(db)

// 	// Test data
// 	requestID := uuid.New()
// 	now := time.Now().Unix()

// 	testData := &models.RequestDriver{
// 		DriverID:      driverID,
// 		RequestID:     requestID,
// 		CreatedAt:     now,
// 		ExpiredAt:     now + 3600,
// 		DriverToUser:  10.5,
// 		TotalDistance: 15.0,
// 		Price:         20.0,
// 		CoinID:        coinID,
// 	}

// 	// Test the Create method
// 	t.Run("Create Request Driver", func(t *testing.T) {
// 		err := requestDriverRepository.Create(testData)
// 		assert.NoError(t, err, "Error creating request driver")
// 	})

// 	// Test the GetByDriverID method
// 	t.Run("Get Request Driver by Driver ID", func(t *testing.T) {
// 		results, err := requestDriverRepository.GetByDriverID(driverID)
// 		assert.NoError(t, err, "Error getting request driver by driver ID")
// 		assert.NotNil(t, results, "Result should not be empty")
// 		assert.Equal(t, 1, len(*results), "There should be one record")
// 		assert.Equal(t, requestID, (*results)[0].RequestID, "Request ID should match")
// 	})

// 	// Test the GetByDriverIDAndReqID method
// 	t.Run("Get Request Driver by Driver ID and Request ID", func(t *testing.T) {
// 		result, err := requestDriverRepository.GetByDriverIDAndReqID(driverID, requestID)
// 		assert.NoError(t, err, "Error getting request driver by driver ID and request ID")
// 		assert.NotNil(t, result, "Result should not be empty")
// 		assert.Equal(t, driverID, result.DriverID, "Driver ID should match")
// 		assert.Equal(t, requestID, result.RequestID, "Request ID should match")
// 	})

// 	// Test the GetByRequestID method
// 	t.Run("Get Request Driver by Request ID", func(t *testing.T) {
// 		results, err := requestDriverRepository.GetByRequestID(requestID)
// 		assert.NoError(t, err, "Error getting request driver by request ID")
// 		assert.NotNil(t, results, "Result should not be empty")
// 		assert.Equal(t, 1, len(*results), "There should be one record")
// 		assert.Equal(t, driverID, (*results)[0].DriverID, "Driver ID should match")
// 	})
// 	// Test the DeleteByReqID method
// 	t.Run("Delete Request Driver by Request ID", func(t *testing.T) {
// 		err := requestDriverRepository.DeleteByReqID(requestID)
// 		assert.NoError(t, err, "Error deleting request driver by request ID")

// 		// Check that record is deleted
// 		results, err := requestDriverRepository.GetByRequestID(requestID)
// 		assert.NoError(t, err, "Error getting request driver after delete")
// 		assert.Equal(t, 0, len(*results), "No records should be left after delete")
// 	})
// }
