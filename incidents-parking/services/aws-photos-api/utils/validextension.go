package utils

import "strings"

func ValidExtension(fileName string) bool {
	allowedExtensions := []string{".jpeg", ".jpg", ".jpe", ".jfif", ".jfi", ".jif", ".heif", ".heic", ".png"}
	for _, ext := range allowedExtensions {
		if strings.HasSuffix(fileName, ext) {
			return true
		}
	}
	return false
}
