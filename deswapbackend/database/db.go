package db

import (
	"fmt"

	"deswapbackend/models"

	"github.com/gofiber/fiber/v2/log"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabasePostgres struct {
	Db *gorm.DB
}

var DB DatabasePostgres

func ConnectDatabase(DbHost, DbUser, DbPassword, DbName, DbPort string) {

	connectionString := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable TimeZone=Asia/Shanghai", DbHost, DbUser, DbPassword, DbName)
	log.Info("Connecting to database with : ", connectionString)

	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Error(err)
		log.Fatal("Error connecting to database : ", err)
	}

	log.Info("Database connected successfully")
	db.Logger = logger.Default.LogMode(logger.Info)
	log.Info("running migrations")
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Token{})
	db.AutoMigrate(&models.History{})

	DB = DatabasePostgres{
		Db: db,
	}
}
