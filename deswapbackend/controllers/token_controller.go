package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllTokens récupère tous les tokens de la base de données et les renvoie en tant que réponse JSON.
func GetAllTokens(c *fiber.Ctx) error {
	var tokens []models.Token
	database.DB.Find(&tokens)
	return c.JSON(tokens)
}

// AddToken ajoute un nouveau token à la base de données en utilisant les données fournies dans le corps de la requête.
// Renvoie le token ajouté en tant que réponse JSON.
func AddToken(c *fiber.Ctx) error {
	var token models.Token
	if err := c.BodyParser(&token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&token)
	return c.JSON(token)
}

// UpdateToken met à jour un token existant dans la base de données en utilisant les données fournies dans le corps de la requête.
// Renvoie le token mis à jour en tant que réponse JSON.
func UpdateToken(c *fiber.Ctx) error {
	var token models.Token
	if err := c.BodyParser(&token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if result := database.DB.Model(&token).Where("address = ?", token.Address).Updates(token); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.JSON(token)
}

// GetByAddress récupère un token spécifique de la base de données en utilisant l'adresse fournie en tant que paramètre de requête.
// Renvoie le token trouvé en tant que réponse JSON.
// GetTokenByAddress récupère un token par son adresse
func GetTokenByAddress(c *fiber.Ctx) error {
	address := c.Params("address")
	var token models.Token
	if err := database.DB.Where("address = ?", address).First(&token).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Token not found"})
	}
	return c.JSON(token)
}

// DeleteToken supprime un token de la base de données en utilisant l'adresse fournie en tant que paramètre de requête.
// Renvoie une réponse sans contenu (204 No Content) si la suppression est réussie.
func DeleteToken(c *fiber.Ctx) error {
	address := c.Params("address")
	if result := database.DB.Where("address = ?", address).Delete(&models.Token{}); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
