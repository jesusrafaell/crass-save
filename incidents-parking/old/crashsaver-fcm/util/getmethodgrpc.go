package util

import "strings"

func GetMethodName(str string) string {
	p := strings.Split(str, "/")
	if len(p) > 2 {
		return p[2]
	}
	return str
}
