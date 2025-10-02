package utils

import (
	"math"

	"bitbucket.org/mya/mya-assistance-core/types"
)

func Haversine(origin types.Location, destination types.Location) float64 {
	var R float64 = 6371                // Radius of the Earth in kilometers
	var b1 = origin.Lat * math.Pi / 180 // φ, λ in radians
	var b2 = destination.Lat * math.Pi / 180
	var dis1 = (destination.Lat - origin.Lat) * math.Pi / 180
	var dis2 = (destination.Lng - origin.Lng) * math.Pi / 180
	var a = math.Sin(dis1/2)*math.Sin(dis1/2) +
		math.Cos(b1)*math.Cos(b2)*
			math.Sin(dis2/2)*math.Sin(dis2/2)
	var c = 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return R * c
}
