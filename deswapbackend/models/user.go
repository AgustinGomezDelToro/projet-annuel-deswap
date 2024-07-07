package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	PublicKey string `json:"public_key"`
	Role      string `json:"role"`   // USER / ADMIN
	Status    string `json:"status"` // ACTIVE / BAN
	Signature string `json:"signature"`
}
