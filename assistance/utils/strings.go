package utils

import (
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func Capitalize(str string) string {
	caser := cases.Title(language.Spanish)
	words := strings.Fields(str)
	for i, word := range words {
		words[i] = caser.String(strings.ToLower(word))
	}
	return strings.Join(words, " ")
}

func SplitFullName(fullName string) (string, string) {
	parts := strings.Fields(fullName)

	if len(parts) == 1 {
		return Capitalize(parts[0]), ""
	}

	firstName := strings.Join(parts[:len(parts)-1], " ")
	lastName := parts[len(parts)-1]

	return Capitalize(firstName), Capitalize(lastName)
}
