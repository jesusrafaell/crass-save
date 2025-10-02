package types

type Validator struct {
	Properties Properties
}

type Properties struct {
	Name       string
	Required   bool
	Message    string
	Type       string
	Pattern    *string
	MinLength  *int32
	MaxLength  *int32
	Properties *Properties
}
