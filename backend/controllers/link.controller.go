package controllers

import (
	"github.com/VinukaThejana/link-shortner/backend/errors"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/services"
	"github.com/VinukaThejana/link-shortner/backend/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/lithammer/shortuuid/v4"
	"gorm.io/gorm"
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

// GetLinks is a function to get all the links created by the user
func (Links) GetLinks(c *fiber.Ctx, h *initializers.H) error {
	userD, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	linkS := services.Link{H: h}

	links, err := linkS.GetLinks(userD)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"links": links,
	})
}

// DeleteLink is a function to delete a link with a given key
func (Links) DeleteLink(c *fiber.Ctx, h *initializers.H) error {
	var payload struct {
		Key string `json:"key" validate:"required,min=3"`
	}

	if err := c.BodyParser(&payload); err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusBadRequest).JSON(response{
			Status: errors.ErrBadRequest.Error(),
		})
	}

	userD, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	linkS := services.Link{H: h}
	err = linkS.DeleteLink(userD, payload.Key)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusBadRequest).JSON(response{
				Status: errors.ErrKeyDoesNotExsist.Error(),
			})
		}

		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(response{
		Status: errors.Okay,
	})
}

// DeleteLinks is a function that is used to delete all the links that belong to the user
func (Links) DeleteLinks(c *fiber.Ctx, h *initializers.H) error {
	userD, err := utils.Session{}.Get(c)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	linkS := services.Link{H: h}
	err = linkS.DeleteLinks(userD)
	if err != nil {
		log.Error(err, nil)
		return c.Status(fiber.StatusInternalServerError).JSON(response{
			Status: errors.ErrInternalServerError.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(response{
		Status: errors.Okay,
	})
}
