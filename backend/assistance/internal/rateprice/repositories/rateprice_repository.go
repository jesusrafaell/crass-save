package repositories

import (
	"fmt"

	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/entities"
	"bitbucket.org/mya/mya-assistance-core/internal/rateprice/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

// Interfaz para el repositorio de precios por tarifa
type RatePriceRepository interface {
	GetByID(id uuid.UUID) (*entities.RatePriceXType, error)
	GetByKey(key uint) (*entities.RatePriceXType, error)
	GetAll(lang string) (*[]entities.RatePriceXType, error)
	Update(data *entities.RatePriceXType) error
	Delete(id uuid.UUID) error
	GetPriceXKm(lang string, vehicleType uuid.UUID, distanceKm float64) (*models.Price, error)
}

// Implementación del repositorio de precios por tarifa
type ratePriceRepository struct {
	db          *sqlx.DB
	priceKmBase float64
}

func NewRatePriceRepository(database *sqlx.DB) RatePriceRepository {
	return &ratePriceRepository{
		db:          database,
		priceKmBase: 10.00, // Precio base por km
	}
}

func (r *ratePriceRepository) GetByID(id uuid.UUID) (*entities.RatePriceXType, error) {
	var ratePrice entities.RatePriceXType
	query := `SELECT id, 
			created_at,
			updated_at,
			deleted_at,
			km,
			price_km,
			key, 
			vehicle_type_id,
			base,
			coin_id
		FROM a_rate_price_x_type WHERE id = $1
	`

	err := r.db.Get(&ratePrice, query, id)
	if err != nil {
		return nil, err
	}
	return &ratePrice, nil
}

func (r *ratePriceRepository) GetByKey(key uint) (*entities.RatePriceXType, error) {
	var ratePrice entities.RatePriceXType
	query := `SELECT id, 
				created_at,
				updated_at,
				deleted_at,
				km,
				price_km,
				key, 
				vehicle_type_id,
				base,
				coin_id
			FROM a_rate_price_x_type 
			WHERE key = $1
		`

	err := r.db.Get(&ratePrice, query, key)
	if err != nil {
		return nil, err
	}
	return &ratePrice, nil
}

func (r *ratePriceRepository) GetAll(lang string) (*[]entities.RatePriceXType, error) {
	var prices []entities.RatePriceXType
	query := fmt.Sprintf(`
		SELECT 
			rp.id, rp.km, rp.price_km, rp.key, rp.vehicle_type_id, rp.coin_id, 
		    vt.id AS "type.id", vt.%[1]s AS "type.name", vt.key AS "type.key",
		    c.id AS "coin.id", c.name AS "coin.name", c.key AS "coin.key", c.symbol AS "coin.symbol"
		FROM a_rate_price_x_type rp
		LEFT JOIN a_vehicles_types vt ON rp.vehicle_type_id = vt.id
		LEFT JOIN coins c ON rp.coin_id = c.id
		ORDER BY rp.id ASC
	`, lang)

	err := r.db.Select(&prices, query)
	if err != nil {
		return nil, err
	}
	return &prices, nil
}

func (r *ratePriceRepository) Update(data *entities.RatePriceXType) error {
	query := `
		UPDATE a_rate_price_x_type 
		SET km = :km, price_km = :price_km, key = :key, vehicle_type_id = :vehicle_type_id, coin_id = :coin_id
		WHERE id = :id
	`
	_, err := r.db.NamedExec(query, data)
	return err
}

func (r *ratePriceRepository) Delete(id uuid.UUID) error {
	_, err := r.db.Exec("DELETE FROM a_rate_price_x_type WHERE id = $1", id)
	return err
}

func (r *ratePriceRepository) GetPriceXKm(lang string, vehicleType uuid.UUID, distanceKm float64) (*models.Price, error) {
	var prices []entities.RatePriceXType

	query := fmt.Sprintf(`
		SELECT 
			rp.km, rp.price_km, rp.key, rp.base, 
			c.id AS "coin.id", c.name AS "coin.name", c.symbol AS "coin.symbol", c.key AS "coin.key",
			vt.id AS "type.id", vt.%s AS "type.name", vt.key AS "type.key"
		FROM a_rate_price_x_type rp
		LEFT JOIN coins c ON rp.coin_id = c.id
		LEFT JOIN a_vehicles_types vt ON rp.vehicle_type_id = vt.id
		WHERE rp.vehicle_type_id = $1
		ORDER BY rp.km ASC
	`, lang)
	err := r.db.Select(&prices, query, vehicleType)
	if err != nil {
		return nil, err
	}

	if len(prices) == 0 {
		query = `
			SELECT rp.km, rp.price_km, rp.key, c.id AS "coin.id", c.name AS "coin.name"
			FROM a_rate_price_x_type rp
			LEFT JOIN coins c ON rp.coin_id = c.id
			WHERE rp.vehicle_type_id = (SELECT vehicle_type_id FROM a_rate_price_x_type ORDER BY price_km DESC LIMIT 1)
			ORDER BY rp.km ASC
		`
		err = r.db.Select(&prices, query)
		if err != nil {
			return nil, err
		}
	}

	var additionalPrice, baseKm float64
	price := &models.Price{
		Km:          0,
		PriceKm:     prices[0].Base,
		VehicleType: prices[0].Type,
	}

	for _, p := range prices {
		if p.Key == models.KmMinimumKey {
			if distanceKm <= p.Km {
				return &models.Price{
					Km:          distanceKm,
					PriceKm:     p.PriceKm,
					Coin:        *p.Coin,
					VehicleType: p.Type,
				}, nil
			}

			price.Km = p.Km
			price.PriceKm += p.PriceKm
			price.Coin = *p.Coin
			baseKm = p.Km
			break
		}
	}

	if distanceKm > baseKm {
		for _, p := range prices {
			if p.Key == models.KmAdditionalKey {
				extraKm := distanceKm - baseKm
				additionalPrice = p.PriceKm * extraKm
				price.PriceKm += additionalPrice
				price.Km += extraKm
				break
			}
		}
	}

	return price, nil
}
