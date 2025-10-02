package models

import (
	"time"
)

const (
	MaxRadiusMeters    = uint32(100 * 1000) // 100km * 1000 = meters
	RefreshTimeRequest = 20 * time.Second
	MaxTimeRequest     = 1 * time.Hour
	//
	RefreshTimeRequestWaiting = 20 * time.Second
	MaxTimeRequestWaiting     = 120 * time.Second
)
