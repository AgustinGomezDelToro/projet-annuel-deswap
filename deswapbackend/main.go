package main

import (
    "fmt"
    "os"
    "time"
    "deswapbackend/controllers"
    "deswapbackend/database"
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/log"
    log.Info("Server started on port 8080")
    app.Listen(":8080")
)

func main() {

	setLog()
	log.Info("Starting server...")

	app := fiber.New(fiber.Config{})
	config := NewConfig()

	// Middleware CORS pour autoriser toutes les adresses IP
	app.Use(func(c *fiber.Ctx) error {
		// Si la requête est une requête preflight (OPTIONS), retourner une réponse immédiatement avec les en-têtes CORS appropriés
		if c.Method() == fiber.MethodOptions {
			c.Set("Access-Control-Allow-Origin", "*")
			c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
			c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
			return c.SendStatus(fiber.StatusOK)
		}

		// Sinon, continuer à traiter les autres types de requêtes en définissant les en-têtes CORS normalement
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		c.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		return c.Next()
	})

	db.ConnectDatabase(config.DbHost, config.DbUser, config.DbPassword, config.DbName, config.DbPort)

	app.Route("/users", func(api fiber.Router) {
		api.Get("/", controllers.GetAllUsers).Name("getAll")
		api.Post("/add", controllers.AddUser).Name("add")
		api.Put("/update", controllers.UpdateUser).Name("update")
		api.Get("/getByPK/:publicKey", controllers.GetUserByPK).Name("getByPK")
	})

	app.Route("/tokens", func(api fiber.Router) {
		api.Get("/", controllers.GetAllTokens).Name("getAll")
		api.Get("/getByAddress/:address", controllers.GetByAddress).Name("getByAddress")
		api.Post("/add", controllers.AddToken).Name("add")
		api.Put("/update", controllers.UpdateToken).Name("update")
		api.Delete("/delete/:token", controllers.DeleteToken).Name("delete")
	})

	log.Info("Server started on port 3001")
	app.Listen(":3001")

}

func setLog() {
	fmt.Println("setLog: ", time.Now().UTC().Format("2006-01-02"))
	logFileName := fmt.Sprintf("logs/log-%s.log", time.Now().UTC().Format("2006-01-02"))
	file, err := os.OpenFile(logFileName, os.O_CREATE|os.O_APPEND|os.O_RDWR, 0666) // 0666 = CHMOD
	if err != nil {
		log.Panic("setLog: ", err)
		return
	}
	log.SetOutput(file) // changer l'outpout pour dire qu'on print plus dans la console mais dans le fichier
}
