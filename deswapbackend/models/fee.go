package models

import (
	"gorm.io/gorm"
)

type Fee struct {
	gorm.Model
	Amount     float32 `json:"amount"`
	TokenID    uint    `json:"token_id"`
	FromWallet string  `json:"from_wallet"`
	ToWallet   string  `json:"to_wallet"`
}
