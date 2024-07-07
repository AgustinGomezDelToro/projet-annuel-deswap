package models

import "gorm.io/gorm"

type History struct {
	gorm.Model
	In        string  `json:"in"`  // Token in
	Out       string  `json:"out"` // Token out
	AmountIn  float32 `json:"amount_in"`
	AmountOut float32 `json:"amount_out"`
	Price     float32 `json:"price"`
	Timestamp int64   `json:"timestamp"`
	UserID    uint    `json:"user_id"`
}
