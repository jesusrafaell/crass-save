package util

import (
	"crashsaver/parking/types"
	"fmt"
)

func GetTemplateByParams(params *types.TemplateEmailBookingValue, lang string) (string, string) {
	subject := "Reserva Realizada"
	end := "Saludos"
	titles := &types.TemplateEmailBookingTitle{
		Title: `Hola,`,
		Description: fmt.Sprintf(`
			Tenemos una nueva reserva en su parking: %s 
			<br/>
			<br/>
			Estos son los datos del camión y la fecha:
			<br/>
		`, params.ParkingName),
		LicensePlateTitle:     `Matrícula del camión`,
		LicenseContainerTitle: `Matrícula del tráiler`,
		EntryDateTitle:        `Fecha y hora de entrada`,
		ExitDateTitle:         `Fecha y hora de salida`,
		HoursTotalTitle:       `Horas totales de la reserva`,
		CompanyTitle:          `Compañía de camiones`,
	}

	if lang == "fr" {
		subject = "Réservation effectuée"
		end = "Salutations"
		titles = &types.TemplateEmailBookingTitle{
			Title: `Bonjour,`,
			Description: fmt.Sprintf(`
				Nous avons une nouvelle réservation dans votre parking : %s 
				<br/>
				<br/>
				Voici les données du camion et de la date :
				<br/>
			`, params.ParkingName),
			LicensePlateTitle:     `Immatriculation du camion`,
			LicenseContainerTitle: `Immatriculation du remorque`,
			EntryDateTitle:        `Date et heure d'entrée`,
			ExitDateTitle:         `Date et heure de sortie`,
			HoursTotalTitle:       `Heures totales de la réservation`,
			CompanyTitle:          `Compagnie de camions`,
		}

	} else if lang == "en" {
		subject = "Reservation Made"
		end = "Greetings"
		titles = &types.TemplateEmailBookingTitle{
			Title: `Hello,`,
			Description: fmt.Sprintf(`
				We have a new reservation in your parking: %s 
				<br/>
				<br/>
				Here are the truck and date details:
				<br/>
			`, params.ParkingName),
			LicensePlateTitle:     `Truck license plate`,
			LicenseContainerTitle: `Trailer license plate`,
			EntryDateTitle:        `Entry date and time`,
			ExitDateTitle:         `Exit date and time`,
			HoursTotalTitle:       `Total hours of the reservation`,
			CompanyTitle:          `Truck company`,
		}
	}
	html := fmt.Sprintf(`
      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">%s</b>
          </td>
        </tr>
        <tr>
          <td>
            %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td >
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		%s
      </table>
    `, titles.Title,
		titles.Description,
		titles.LicensePlateTitle, params.LicensePlateValue,
		titles.LicenseContainerTitle, params.LicenseContainerValue,
		titles.EntryDateTitle, params.EntryDateValue,
		titles.ExitDateTitle, params.ExitDateValue,
		titles.HoursTotalTitle, params.HoursTotalValue,
		titles.CompanyTitle, params.CompanyValue,
		end,
	)

	return html, subject
}

func templateDesc(text1, text2 string) string {
	return fmt.Sprintf(`
			%[1]s
			<br/>
			<br/>
			%[2]s
			<br/>
		`, text1, text2)
}

func GetTemplateCancelledByParams(params *types.TemplateEmailBookingValue, lang string) (string, string) {
	subject := "Reserva Cancelada"
	end := "Saludos"
	titles := &types.TemplateEmailBookingTitle{
		Title:                 `Hola,`,
		Description:           templateDesc(fmt.Sprintf(`Se ha cancelado una reserva en su parking: %s`, params.ParkingName), "Estos son los datos del camión y la fecha:"),
		LicensePlateTitle:     `Matrícula del camión`,
		LicenseContainerTitle: `Matrícula del tráiler`,
		EntryDateTitle:        `Fecha y hora de entrada`,
		ExitDateTitle:         `Fecha y hora de salida`,
		HoursTotalTitle:       `Horas totales de la reserva`,
		CompanyTitle:          `Compañía de camiones`,
	}

	if lang == "fr" {
		subject = "Réservation annulée"
		end = "Salutations"
		titles = &types.TemplateEmailBookingTitle{
			Title:                 `Bonjour,`,
			Description:           templateDesc(fmt.Sprintf(`Une réservation a été annulée dans votre parking:  %s`, params.ParkingName), "Voici les données du camion et de la date: "),
			LicensePlateTitle:     `Immatriculation du camion`,
			LicenseContainerTitle: `Immatriculation du remorque`,
			EntryDateTitle:        `Date et heure d'entrée`,
			ExitDateTitle:         `Date et heure de sortie`,
			HoursTotalTitle:       `Heures totales de la réservation`,
			CompanyTitle:          `Compagnie de camions`,
		}

	} else if lang == "en" {
		subject = "Booking Cancelled"
		end = "Greetings"
		titles = &types.TemplateEmailBookingTitle{
			Title:                 `Hello,`,
			Description:           templateDesc(fmt.Sprintf(` A reservation has been cancelled in your parking: %s`, params.ParkingName), "Here are the truck and date details: "),
			LicensePlateTitle:     `Truck license plate`,
			LicenseContainerTitle: `Trailer license plate`,
			EntryDateTitle:        `Entry date and time`,
			ExitDateTitle:         `Exit date and time`,
			HoursTotalTitle:       `Total hours of the reservation`,
			CompanyTitle:          `Truck company`,
		}
	}

	html := fmt.Sprintf(`
      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">%s</b>
          </td>
        </tr>
        <tr>
          <td>
            %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td >
		  	%s: %s
          </td>
        </tr>
		<tr>
          <td>
		  	%s: %s
          </td>
        </tr>
		%s
      </table>
    `, titles.Title,
		titles.Description,
		titles.LicensePlateTitle, params.LicensePlateValue,
		titles.LicenseContainerTitle, params.LicenseContainerValue,
		titles.EntryDateTitle, params.EntryDateValue,
		titles.ExitDateTitle, params.ExitDateValue,
		titles.HoursTotalTitle, params.HoursTotalValue,
		titles.CompanyTitle, params.CompanyValue,
		end,
	)

	return html, subject
}
