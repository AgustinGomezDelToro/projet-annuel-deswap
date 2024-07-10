package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

func GetAllHistories(c *fiber.Ctx) error {
	var histories []models.History
	database.DB.Find(&histories)
	return c.JSON(histories)
}

func AddHistory(c *fiber.Ctx) error {
	var history models.History
	if err := c.BodyParser(&history); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&history)
	return c.JSON(history)
}

func GetHistoriesByUser(c *fiber.Ctx) error {
	userID := c.Params("userID")
	var histories []models.History
	if result := database.DB.Where("user_id = ?", userID).Find(&histories); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Histories not found"})
	}
	return c.JSON(histories)
}
