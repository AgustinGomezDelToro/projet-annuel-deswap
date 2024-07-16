package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllFees retourne tous les frais
func GetAllFees(c *fiber.Ctx) error {
	var fees []models.Fee
	database.DB.Find(&fees) // Récupère tous les frais de la base de données
	return c.JSON(fees)     // Retourne les frais en format JSON
}

// AddFee ajoute un nouveau frais
func AddFee(c *fiber.Ctx) error {
	var fee models.Fee
	if err := c.BodyParser(&fee); err != nil { // Parse le corps de la requête en modèle de frais
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()}) // Retourne une erreur si le parsing échoue
	}
	database.DB.Create(&fee)
	return c.JSON(fee)
}

// GetFeesByUser retourne les frais pour un utilisateur spécifique
func GetFeesByUser(c *fiber.Ctx) error {
	userID := c.Params("userID") // Récupère l'ID utilisateur des paramètres de la requête
	var fees []models.Fee
	if result := database.DB.Where("user_id = ?", userID).Find(&fees); result.Error != nil { // Récupère les frais de l'utilisateur
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}

// GetFeesByToken retourne les frais pour un token spécifique
func GetFeesByToken(c *fiber.Ctx) error {
	tokenID := c.Params("tokenID")
	var fees []models.Fee
	if result := database.DB.Where("token_id = ?", tokenID).Find(&fees); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}

// GetFeesByWallet retourne les frais pour un portefeuille spécifique
func GetFeesByWallet(c *fiber.Ctx) error {
	walletID := c.Params("walletID")
	var fees []models.Fee
	if result := database.DB.Where("from_wallet = ? OR to_wallet = ?", walletID, walletID).Find(&fees); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}
