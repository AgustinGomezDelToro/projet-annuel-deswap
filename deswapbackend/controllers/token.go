package controllers

import (
    "deswapbackend/database"
    "deswapbackend/models"
    "github.com/gofiber/fiber/v2"
)


type TokenRequest struct {
	Name    string  `json:"name"`
	Symbole string  `json:"symbole"`
	Price   float32 `json:"price"`
	Logo    string  `json:"logo"`
	Address string  `json:"address"`
}

func AddToken(c *fiber.Ctx) error {
	var tokenReq TokenRequest
	if err := c.BodyParser(&tokenReq); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}
	token := models.Token{Name: tokenReq.Name, Symbole: tokenReq.Symbole, Price: tokenReq.Price, Logo: tokenReq.Logo, Address: tokenReq.Address}
	err := db.DB.CreateToken(token)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.SendString("Token added successfully")
}

func UpdateToken(c *fiber.Ctx) error {
	var token models.Token
	if err := c.BodyParser(&token); err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid request")
	}
	err := db.DB.UpdateToken(token)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.SendString("Token updated successfully")
}

func GetAllTokens(c *fiber.Ctx) error {
	tokens, err := db.DB.GetAllTokens()
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.JSON(tokens)
}

func GetByAddress(c *fiber.Ctx) error {
	address := c.Params("address")
	token, err := db.DB.GetTokenByAddress(address)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.JSON(token)
}

func DeleteToken(c *fiber.Ctx) error {
	token := c.Params("token")
	err := db.DB.DeleteToken(token)
	if err != nil {
		return c.SendString(err.Error())
	}
	return c.SendString("Token deleted successfully")
}
