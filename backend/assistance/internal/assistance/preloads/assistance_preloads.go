package preloads

import "gorm.io/gorm"

type PreloadOption func(*gorm.DB) *gorm.DB

func PreloadWithLocationDetails(db *gorm.DB) *gorm.DB {
	return db.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			return db.Table("u_users").
				Select("u_users.*, ST_Y(u_users_location.location::geometry) AS latitude, ST_X(u_users_location.location::geometry) AS longitude").
				Joins("LEFT JOIN u_users_location ON u_users_location.user_id = u_users.id")
		}).
		Preload("Driver", func(db *gorm.DB) *gorm.DB {
			return db.Table("u_users").
				Select("u_users.*, ST_Y(u_users_location.location::geometry) AS latitude, ST_X(u_users_location.location::geometry) AS longitude").
				Joins("LEFT JOIN u_users_location ON u_users_location.user_id = u_users.id")
		}).
		Preload("WSUser").
		Preload("Coin").
		Preload("Status")
}

func PreloadWithDetails(db *gorm.DB) *gorm.DB {
	return db.Preload("User").
		Preload("WSUser").
		Preload("Driver").
		Preload("Coin").
		Preload("Status").
		Preload("Company")
}

func PreloadVehicleWithDetails(db *gorm.DB) *gorm.DB {
	return db.Preload("Vehicle", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Make").
			Preload("Model").
			Preload("Type").
			Preload("EngineType").
			Preload("Weight").
			Preload("Color").
			Preload("DriveTrainType")
	})
}

func PreloadTowTruckWithDetails(db *gorm.DB) *gorm.DB {
	return db.Preload("TowTruck", func(db *gorm.DB) *gorm.DB {
		return db.Preload("Make").
			Preload("Type").
			Preload("Color")
	})
}
