package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	PublicKey            string    `json:"public_key"`
	Role                 string    `json:"role"`
	Status               string    `json:"status"`
	Signature            string    `json:"signature"`
	Email                string    `json:"email"`
	Password             string    `json:"password"`
	FirstName            string    `json:"first_name"`
	LastName             string    `json:"last_name"`
	Birthdate            time.Time `json:"birthdate"`
	IsBanned             bool      `json:"is_banned"`
	IsAdmin              bool      `json:"is_admin"`
	NumberOfTransactions int       `json:"number_of_transactions"`
}
