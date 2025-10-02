package routes

import (
	"errors"
	"log"
	"os"

	"github.com/spf13/viper"
)

type GatewayConfig struct {
	Routes []Route `mapstructure:"routes"`
}

func GatewayRoutes(env string) ([]Route, error) {

	configPath := "./config/"
	configName := "routes."

	switch env {
	case "dev":
		configName += "dev.yml"
	case "local":
		configName += "local.yml"
	case "prod":
		configName += "prod.yml"
	default:
		return nil, errors.New("ENVIRONMENT variable no definida o valor incorrecto")
	}

	viper.AddConfigPath(configPath)
	viper.SetConfigType("yaml")
	viper.SetConfigName(configName)

	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Warning could not load configuration: %v", err)
	}

	log.SetOutput(os.Stdout)

	viper.AutomaticEnv()

	gatewayConfig := &GatewayConfig{}
	err = viper.UnmarshalKey("gateway", gatewayConfig)
	if err != nil {
		panic(err)
	}

	return gatewayConfig.Routes, nil
}
