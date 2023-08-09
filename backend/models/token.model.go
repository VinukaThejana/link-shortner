package models

import "time"

// Sessions is a struct that represents the sessions table in the database which is used to store details
// about the sessions that are provided to the user
type Sessions struct {
	TokenID   uint64 `gorm:"primaryKey;autoIncrement:true"`
	UserID    uint64 `gorm:"not null"`
	IPAddress string
	Location  string
	Device    string
	OS        string
	LoginAt   time.Time `gorm:"not null;default:now()"`
	ExpiresAt int64     `gorm:"not null"`
}
