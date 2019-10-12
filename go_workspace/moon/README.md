# Lesson1
### init
```
~$ mkdir moon
~$ cd moon
~/moon$ touch README.md
~/moon$ touch makefile
~/moon$ touch main.go
~/moon$ go mod init moon
```
### set makefile
```
dev:
	go run main.go
```
# goでの簡単なルーティング
### Install [gorilla/mux](https://github.com/gorilla/mux)
```
~/moon$ go get -u github.com/gorilla/mux
```
### update main.go
```go
package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")
	r.HandleFunc("/about", aboutHandler).Methods("GET")
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello")
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "About")
}
```
### 現在のファイルツリー
```
~/moon
 ┝ go.mod
 ┝ go.sum
 ┝ main.go
 ┝ makefile
 └ README.md
```
### go run
```
~/moon$ make dev
```
### access localhost
##### index
[http://localhost:8080/](http://localhost:8080/)
##### about
[http://localhost:8080/about/](http://localhost:8080/about/)


# Lesson2
### create index.html
```
~/moon$ mkdir templates
~/moon$ touch templates/index.html
```
### update index.html
```html
<html>
  <head>
    <title>This is my portfolio!!!</title>
  </head>
  <body>
    <h1>簡単なHTMLで作成されています。</h1>
    <h2>簡単なHTMLで作成されています。</h2>
    <h3>簡単なHTMLで作成されています。</h3>
    <h4>簡単なHTMLで作成されています。</h4>
    <h5>簡単なHTMLで作成されています。</h5>
  </body>
</html>
```
### update main.go
```go
package main

import (
	"net/http"
	"text/template"

	"github.com/gorilla/mux"
)

var templates *template.Template

func main() {
	templates = template.Must(template.ParseGlob("templates/*.html"))
	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	templates.ExecuteTemplate(w, "index.html", nil)
}
```
### 現在のファイルツリー
```
~/moon 
 ┝ templates/
 | └ index.html
 ┝ go.mod
 ┝ go.sum
 ┝ main.go
 ┝ makefile
 └ README.md
```
### go run
```
~/moon$ make dev
```
### access localhost
##### index
[http://localhost:8080/](http://localhost:8080/)

# Lesson3
### Install [go-redis/redis](https://github.com/go-redis/redis)
```
~moon$ go get -u github.com/go-redis/redis
```
[redis参考](https://qiita.com/TakashiOshikawa/items/83d3b59b4835eb9ba63e)
### tips
`vscode` で `go` のパッケージが見つからない時の参考

[cannot find package “github.com/gorilla/mux” in any of:](https://stackoverflow.com/questions/41539909/cannot-find-package-github-com-gorilla-mux-in-any-of)

```
cd $GOPATH
go list ... | grep <your package>
```
- if you din't see gorilla in the above two command, then you need to install it
```
go get -v -u github.com/your/package
```
- restart Vscode

### update index.html
```html
<html>
  <head>
    <title>This is my portfolio!!!</title>
  </head>
  <body>
    <h1>Comments</h1>
    {{ range . }}
    <div>{{ . }}</div>
    {{ end }}
  </body>
</html>
```
### update main.go
```go
package main

import (
	"net/http"
	"text/template"

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
	r.HandleFunc("/", handler).Methods("GET")
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func handler(w http.ResponseWriter, r *http.Request) {
	comments, err := client.LRange("comments", 0, 10).Result()
	if err != nil {
		return
	}
	templates.ExecuteTemplate(w, "index.html", comments)
}
```
### start redis server
```
~/moon$ redis-server
```
### add comments in redis
```
~/moon$ redis-cli
127.0.0.1:6379> lpush comments "hi"
(integer) 1
127.0.0.1:6379> lpush comments "comment1"
(integer) 2
127.0.0.1:6379> lpush comments "comment2"
(integer) 3
127.0.0.1:6379> exit
```
### redisの中身を確認する
```
~/moon$ redis-cli
127.0.0.1:6379> keys *
1) "comments"
127.0.0.1:6379> type comments
list
127.0.0.1:6379> lrange comments 0 -1
1) "comment2"
2) "comment1"
3) "hi"
127.0.0.1:6379> exit
```
### go run
```
~/moon$ make dev
```
### access localhost
##### index
[http://localhost:8080/](http://localhost:8080/)
# Lesson4
### update index.html
```html
<html>
  <head>
    <title>This is my portfolio!!!</title>
  </head>
  <body>
    <h1>Comments</h1>
    <form method="POST">
      <textarea name="comment"></textarea>
      <div>
        <button type="submit">Post Comment</button>
      </div>
    </form>
    {{ range . }}
    <div>{{ . }}</div>
    {{ end }}
  </body>
</html>
```
### update main.go
```go
package main

import (
	"net/http"
	"text/template"

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
	r.HandleFunc("/", indexGetHandler).Methods("GET")
	r.HandleFunc("/", indexPostHandler).Methods("POST")
	http.Handle("/", r)
	http.ListenAndServe(":8080", nil)
}

func indexGetHandler(w http.ResponseWriter, r *http.Request) {
	comments, err := client.LRange("comments", 0, 10).Result()
	if err != nil {
		return
	}
	templates.ExecuteTemplate(w, "index.html", comments)
}
func indexPostHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	comment := r.PostForm.Get("comment")
	client.LPush("comments", comment)
	http.Redirect(w, r, "/", 302)
}
```
### go run
```
~/moon$ make dev
```
### access localhost
##### index
[http://localhost:8080/](http://localhost:8080/)