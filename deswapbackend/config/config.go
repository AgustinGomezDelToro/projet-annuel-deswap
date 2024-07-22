package config

import (
	"os"
)

// Déclaration des constantes de configuration par défaut pour la base de données
const (
	defaultDbHost     = "ep-calm-sun-a2vzni0d.eu-central-1.aws.neon.tech"
	defaultDbPort     = "5432"
	defaultDbName     = "deswap"
	defaultDbUser     = "deswap_owner"
	defaultDbPassword = "tWvV9kaLuT2y"
	defaultSSLMode    = "require"
)

// Config structure contient les paramètres de configuration pour la base de données
type Config struct {
	DbHost     string
	DbPort     string
	DbName     string
	DbUser     string
	DbPassword string
	SSLMode    string
}

// getEnv retourne la valeur de la variable d'environnement si elle est définie et non vide
// Sinon, elle retourne la valeur par défaut fournie
func getEnv(key, defaultValue string) string {
	if value, ok := os.LookupEnv(key); ok && value != "" {
		return value
	}
	return defaultValue
}

// LoadConfig charge les paramètres de configuration de la base de données
// en utilisant les valeurs par défaut ou celles des variables d'environnement
func LoadConfig() Config {
	return Config{
		DbHost:     getEnv("DB_HOST", defaultDbHost),
		DbPort:     getEnv("DB_PORT", defaultDbPort),
		DbName:     getEnv("DB_NAME", defaultDbName),
		DbUser:     getEnv("DB_USER", defaultDbUser),
		DbPassword: getEnv("DB_PASSWORD", defaultDbPassword),
		SSLMode:    getEnv("SSL_MODE", defaultSSLMode),
	}
}
