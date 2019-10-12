package handler

import (
	"net/http"
	"text/template"

	"github.com/gorilla/mux"
	"github.com/go-redis/redis"
)

var client *redis.Client
var templates *template.Template

// MicropostGet return ...
func MicropostGet(w http.ResponseWriter, r *http.Request) {
	comments, err := client.LRange("comments", 0, 10).Result()
	if err != nil {
		return
	}
	templates.ExecuteTemplate(w, "index.html", comments)
}

// MicropostPost return ...
func MicropostPost(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	comment := r.PostForm.Get("comment")
	client.LPush("comments", comment)
	http.Redirect(w, r, "/", 302)
}