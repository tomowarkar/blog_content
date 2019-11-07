# 素のJSで頑張りたい

### card template
```html
<div class="card" style="width: 100%;">
  <div class="card-body">
    <h6 class="card-subtitle mb-2 text-muted">#{{ .ItemNum }}</h6>
    <h5 class="card-title">{{ .ItemTitle }}</h5>
    <a href="https://github.com/tomowarkar/blog_content/tree/master/snipet/works/">ソースコード</a>
    <iframe src="./works/0000/index.html" width="100%"></iframe>  
  </div>
</div>
```

### works template
```
cp -r works/0000/ works/{.ItemNum}/
```