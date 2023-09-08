package services

import (
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/models"
	"github.com/VinukaThejana/link-shortner/backend/schemas"
	"gorm.io/gorm"
)

// Link contains all the services related to links
type Link struct {
	H *initializers.H
}

// IsKeyAvailable is a function to check wether a given key is available in the database for a specific link
//
// returns true  - If the key is free to use
//
// returns false - If the key is not free to use
func (l *Link) IsKeyAvailable(key string) (bool, error) {
	var link models.Link
	err := l.H.DB.DB.Select("url").Where(&models.Link{Key: key}).First(&link).Error
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return false, err
		}

		return true, nil
	}

	return false, nil
}

// Create a link in the database under the creating user
func (l *Link) Create(user *schemas.User, url, key string) error {
	link := models.Link{
		URL:    url,
		Key:    key,
		UserID: user.ID,
	}

	err := l.H.DB.DB.Create(&link).Error
	if err != nil {
		return err
	}

	return nil
}

// GetLink is a function to get the url of the relevant key
func (l *Link) GetLink(key string) (url *string, err error) {
	var link models.Link
	err = l.H.DB.DB.Select("url").Where(&models.Link{Key: key}).First(&link).Error
	if err != nil {
		return nil, err
	}

	return &link.URL, nil
}

// GetLinks is a function to get all the links relevant to the user
func (l *Link) GetLinks(user *schemas.User, page int, limit int) (links []models.Link, err error) {
	err = l.H.DB.DB.Scopes(Paginate(l.H, page, limit)).Where(&models.Link{UserID: user.ID}).Find(&links).Error
	if err != nil {
		return []models.Link{}, err
	}

	return links, nil
}

// DeleteLink is a function to delete a link with the specific key
func (l *Link) DeleteLink(user *schemas.User, key string) error {
	err := l.H.DB.DB.Where(&models.Link{Key: key, UserID: user.ID}).Delete(&models.Link{}).Error
	if err != nil {
		return err
	}

	return nil
}

// DeleteLinks is a function to delete all the links that belong to a user
func (l *Link) DeleteLinks(user *schemas.User) error {
	err := l.H.DB.DB.Where(&models.Link{UserID: user.ID}).Delete(&models.Link{}).Error
	if err != nil {
		return err
	}

	return nil
}
