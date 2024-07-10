package models

import "gorm.io/gorm"

type History struct {
	gorm.Model
	UserID  uint    `json:"user_id"`
	Action  string  `json:"action"`
	TokenID uint    `json:"token_id"`
	Amount  float32 `json:"amount"`
	Details string  `json:"details"`
}
