package services

import (
	"fmt"

	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/models"
	"github.com/VinukaThejana/link-shortner/backend/schemas"
	"gorm.io/gorm"
)

// Github contains Github related OAuth operations
type Github struct{}

func create(h *initializers.H, profile schemas.BasicOAuthProvider, provider string) (newUser models.User, err error) {
	verified := true

	newUser.Name = profile.Name
	newUser.Username = profile.Username
	newUser.PhotoURL = profile.PhotoURL
	newUser.Verified = &verified
	newUser.Provider = &provider
	newUser.ProviderID = profile.ID

	if profile.Email != nil {
		newUser.Email = *profile.Email
	}

	newUser, err = User{}.Create(h, newUser)
	if err != nil {
		return models.User{}, err
	}

	return newUser, nil
}

// GithubOAuth is a function that is used to create a new Github user
func (Github) GithubOAuth(h *initializers.H, profile schemas.Github) (user models.User, err error) {
	provider := models.GithubProvider

	err = h.DB.DB.
		Where("provider = ?", provider).
		Where("provider_id = ?", fmt.Sprint(profile.ID)).
		Select("id", "name", "username", "photo_url", "email", "role", "provider", "provider_id", "verified").
		First(&user).
		Error
	fmt.Println("The error is : ", err)
	if err != nil {
		if err != gorm.ErrRecordNotFound {
			return models.User{}, err
		}

		if profile.Email == nil {
			ok, err := User{}.IsUsernameAvailable(h, profile.Username)
			if err != nil {
				return models.User{}, err
			}

			if !ok {
				// INFO: If other providers other than Github is added prompt the user for chosing a new Username
				return models.User{}, errors.ErrBadRequest
			}

			user, err := create(h, schemas.BasicOAuthProvider{
				ID:       fmt.Sprint(profile.ID),
				Name:     profile.Name,
				Username: profile.Username,
				Email:    profile.Email,
				PhotoURL: profile.AvatarURL,
			}, provider)
			if err != nil {
				return models.User{}, err
			}

			return user, nil
		}

		_, ok, verified, _, err := User{}.IsEmailAvailable(h, *profile.Email)
		if err != nil {
			return models.User{}, err
		}

		if !ok && verified {
			// INFO: the provider is different than Github if more providers other than Github is added to the platform
			// update the below code and prompt the user to merge the providers
			return models.User{}, errors.ErrBadRequest
		}

		if !ok {
			// TODO: Think of the about what to do when the email is available in the platform and the email is not verified
			return models.User{}, errors.ErrBadRequest
		}

		user, err := create(h, schemas.BasicOAuthProvider{
			ID:       fmt.Sprint(profile.ID),
			Name:     profile.Name,
			Username: profile.Username,
			Email:    profile.Email,
			PhotoURL: profile.AvatarURL,
		}, provider)
		if err != nil {
			return models.User{}, err
		}

		return user, nil
	}

	return user, nil
}
