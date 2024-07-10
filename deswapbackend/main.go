package main

import (
	"deswapbackend/config"
	"deswapbackend/controllers"
	"deswapbackend/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	log "github.com/sirupsen/logrus"
)

func main() {
	app := fiber.New()

	// Middleware CORS pour autoriser toutes les adresses IP
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Charger la configuration et connecter la base de données
	cfg := config.LoadConfig()
	database.ConnectDatabase(cfg)

	// Configurer les routes pour les utilisateurs
	app.Get("/users", controllers.GetAllUsers)
	app.Post("/users/add", controllers.AddUser)
	app.Put("/users/update", controllers.UpdateUser)
	app.Get("/users/:publicKey", controllers.GetUserByPK)

	// Routes d'administration pour les utilisateurs
	app.Put("/admin/users/ban/:publicKey", controllers.BanUser)
	app.Put("/admin/users/unban/:publicKey", controllers.UnbanUser)
	app.Put("/admin/users/promote/:publicKey", controllers.PromoteAdmin)

	// Configurer les routes pour les tokens
	app.Get("/tokens", controllers.GetAllTokens)
	app.Post("/tokens/add", controllers.AddToken)
	app.Put("/tokens/update", controllers.UpdateToken)
	app.Get("/tokens/:address", controllers.GetByAddress)
	app.Delete("/tokens/:address", controllers.DeleteToken)

	// Configurer les routes pour l'historique
	app.Get("/histories", controllers.GetAllHistories)
	app.Post("/histories/add", controllers.AddHistory)
	app.Get("/histories/user/:userID", controllers.GetHistoriesByUser)

	log.Info("Server started on port 3001")
	app.Listen(":3001")
}
