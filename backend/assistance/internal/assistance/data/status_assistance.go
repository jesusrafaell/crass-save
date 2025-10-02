package data

import "bitbucket.org/mya/mya-assistance-core/pkg/status"

var (
	StatusKeysOn        = []string{status.WaitingKey, status.AcceptedKey, status.ArrivedToUserKey, status.ToDestinationKey, status.ArrivedToDestinationKey}
	StatusKeyEnd        = []string{status.CompletedKey, status.CancelledKey}
	StatusKeysCompleted = []string{status.DriverCompletedKey, status.CompletedKey}
)
