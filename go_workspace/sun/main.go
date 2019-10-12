package main

import (
	"net/http"
	"text/template"
	"sun/handler"

	"github.com/gorilla/mux"
	"github.com/go-redis/redis"
)

var client *redis.Client
var templates *template.Template

func main() {
	client = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	templates = template.Must(template.ParseGlob("templates/*.html"))
	r := mux.NewRouter()
	r.HandleFunc("/", handler.MicropostGet).Methods("GET")
	r.HandleFunc("/", handler.MicropostPost).Methods("POST")
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}
