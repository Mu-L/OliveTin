package api

import (
	"errors"
	"runtime"

	config "github.com/OliveTin/OliveTin/internal/config"
	"github.com/alexedwards/argon2id"
	log "github.com/sirupsen/logrus"
)

var ErrArgon2Busy = errors.New("too many concurrent password operations")

const argon2MaxConcurrent = 10

var argon2Sem = make(chan struct{}, argon2MaxConcurrent)

var defaultParams = argon2id.Params{
	Memory:      64 * 1024,
	Iterations:  4,
	Parallelism: uint8(runtime.NumCPU()),
	SaltLength:  16,
	KeyLength:   32,
}

func CreateHash(password string) (string, error) {
	select {
	case argon2Sem <- struct{}{}:
		defer func() { <-argon2Sem }()
	default:
		return "", ErrArgon2Busy
	}
	hash, err := argon2id.CreateHash(password, &defaultParams)

	if err != nil {
		log.Fatal("Error creating hash: ", err)
		return "", err
	}

	return hash, nil
}

func createHash(password string) (string, error) {
	return CreateHash(password)
}

func comparePasswordAndHash(password, hash string) (bool, error) {
	select {
	case argon2Sem <- struct{}{}:
		defer func() { <-argon2Sem }()
	default:
		return false, ErrArgon2Busy
	}
	match, err := argon2id.ComparePasswordAndHash(password, hash)

	if err != nil {
		log.Errorf("Error comparing password and hash: %v", err)
		return false, nil
	}

	return match, nil
}

func checkUserPassword(cfg *config.Config, username, password string) (bool, error) {
	for _, user := range cfg.AuthLocalUsers.Users {
		if user.Username == username {
			match, err := comparePasswordAndHash(password, user.Password)
			if err != nil {
				return false, err
			}
			if match {
				return true, nil
			} else {
				log.WithFields(log.Fields{
					"username": username,
				}).Warn("Password does not match for user")

				return false, nil
			}
		}
	}

	log.WithFields(log.Fields{
		"username": username,
	}).Warn("Failed to check password for user, as username was not found")

	return false, nil
}
