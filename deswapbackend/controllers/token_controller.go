package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

func GetAllTokens(c *fiber.Ctx) error {
	var tokens []models.Token
	database.DB.Find(&tokens)
	return c.JSON(tokens)
}

func AddToken(c *fiber.Ctx) error {
	var token models.Token
	if err := c.BodyParser(&token); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&token)
	return c.JSON(token)
}

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

func GetByAddress(c *fiber.Ctx) error {
	address := c.Params("address")
	var token models.Token
	if result := database.DB.Where("address = ?", address).First(&token); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Token not found"})
	}
	return c.JSON(token)
}

func DeleteToken(c *fiber.Ctx) error {
	address := c.Params("address")
	if result := database.DB.Where("address = ?", address).Delete(&models.Token{}); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
