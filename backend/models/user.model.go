package models

import "time"

// User is a struct representing the user table in the datbase which contians information
// about the reigstred users that are in the platform
type User struct {
	ID         uint64     `gorm:"primaryKey;autoIncrement:true"`
	Name       string     `gorm:"type:varchar(100);not null"`
	Username   string     `gorm:"type:varchar(100);uniqueIndex;not null"`
	Email      string     `gorm:"type:varchar(100);uniqueIndex"`
	Role       *string    `gorm:"type:varchar(50);default:'user';not null"`
	Provider   *string    `gorm:"type:varchar(50);default:'local';not null"`
	ProviderID string     `gorm:"type:varchar(100)"`
	Verified   *bool      `gorm:"not null;default:false"`
	CreatedAt  *time.Time `gorm:"not null;default:now()"`
	UpdatedAt  *time.Time `gorm:"not null;default:now()"`

	Sessions []Sessions `gorm:"foreignKey:UserID"`
	Links    []Link     `gorm:"foreignKey:UserID"`
}
