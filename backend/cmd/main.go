// Link shortner backend
package main

import (
	"fmt"
	"time"

	"github.com/VinukaThejana/go-utils/logger"
	"github.com/VinukaThejana/link-shortner/backend/config"
	"github.com/VinukaThejana/link-shortner/backend/controllers"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	fiberLogger "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
)

var (
	log logger.Logger

	env config.Env
	h   initializers.H

	auth  controllers.Auth
	oauth controllers.OAuth
	user  controllers.User
)

func init() {
	env.Load()

	h.InitStorage(&env)
	h.InitDB(&env)
	h.InitRedis(&env)
}

func main() {
	app := fiber.New()

	app.Use(fiberLogger.New())
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "*",
		AllowOrigins:     "*",
		AllowCredentials: true,
		AllowMethods:     "*",
	}))
	app.Use(limiter.New(limiter.Config{
		Max:        100,
		Expiration: 1 * time.Minute,
		KeyGenerator: func(c *fiber.Ctx) string {
			return c.IP()
		},
		LimitReached: func(c *fiber.Ctx) error {
			return c.SendStatus(fiber.StatusTooManyRequests)
		},
		SkipFailedRequests:     false,
		SkipSuccessfulRequests: false,
		LimiterMiddleware:      limiter.SlidingWindow{},
		Storage:                h.S.S,
	}))
	app.Get("/metrics", monitor.New(monitor.Config{
		Title: "auth",
	}))

	authG := app.Group("/auth")
	authG.Get("/login", func(c *fiber.Ctx) error {
		return oauth.RedirectToGitHubOAuthFlow(c, &env)
	})
	authG.Get("/logout", func(c *fiber.Ctx) error {
		return auth.Logout(c, &h, &env)
	})
	authG.Get("/refresh", func(c *fiber.Ctx) error {
		return auth.RefreshToken(c, &h, &env)
	})

	oauthG := app.Group("/oauth")
	oauthG.Get("/callback/github", func(c *fiber.Ctx) error {
		return oauth.GithubOAuthCalback(c, &h, &env)
	})
	oauthG.Get("/login/github", func(c *fiber.Ctx) error {
		return oauth.RedirectToGitHubOAuthFlow(c, &env)
	})

	userG := app.Group("/user")
	userG.Get("/me", func(c *fiber.Ctx) error {
		return user.GetMe(c)
	})

	log.Errorf(app.Listen(fmt.Sprintf(":%s", env.Port)), nil)
}
