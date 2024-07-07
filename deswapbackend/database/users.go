package db

import "deswapbackend/models"

func (d *DatabasePostgres) CreateUser(user models.User) error {
	result := d.Db.Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (d *DatabasePostgres) UpdateUser(user models.User) error {
	result := d.Db.Save(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (d *DatabasePostgres) GetUserByPublicKey(publicKey string) (models.User, error) {
	var user models.User
	result := d.Db.Where("public_key = ?", publicKey).First(&user)
	if result.Error != nil {
		return user, result.Error
	}
	return user, nil
}

func (d *DatabasePostgres) GetAllUsers() ([]models.User, error) {
	var users []models.User
	result := d.Db.Find(&users)
	if result.Error != nil {
		return users, result.Error
	}
	return users, nil
}
