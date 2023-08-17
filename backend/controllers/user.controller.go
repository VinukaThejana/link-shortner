package controllers

import (
	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/services"
	"github.com/VinukaThejana/link-shortner/backend/utils"
	"github.com/gofiber/fiber/v2"
)

// User contains all the user related controllers
type User struct{}

// GetMe is a function to get the user details of the currently logged in user
func (User) GetMe(c *fiber.Ctx) error {
	user, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

// CheckUsername is a function to check wether the username is availale or not
func (User) CheckUsername(c *fiber.Ctx, h *initializers.H) error {
	var payload struct {
		Username string `json:"username"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(response{
			Status: errors.ErrBadRequest.Error(),
		})
	}

	type response struct {
		Available bool `json:"available"`
	}

	available, err := services.User{}.IsUsernameAvailable(h, payload.Username)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Available: false,
		})
	}

	return c.Status(fiber.StatusOK).JSON(response{
		Available: available,
	})
}
