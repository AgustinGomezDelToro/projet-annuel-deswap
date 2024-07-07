package controllers

import (
    "deswapbackend/database"
    "deswapbackend/models"
    "github.com/gofiber/fiber/v2"
)

type UserRequest struct {
	PublicKey string `json:"publicKey"`
	Signature string `json:"signature"`
}

func AddUser(c *fiber.Ctx) error {
	var userReq UserRequest
	if err := c.BodyParser(&userReq); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}
	user := models.User{PublicKey: userReq.PublicKey, Signature: userReq.Signature, Role: "user", Status: "active"}
	err := db.DB.CreateUser(user)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.SendString("User added successfully")
}

func UpdateUser(c *fiber.Ctx) error {
	var user models.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}
	err := db.DB.UpdateUser(user)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.SendString("User updated successfully")
}

func GetUserByPK(c *fiber.Ctx) error {
	publicKey := c.Params("publicKey")
	user, err := db.DB.GetUserByPublicKey(publicKey)
	if err != nil {
		return c.SendString("")
	}
	return c.JSON(user)
}

func GetAllUsers(c *fiber.Ctx) error {
	users, err := db.DB.GetAllUsers()
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.JSON(users)
}
