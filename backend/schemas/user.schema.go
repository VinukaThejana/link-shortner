package schemas

import (
	"time"

	"github.com/VinukaThejana/link-shortner/backend/models"
)

// User contians the most essential details of the user that should be available to the public
type User struct {
	ID         uint64 `json:"id"`
	Name       string `json:"name"`
	Username   string `json:"username"`
	Email      string `json:"email"`
	PhotoURL   string `json:"photo_url"`
	Role       string `json:"role"`
	Provider   string `json:"provider"`
	ProviderID string `json:"provider_id"`
}

// UserResponse the data that the user should receive when the user data is requested
type UserResponse struct {
	ID        uint64    `json:"id,omitempty"`
	Name      string    `json:"name,omitempty"`
	Username  string    `json:"username,omitempty"`
	Email     string    `json:"email,omitempty"`
	Role      string    `json:"role,omitempty"`
	Provider  string    `json:"provider,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// FilterUserRecord filter the user data that is fetched from the database so that it is in the
// most user secure way possible
func FilterUserRecord(user *models.User) UserResponse {
	return UserResponse{
		ID:        user.ID,
		Name:      user.Name,
		Username:  user.Username,
		Email:     user.Email,
		Role:      *user.Role,
		Provider:  *user.Provider,
		CreatedAt: *user.CreatedAt,
		UpdatedAt: *user.UpdatedAt,
	}
}
