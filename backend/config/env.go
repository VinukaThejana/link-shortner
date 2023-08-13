package config

import "github.com/spf13/viper"

// Env contains the env variables that are used throughout the backend
type Env struct {
	Domain string `mapstructure:"DOMAIN" validate:"required"`
	Port   string `mapstructure:"PORT" validate:"required"`

	DSN string `mapstructure:"DB_USERNAME" validate:"required"`

	RedisRatelimiterUsername string `mapstructure:"REDIS_RATELIMITER_USERNAME" validate:"required"`
	RedisRatelimiterPassword string `mapstructure:"REDIS_RATELIMITER_PASSWORD" validate:"required"`
	RedisRatelimiterHost     string `mapstructure:"REDIS_RATELIMITER_HOST" validate:"required"`
	RedisRatelimiterPort     int    `mapstructure:"REDIS_RATELIMITER_PORT" validate:"required"`

	RedisSessionURL string `mapstructure:"REDIS_SESSION_URL" validate:"required"`

	GithubClientID     string `mapstructure:"GITHUB_CLIENT_ID" validate:"required"`
	GithubClientSecret string `mapstructure:"GITHUB_CLIENT_SECRET" validate:"required"`
	GithubRedirectURL  string `mapstructure:"GITHUB_REDIRECT_URL" validate:"required"`
	GithubFromURL      string `mapstructure:"GITHUB_FROM_URL" validate:"required"`
	GithubRootURL      string `mapstructure:"GITHUB_ROOT_URL" validate:"required"`
}

// Load is a function that loads all the env variables from relevant files and the enviroment to the env variable
func (e *Env) Load() {
	viper.AddConfigPath(".")
	viper.SetConfigFile(".env")

	viper.AutomaticEnv()
	err := viper.ReadInConfig()
	if err != nil {
		log.Errorf(err, nil)
	}

	err = viper.Unmarshal(&e)
	if err != nil {
		log.Errorf(err, nil)
	}

	log.Validatef(e)
}
