package db

import (
	"deswapbackend/models"
	"strings"
)

func GetPools(token *models.Token) []string {
	if token.Pools == "" {
		return []string{}
	}
	return strings.Split(token.Pools, ",")
}

func SetPools(token *models.Token, pools []string) {
	token.Pools = strings.Join(pools, ",")
}

func (d *DatabasePostgres) CreateToken(token models.Token) error {
	result := d.Db.Create(&token)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (d *DatabasePostgres) UpdateToken(token models.Token) error {
	var existingToken models.Token
	result := d.Db.Where("address = ?", token.Address).First(&existingToken)
	if result.Error != nil {
		return result.Error
	}
	existingToken.Name = token.Name
	existingToken.Symbole = token.Symbole
	existingToken.Price = token.Price
	existingToken.Logo = token.Logo
	existingToken.Address = token.Address
	SetPools(&existingToken, GetPools(&token))
	result = d.Db.Save(&existingToken)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (d *DatabasePostgres) DeleteToken(token string) error {
	result := d.Db.Delete(&models.Token{}, token)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (d *DatabasePostgres) GetAllTokens() ([]models.Token, error) {
	var tokens []models.Token
	result := d.Db.Find(&tokens)
	if result.Error != nil {
		return tokens, result.Error
	}
	return tokens, nil
}

func (d *DatabasePostgres) GetTokenByAddress(address string) (models.Token, error) {
	var token models.Token
	result := d.Db.Where("address = ?", address).First(&token)
	if result.Error != nil {
		return token, result.Error
	}
	return token, nil
}
