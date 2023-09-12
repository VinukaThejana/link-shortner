// Link shortner backend
package main

import (
	"flag"
	"fmt"
	"time"

	"github.com/VinukaThejana/go-utils/logger"
	"github.com/VinukaThejana/link-shortner/backend/config"
	"github.com/VinukaThejana/link-shortner/backend/controllers"
	"github.com/VinukaThejana/link-shortner/backend/initializers"
	"github.com/VinukaThejana/link-shortner/backend/middleware"
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
	links controllers.Links
)

func init() {
	env.Load()

	h.InitStorage(&env)
	h.InitDB(&env)
	h.InitRedis(&env)
}

func main() {
	enableMigrations := flag.Bool("migrate", false, "Migrate the schema to the database")
	flag.Parse()
	if enableMigrations != nil && *enableMigrations {
		h.Migrate()
		return
	}

	app := fiber.New()

	app.Use(fiberLogger.New())
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowOrigins:     env.FrontEndDomain,
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

	userG := app.Group("/user", func(c *fiber.Ctx) error {
		return middleware.Auth{}.CheckAuth(c, &h, &env)
	})
	userG.Get("/me", func(c *fiber.Ctx) error {
		return user.GetMe(c)
	})
	userG.Route("/update", func(router fiber.Router) {
		router.Post("/email", func(c *fiber.Ctx) error {
			return user.UpdateEmail(c, &h)
		})
		router.Post("/username", func(c *fiber.Ctx) error {
			return user.UpdateUsername(c, &h)
		})
		router.Post("/name", func(c *fiber.Ctx) error {
			return user.UpdateName(c, &h)
		})
	})

	linksG := app.Group("/links", func(c *fiber.Ctx) error {
		return middleware.Auth{}.CheckAuth(c, &h, &env)
	})
	linksG.Get("/", func(c *fiber.Ctx) error {
		return links.GetLinks(c, &h)
	})
	linksG.Post("/new", func(c *fiber.Ctx) error {
		return links.New(c, &h)
	})
	linksG.Route("/delete", func(router fiber.Router) {
		router.Post("/", func(c *fiber.Ctx) error {
			return links.DeleteLink(c, &h)
		})
		router.Post("/all", func(c *fiber.Ctx) error {
			return links.DeleteLinks(c, &h)
		})
	})
	linksG.Route("/update", func(router fiber.Router) {
		router.Post("/", func(c *fiber.Ctx) error {
			return links.Update(c, &h)
		})
		router.Post("/key", func(c *fiber.Ctx) error {
			return links.UpdateKey(c, &h)
		})
		router.Post("/url", func(c *fiber.Ctx) error {
			return links.UpdateURL(c, &h)
		})
	})

	checkG := app.Group("/check")
	checkG.Route("/users", func(router fiber.Router) {
		router.Post("/username", func(c *fiber.Ctx) error {
			return user.CheckUsername(c, &h)
		})
	})
	checkG.Route("/links", func(router fiber.Router) {
		router.Post("/key", func(c *fiber.Ctx) error {
			return links.CheckKey(c, &h)
		})
	})

	log.Errorf(app.Listen(fmt.Sprintf(":%s", env.Port)), nil)
}
