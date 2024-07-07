package main

import (
	"fmt"
	"log"
	"os"
)

const (
	dbHostKey    = "DB_HOST"
	dbPortKey    = "DB_PORT"
	dbNameKey    = "DB_NAME"
	dbUserKey    = "DB_USER"
	dbPassorsKey = "DB_PASSWORD"
)

type Config struct {
	DbHost     string
	DbPort     string
	DbName     string
	DbUser     string
	DbPassword string
}

func NewConfig() Config {
	dbHost, ok := os.LookupEnv(dbHostKey) // ok est true ou false
	if !ok || dbHost == "" {
		log.Fatal(dbHostKey)
	} else {
		fmt.Println(dbHostKey, ":", dbHost)
	}

	dbPort, ok := os.LookupEnv(dbPortKey)
	if !ok || dbPort == "" {
		log.Fatal(dbPortKey)
	} else {
		fmt.Println(dbPortKey, ":", dbPort)
	}

	dbName, ok := os.LookupEnv(dbNameKey)
	if !ok || dbName == "" {
		log.Fatal(dbNameKey)
	} else {
		fmt.Println(dbNameKey, ":", dbName)
	}

	dbUser, ok := os.LookupEnv(dbUserKey)
	if !ok || dbUser == "" {
		log.Fatal(dbUserKey)
	} else {
		fmt.Println(dbUserKey, ":", dbUser)
	}

	dbPassword, ok := os.LookupEnv(dbPassorsKey)
	if !ok || dbPassword == "" {
		log.Fatal(dbPassorsKey)
	} else {
		fmt.Println(dbPassorsKey, ":", dbPassword)
	}

	fmt.Println("Connection String:", "postgres://"+dbUser+":"+dbPassword+"@"+dbHost+":"+dbPort+"/"+dbName)
	return Config{
		DbHost:     dbHost,
		DbPort:     dbPort,
		DbName:     dbName,
		DbUser:     dbUser,
		DbPassword: dbPassword,
	}
}
