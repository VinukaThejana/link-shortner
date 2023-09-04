package controllers

import (
	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/services"
	"github.com/VinukaThejana/link-shortner/backend/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/lithammer/shortuuid/v4"
)

// Links contains all the operations that are related to links
type Links struct{}

// New create a new link with the key or without the key
func (Links) New(c *fiber.Ctx, h *initializers.H) error {
	var payload struct {
		Link string `json:"link" validate:"required,url,min=3"`
		Key  string `json:"key"`
	}

	if err := c.BodyParser(&payload); err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusBadRequest).JSON(response{
			Status: errors.ErrBadRequest.Error(),
		})
	}

	if ok := log.Validate(payload); !ok {
		return c.Status(fiber.StatusBadRequest).JSON(response{
			Status: errors.ErrBadRequest.Error(),
		})
	}

	linkS := services.Link{H: h}
	key := ""

	if payload.Key == "" {
		for i := 1; i <= 4; i++ {
			newKey := shortuuid.New()
			ok, err := linkS.IsKeyAvailable(newKey)
			if err != nil {
				log.Error(err, nil)
				break
			}

			if ok {
				key = newKey
				break
			}
		}

		if key == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(response{
				Status: errors.ErrInternalServerError.Error(),
			})
		}
	} else {
		ok, err := linkS.IsKeyAvailable(payload.Key)
		if err != nil {
			log.Error(err, nil)
			return c.Status(fiber.StatusInternalServerError).JSON(response{
				Status: errors.ErrInternalServerError.Error(),
			})
		}

		if !ok {
			return c.Status(fiber.StatusBadRequest).JSON(response{
				Status: errors.ErrKeyAlreadyUsed.Error(),
			})
		}

		key = payload.Key
	}

	userD, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	err = linkS.Create(userD, payload.Link, key)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": errors.Okay,
		"key":    key,
		"url":    payload.Link,
	})
}
