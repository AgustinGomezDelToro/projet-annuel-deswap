package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllHistories récupère toutes les histoires de la base de données et les renvoie en tant que réponse JSON.
func GetAllHistories(c *fiber.Ctx) error {
	var histories []models.History
	database.DB.Find(&histories)
	return c.JSON(histories)
}

// AddHistory ajoute une nouvelle histoire à la base de données en utilisant les données fournies dans le corps de la requête.
// Si une erreur se produit lors de l'analyse du corps de la requête, une réponse d'erreur avec le statut BadRequest est renvoyée.
func AddHistory(c *fiber.Ctx) error {
	var history models.History
	if err := c.BodyParser(&history); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&history)
	return c.JSON(history)
}

// GetHistoriesByUser récupère toutes les histoires associées à un utilisateur spécifié par son ID.
// Si aucune histoire n'est trouvée pour l'utilisateur donné, une réponse d'erreur avec le statut NotFound est renvoyée.
func GetHistoriesByUser(c *fiber.Ctx) error {
	userID := c.Params("userID")
	var histories []models.History
	if result := database.DB.Where("user_id = ?", userID).Find(&histories); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Histories not found"})
	}
	return c.JSON(histories)
}
