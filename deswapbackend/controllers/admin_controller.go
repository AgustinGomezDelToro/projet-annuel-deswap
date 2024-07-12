package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

func BanUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	var user models.User
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	user.IsBanned = true
	database.DB.Save(&user)
	return c.JSON(user)
}

func UnbanUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	var user models.User
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	user.IsBanned = false
	database.DB.Save(&user)
	return c.JSON(user)
}

func PromoteUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	var user models.User
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	user.IsAdmin = true
	user.Role = "admin"
	database.DB.Save(&user)
	return c.JSON(user)
}
