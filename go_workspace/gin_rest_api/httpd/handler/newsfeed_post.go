package handler

import (
	"gin_rest_api/platform/newsfeed"
	"github.com/gin-gonic/gin"
	"net/http"
)

type newsFeedPostRequest struct {
	Title string `json:"title"`
	Post  string `json:"post"`
}

func NewsfeedPost(feed newsfeed.Adder) gin.HandlerFunc {
	return func(c *gin.Context) {
		requestBody := newsFeedPostRequest{}
		c.Bind(&requestBody)

		item := newsfeed.Item{
			Title: requestBody.Title,
			Post: requestBody.Post,
		}
		feed.Add(item)

		c.Status(http.StatusNoContent)
	}
}
