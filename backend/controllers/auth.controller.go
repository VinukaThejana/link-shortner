package controllers

import (
	"time"

	"github.com/VinukaThejana/link-shortner/backend/config"
	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/utils"
	"github.com/gofiber/fiber/v2"
)

// Auth is a struct containing the Auth controllers
type Auth struct{}

// Logout is a function that is used to logout the user from the application
func (Auth) Logout(c *fiber.Ctx, h *initializers.H, env *config.Env) error {
	state := c.Query("state")
	if state == "" {
		state = env.FrontEndDomain
	}

	refreshToken := c.Cookies("refresh_token")
	if refreshToken == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(response{
			Status: errors.ErrUnauthorized.Error(),
		})
	}

	tokenDetails, tokenValue, err := utils.Token{}.ValidateRefreshToken(h, refreshToken, env.RefreshTokenPublicKey)
	if err != nil {
		if err == errors.ErrUnauthorized {
			return c.Status(fiber.StatusUnauthorized).JSON(response{
				Status: err.Error(),
			})
		}

		if ok := (errors.CheckTokenError{}.Expired(err)); !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(response{
				Status: errors.ErrRefreshTokenExpired.Error(),
			})
		}

		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	err = utils.Token{}.DeleteToken(h, tokenDetails.TokenUUID, tokenValue.AccessTokenUUID)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	expired := time.Now().Add(-time.Hour * 24)

	c.Cookie(&fiber.Cookie{
		Name:    "access_token",
		Value:   "",
		Expires: expired,
	})
	c.Cookie(&fiber.Cookie{
		Name:    "refresh_token",
		Value:   "",
		Expires: expired,
	})
	c.Cookie(&fiber.Cookie{
		Name:    "session",
		Value:   "",
		Expires: expired,
	})

	return c.Status(fiber.StatusOK).JSON(response{
		Status: errors.Okay,
	})
}
