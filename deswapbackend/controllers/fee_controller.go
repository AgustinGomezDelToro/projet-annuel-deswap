package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

func GetAllFees(c *fiber.Ctx) error {
	var fees []models.Fee
	database.DB.Find(&fees)
	return c.JSON(fees)
}

func AddFee(c *fiber.Ctx) error {
	var fee models.Fee
	if err := c.BodyParser(&fee); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&fee)
	return c.JSON(fee)
}

func GetFeesByUser(c *fiber.Ctx) error {
	userID := c.Params("userID")
	var fees []models.Fee
	if result := database.DB.Where("user_id = ?", userID).Find(&fees); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}

func GetFeesByToken(c *fiber.Ctx) error {
	tokenID := c.Params("tokenID")
	var fees []models.Fee
	if result := database.DB.Where("token_id = ?", tokenID).Find(&fees); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}

func GetFeesByWallet(c *fiber.Ctx) error {
	walletID := c.Params("walletID")
	var fees []models.Fee
	if result := database.DB.Where("from_wallet = ? OR to_wallet = ?", walletID, walletID).Find(&fees); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Fees not found"})
	}
	return c.JSON(fees)
}
