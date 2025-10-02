package types

import "fmt"

type TimeElapsed struct {
	Hours        int   `json:"hours"`
	Minutes      int   `json:"minutes"`
	Seconds      int   `json:"seconds"`
	TotalSeconds int64 `json:"totalSeconds"`
}

func ConvertSeconds(seconds int64) TimeElapsed {
	hours := int(seconds / 3600)
	remainingSeconds := seconds % 3600
	minutes := int(remainingSeconds / 60)
	finalSeconds := int(remainingSeconds % 60)

	return TimeElapsed{
		Hours:        hours,
		Minutes:      minutes,
		Seconds:      finalSeconds,
		TotalSeconds: seconds,
	}
}

func (t *TimeElapsed) FormatHHMM() string {
	hours := int(t.TotalSeconds / 3600)
	minutes := int((t.TotalSeconds % 3600) / 60)
	return fmt.Sprintf("%02d:%02d", hours, minutes)
}
