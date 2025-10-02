package router

import (
	"fmt"
	"log"
	"os"

	"github.com/spf13/viper"
)

type Context struct {
	Name    string `mapstructure:"name"`
	Context string `mapstructure:"context"`
}

type Route struct {
	Target   string    `mapstructure:"target"`
	Contexts []Context `mapstructure:"contexts"`
}

type GatewayConfig struct {
	Routes []Route `mapstructure:"routes"`
}

func GatewayRoutes(env string, net bool) ([]Route, error) {
	configPath := "./config/"
	configName := "routes"

	if !net {
		configName += ".dev"
	}

	viper.AddConfigPath(configPath)
	viper.SetConfigType("yaml")
	viper.SetConfigName(configName)

	err := viper.ReadInConfig()
	if err != nil {
		return nil, fmt.Errorf("no se pudo cargar la configuración: %w", err)
	}

	log.SetOutput(os.Stdout)

	viper.AutomaticEnv()

	gatewayConfig := &GatewayConfig{}
	err = viper.UnmarshalKey("gateway", gatewayConfig)
	if err != nil {
		return nil, fmt.Errorf("error al deserializar la configuración del gateway: %w", err)
	}

	return gatewayConfig.Routes, nil
}
