package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllPools récupère tous les pools de la base de données et les renvoie en tant que réponse JSON.
func GetAllPools(c *fiber.Ctx) error {
	var pools []models.Pool
	database.DB.Find(&pools)
	return c.JSON(pools)
}

// AddPool ajoute un nouveau pool à la base de données en utilisant les données fournies dans le corps de la requête.
// Si une erreur se produit lors de l'analyse du corps de la requête, une réponse d'erreur avec le statut BadRequest est renvoyée.
func AddPool(c *fiber.Ctx) error {
	var pool models.Pool
	if err := c.BodyParser(&pool); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if result := database.DB.Create(&pool); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.JSON(pool)
}
