package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
)

const baseURL = "https://dev.yourappssistance.com/api/v1"

type LoginResponse struct {
	Data struct {
		AccessToken string `json:"access_token"`
	} `json:"data"`
	Message string `json:"message"`
	Ok      bool   `json:"ok"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	SO       string `json:"so"`
}

func getUsers() []LoginRequest {
	return []LoginRequest{
		{
			Email:    "jesus@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "jesus2@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "daniel@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "Armanddo@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "jeus@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "johan@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
		{
			Email:    "geraldin@crashsaverapp.com",
			Password: "Test123.",
			SO:       "ios",
		},
	}
}

func main() {
	users := getUsers()
	var wg sync.WaitGroup
	// for i := range 10 {

	fmt.Println("Solicitudes:", len(users))

	for _, u := range users {
		wg.Add(1)
		go flow(u, &wg)
	}

	wg.Wait()
	// fmt.Println("Todas las solicitudes han sido procesadas STEP:", i+1)
	// time.Sleep(5 * time.Second)
	// }
}

func flow(dataLogin LoginRequest, wg *sync.WaitGroup) {
	defer wg.Done()

	// Paso 1: Realizar la solicitud para obtener el token de acceso
	token, err := login(dataLogin)
	if err != nil {
		log.Fatalf("Failed to get user data: %v", err)
	}

	// Paso 2: Realizar 4 solicitudes GET utilizando el token de acceso
	for i := 0; i < 4; i++ {
		err := makeAuthorizedRequest(token)
		if err != nil {
			log.Fatalf("Failed to make authorized request #%d: %v", i+1, err)
		}
	}

	//Paso 3: Logout después de las solicitudes
	err = logout(token)
	if err != nil {
		log.Fatalf("Failed to logout: %v", err)
	}

	fmt.Println("Proceso completado con éxito para:", dataLogin.Email)
}

// Función para realizar la primera solicitud POST para obtener el token de acceso
func login(loginData LoginRequest) (string, error) {
	url := baseURL + "/auth/login"
	jsonData, err := json.Marshal(loginData)
	if err != nil {
		return "", fmt.Errorf("error al convertir la solicitud de inicio de sesión a JSON: %v", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("error al crear la solicitud de inicio de sesión: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error al enviar la solicitud de inicio de sesión: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error al leer la respuesta de inicio de sesión: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("error en la respuesta de inicio de sesión: %d, body: %s", resp.StatusCode, string(body))
	}

	var loginResp LoginResponse
	if err := json.Unmarshal(body, &loginResp); err != nil {
		return "", fmt.Errorf("error al analizar la respuesta de inicio de sesión: %v", err)
	}

	// log.Println("Logueado", loginResp.Data.AccessToken)
	return loginResp.Data.AccessToken, nil
}

// Función para realizar solicitudes GET autorizadas utilizando el token de acceso
func makeAuthorizedRequest(accessToken string) error {
	url := baseURL + "/users/data"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}

	// Agregar el token de acceso en el header de autorización
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	// Leer el cuerpo de la respuesta si es necesario
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Printf("Request successful, response: %s\n", body)

	return nil
}

// Función para cerrar sesión (logout) utilizando el token de acceso
func logout(accessToken string) error {
	url := baseURL + "/auth/logout"

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(nil))
	if err != nil {
		return err
	}

	// Agregar el token de acceso en el header de autorización
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code: %d", resp.StatusCode)
	}

	fmt.Println("Logout successful")

	return nil
}
