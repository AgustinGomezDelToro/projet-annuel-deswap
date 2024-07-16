package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// BanUser bannit un utilisateur en définissant le champ IsBanned à true
func BanUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey") // Récupère la clé publique de l'utilisateur à partir des paramètres de la requête
	var user models.User
	// Recherche l'utilisateur dans la base de données par clé publique
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"}) // Retourne une erreur si l'utilisateur n'est pas trouvé
	}
	user.IsBanned = true
	database.DB.Save(&user) // Sauvegarde les modifications dans la base de données
	return c.JSON(user)     // Retourne l'utilisateur mis à jour
}

// UnbanUser débannit un utilisateur en définissant le champ IsBanned à false
func UnbanUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey") // Récupère la clé publique de l'utilisateur à partir des paramètres de la requête
	var user models.User
	// Recherche l'utilisateur dans la base de données par clé publique
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"}) // Retourne une erreur si l'utilisateur n'est pas trouvé
	}
	user.IsBanned = false
	database.DB.Save(&user) // Sauvegarde les modifications dans la base de données
	return c.JSON(user)     // Retourne l'utilisateur mis à jour
}

// PromoteUser promeut un utilisateur en définissant le champ IsAdmin à true et en définissant le rôle à "admin"
func PromoteUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey") // Récupère la clé publique de l'utilisateur à partir des paramètres de la requête
	var user models.User
	// Recherche l'utilisateur dans la base de données par clé publique
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"}) // Retourne une erreur si l'utilisateur n'est pas trouvé
	}
	user.IsAdmin = true
	user.Role = "admin"
	database.DB.Save(&user) // Sauvegarde les modifications dans la base de données
	return c.JSON(user)     // Retourne l'utilisateur mis à jour
}

// IsAdmin vérifie si un utilisateur est administrateur
func IsAdmin(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey") // Récupère la clé publique de l'utilisateur à partir des paramètres de la requête

	var user models.User
	// Recherche l'utilisateur dans la base de données par clé publique
	if err := database.DB.Where("public_key = ?", publicKey).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"}) // Retourne une erreur si l'utilisateur n'est pas trouvé
	}

	// Vérifie si l'utilisateur est administrateur
	if !user.IsAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "User is not an admin"}) // Retourne une erreur si l'utilisateur n'est pas administrateur
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "User is an admin"}) // Retourne un message de succès si l'utilisateur est administrateur
}
