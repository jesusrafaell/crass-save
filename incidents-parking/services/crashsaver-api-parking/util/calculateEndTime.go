package util

import "time"

func CalculateEndTime(initTime int64, hours uint) int64 {
	startTime := time.Unix(initTime, 0)          // Convierte initTime a time.Time
	duration := time.Duration(hours) * time.Hour // Crea una duración en horas
	endTime := startTime.Add(duration)           // Añade la duración al startTime
	return endTime.Unix()                        // Convierte endTime a formato Unix
}
