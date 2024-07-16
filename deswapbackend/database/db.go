package database

import (
	"deswapbackend/config"
	"deswapbackend/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB représente une instance de la base de données.
var DB *gorm.DB

// ConnectDatabase établit une connexion à la base de données en utilisant la configuration fournie.
// Il effectue également les migrations automatiques des modèles User, Token, History et Fee.
func ConnectDatabase(cfg config.Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		cfg.DbHost, cfg.DbUser, cfg.DbPassword, cfg.DbName, cfg.DbPort)
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	database.AutoMigrate(&models.User{}, &models.Token{}, &models.History{}, &models.Fee{})

	DB = database
}
