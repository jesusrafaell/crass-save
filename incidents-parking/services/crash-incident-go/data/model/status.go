package model

type StatusIncident struct {
	Name string
	Key  int32
}

var (
	Undefined = &StatusIncident{
		Name: "undefined",
		Key:  0,
	}
	Active = &StatusIncident{
		Name: "active",
		Key:  1,
	}
	InProgress = &StatusIncident{
		Name: "in_progress",
		Key:  2,
	}
	Resolved = &StatusIncident{
		Name: "resolved",
		Key:  3,
	}
)
