package notification

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

type MailService struct {
	addr       string
	auth       smtp.Auth
	from       string
	SupportURL string
}

func NewMailService() *MailService {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	user := os.Getenv("SMTP_USER")
	pass := os.Getenv("SMTP_PASS")
	from := os.Getenv("SMTP_FROM")

	//Web Support
	supportURL := os.Getenv("VERIFY_APP")

	auth := smtp.PlainAuth("", user, pass, host)
	addr := fmt.Sprintf("%s:%s", host, port)

	return &MailService{
		addr:       addr,
		auth:       auth,
		from:       from,
		SupportURL: supportURL,
	}
}

func (s *MailService) SendMail(to, subject, body string) error {
	// Build msg with HTML
	msg := []byte("From: " + s.from + "\r\n" + // header From
		"To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"MIME-Version: 1.0\r\n" +
		"Content-Type: text/html; charset=\"UTF-8\"\r\n" +
		"\r\n" +
		body + "\r\n")

	// Send Email
	err := smtp.SendMail(s.addr, s.auth, s.from, []string{to}, msg)
	if err != nil {
		log.Printf("Error mail.SendMail: %v", err)

	}
	return err
}
