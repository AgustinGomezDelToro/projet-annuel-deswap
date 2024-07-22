package database

import (
	"deswapbackend/config"
	"deswapbackend/models"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB représente une instance de la base de données.
var DB *gorm.DB

// ConnectDatabase établit une connexion à la base de données en utilisant la configuration fournie.
// Il effectue également les migrations automatiques des modèles User, Token, History et Fee.
func ConnectDatabase(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		cfg.DbHost, cfg.DbUser, cfg.DbPassword, cfg.DbName, cfg.DbPort, cfg.SSLMode)
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	database.AutoMigrate(&models.User{}, &models.Token{}, &models.History{}, &models.Fee{}, &models.Pool{})

	DB = database
}

// LoadConfig charge la configuration à partir des variables d'environnement.
func LoadConfig() config.Config {
	return config.Config{
		DbHost:     os.Getenv("DB_HOST"),
		DbPort:     os.Getenv("DB_PORT"),
		DbName:     os.Getenv("DB_NAME"),
		DbUser:     os.Getenv("DB_USER"),
		DbPassword: os.Getenv("DB_PASSWORD"),
		SSLMode:    os.Getenv("SSL_MODE"),
	}
}
