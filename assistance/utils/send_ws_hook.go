package utils

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/google/uuid"
)

func SendWebhook(url, to string, reqID *uuid.UUID) {
	var reqIDstr string
	if reqID != nil {
		reqIDstr = reqID.String()
	}

	payload := fmt.Sprintf(`{
		"from_number": "%s",
		"mobile": "%s",
		"req_id": "%s"
	}`, to, to, reqIDstr)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer([]byte(payload)))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error al enviar el mensaje:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Mensaje enviado exitosamente:", resp.Status)
}
