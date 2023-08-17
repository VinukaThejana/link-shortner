package controllers

import (
	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/utils"
	"github.com/gofiber/fiber/v2"
)

// User contains all the user related controllers
type User struct{}

// GetUser is a function to get the user details of the currently logged in user
func (User) GetUser(c *fiber.Ctx) error {
	user, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}
