package types

import (
	"encoding/base32"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

func GenerateInvoiceID(id uuid.UUID) string {
	encoded := base32.StdEncoding.EncodeToString(id[:])
	return fmt.Sprintf("H-%s", strings.TrimRight(encoded, "=")) // Remove padding "="
}

type TemplateData struct {
	ID                uuid.UUID
	FullName          string
	Price             float64
	Symbol            string
	DistanceKmService float64
	DistanciaKmTotal  float64
	Status            string
	FromAddress       string
	ToAddress         string
	TotalTime         string
	Date              string
}

func TemplateCompletedToUser(data TemplateData) string {
	return fmt.Sprintf(`
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">Hola %s, Gracias por confiar en Mya</b>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px;">
            <b>Detalle del servicio:</b>
            <p><b>Servicio:</b> %s</p>
            <p><b>Fecha:</b> %s</p>
            <p><b>Estado:</b> %s</p>
            <p><b>Desde:</b> %s</p>
            <p><b>Hasta:</b> %s</p>
            <p><b>Distancia del Servicio:</b> %.2f km</p>
            <p><b>Distancia Total:</b> %.2f km</p>
            <p><b>Total de tiempo:</b> %s</p>
            <p><b>Precio total:</b> %.2f %s</p>
          </td>
        </tr>
      </table>`,
		data.FullName,
		GenerateInvoiceID(data.ID),
		data.Date,
		data.Status,
		data.FromAddress,
		data.ToAddress,
		data.DistanceKmService,
		data.DistanciaKmTotal,
		data.TotalTime,
		data.Price,
		data.Symbol,
	)
}

func TemplateCompletedToDriver(data TemplateData) string {
	return fmt.Sprintf(`
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">Hola %s, Gracias por completar el servicio en Mya</b>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px;">
            <p>Detalle del servicio:</p>
            <p><b>Servicio:</b> %s</p>
            <p><b>Fecha:</b> %s</p>
            <p><b>Estado:</b> %s</p>
            <p><b>Desde:</b> %s</p>
            <p><b>Hasta:</b> %s</p>
            <p><b>Distancia del Servicio:</b> %.2f km</p>
            <p><b>Distancia Total:</b> %.2f km</p>
            <p><b>Total de tiempo:</b> %s</p>
            <p><b>Precio total:</b> %.2f %s</p>
          </td>
        </tr>
      </table>`,
		data.FullName,
		GenerateInvoiceID(data.ID),
		data.Date,
		data.Status,
		data.FromAddress,
		data.ToAddress,
		data.DistanceKmService,
		data.DistanciaKmTotal,
		data.TotalTime,
		data.Price,
		data.Symbol,
	)
}
