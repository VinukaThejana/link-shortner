package services

import (
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/models"
	"gorm.io/gorm"
)

// User is a struct that contains user related services
type User struct{}

// IsUsernameAvailable is a function that is used to check if wether a given username is available or not
// within the platform
func (User) IsUsernameAvailable(h *initializers.H, username string) (bool, error) {
	var user models.User
	err := h.DB.DB.Select("username").Where("username = ?", username).First(&user).Error
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return false, err
		}

		return true, nil
	}

	return false, nil
}

// Create is a function that is used to create a newUser in the database
func (User) Create(h *initializers.H, user models.User) (newUser models.User, err error) {
	newUser = user
	err = h.DB.DB.Create(&newUser).Error
	if err != nil {
		return models.User{}, err
	}

	return newUser, nil
}
