package controllers

import (
	"deswapbackend/database"
	"deswapbackend/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllUsers récupère tous les utilisateurs de la base de données et les renvoie en tant que réponse JSON.
func GetAllUsers(c *fiber.Ctx) error {
	var users []models.User
	if result := database.DB.Find(&users); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Erreur lors de la récupération des utilisateurs"})
	}
	return c.JSON(users)
}

// AddUser ajoute un nouvel utilisateur à la base de données en utilisant les données fournies dans le corps de la requête.
// Renvoie une réponse JSON contenant les détails de l'utilisateur ajouté.
func AddUser(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	database.DB.Create(&user)
	return c.JSON(user)
}

// UpdateUser met à jour les informations d'un utilisateur existant dans la base de données en utilisant les données fournies dans le corps de la requête.
// Renvoie une réponse JSON contenant les détails de l'utilisateur mis à jour.
func UpdateUser(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}
	if result := database.DB.Model(&user).Where("public_key = ?", user.PublicKey).Updates(user); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.JSON(user)
}

// GetUserByPK récupère un utilisateur de la base de données en utilisant la clé publique fournie en tant que paramètre de requête.
// Renvoie une réponse JSON contenant les détails de l'utilisateur trouvé.
func GetUserByPK(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	var user models.User
	if result := database.DB.Where("public_key = ?", publicKey).First(&user); result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Utilisateur introuvable"})
	}
	return c.JSON(user)
}

// DeleteUser supprime un utilisateur de la base de données en utilisant la clé publique fournie en tant que paramètre de requête.
// Renvoie une réponse avec le statut "No Content" si la suppression est réussie.
func DeleteUser(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	if result := database.DB.Where("public_key = ?", publicKey).Delete(&models.User{}); result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": result.Error.Error()})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
