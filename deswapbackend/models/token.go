package models

import (
	"gorm.io/gorm"
)

type Token struct {
	gorm.Model
	Name    string  `json:"name"`
	Symbole string  `json:"symbole"`
	Price   float32 `json:"price"`
	Logo    string  `json:"logo"`
	Address string  `json:"address"`
	Pools   string  `json:"pools"`
	Trades  uint    `json:"trades"`
}
