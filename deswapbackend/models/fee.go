package models

import (
	"gorm.io/gorm"
)

type Fee struct {
	gorm.Model
	Amount     float32 `json:"amount"`
	TokenID    uint    `json:"token_id"`
	FromWallet string  `json:"from_user_id"`
	ToWallet   string  `json:"to_user_id"`
}
