package initializers

import (
	"github.com/VinukaThejana/link-shortner/backend/config"
	"github.com/VinukaThejana/link-shortner/backend/models"
	"github.com/fatih/color"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	gormLogger "gorm.io/gorm/logger"
)

// DB contains the connection to the database
type DB struct {
	DB *gorm.DB
}

// InitDB initialize the connection between the datbase
func (h *H) InitDB(env *config.Env) {
	db, err := gorm.Open(mysql.Open(env.DSN), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Errorf(err, nil)
	}

	// Enable the logger for logging database activities
	db.Logger = gormLogger.Default.LogMode(gormLogger.Info)

	color.Blue("Running migrations ... ")
	err = db.AutoMigrate(&models.User{}, &models.Link{}, &models.Sessions{})
	if err != nil {
		log.Errorf(err, nil)
	}

	h.DB = &DB{DB: db}
}
