package config

import (
	"os"
)

const (
	defaultDbHost     = "localhost"
	defaultDbPort     = "5432"
	defaultDbName     = "deswapdb"
	defaultDbUser     = "postgres"
	defaultDbPassword = "azerty"
)

type Config struct {
	DbHost     string
	DbPort     string
	DbName     string
	DbUser     string
	DbPassword string
}

func getEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return defaultValue
}

func LoadConfig() Config {
	return Config{
		DbHost:     getEnv("DB_HOST", defaultDbHost),
		DbPort:     getEnv("DB_PORT", defaultDbPort),
		DbName:     getEnv("DB_NAME", defaultDbName),
		DbUser:     getEnv("DB_USER", defaultDbUser),
		DbPassword: getEnv("DB_PASSWORD", defaultDbPassword),
	}
}
