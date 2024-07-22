package models

import "gorm.io/gorm"

type Pool struct {
	gorm.Model
	TokenA   string  `json:"tokenA"`
	TokenB   string  `json:"tokenB"`
	SupplyA  float32 `json:"supplyA"`
	SupplyB  float32 `json:"supplyB"`
	AddressA string  `json:"addressA"`
}
