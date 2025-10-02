package utils

import (
	"fmt"
)

type TemplateWSParams struct {
	Title  string
	Desc   string
	Footer string // Optional footer message
}

func GetTemplateUserWS(params *TemplateWSParams) string {
	return fmt.Sprintf(`
      <table align="center" border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding: 10px;">
            <b style="font-size: 20px;">%[1]s</b>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding: 10px;">
            %[2]s
          </td>
        </tr>
        %s
      </table>`,
		params.Title,
		params.Desc,
		func() string {
			if params.Footer != "" {
				return fmt.Sprintf(`
                    <tr>
                      <td align="center" style="padding: 10px; font-size: 12px; color: #666;">
                        %[1]s
                      </td>
                    </tr>`, params.Footer)
			}
			return ""
		}(),
	)
}
