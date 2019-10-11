package main

import (
    "log"
    "image"
    "image/jpeg"
    "image/color"
    "os"
)

var (
    x = 0
    y = 0
    width = 400
    height = 300
    quality = 100
)

func main() {
    log.Println("start")

    // 短形を作成する
    img := image.NewRGBA(image.Rect(x, y, width, height))
    // 短形に色を追加
    for i := img.Rect.Min.Y; i<img.Rect.Max.Y;i++ {
        for j := img.Rect.Min.X; j<img.Rect.Max.X; j++ {
            img.Set(j, i, color.RGBA{255, 255, 0, 0})
        }
    }

    // ファイルを作成し、終了時にクローズ
    file, _ := os.Create("img/sampleImage1.jpg")
    defer file.Close()

    err := jpeg.Encode(file, img, &jpeg.Options{quality});
    if err != nil {
        log.Println(err)
    }

    log.Println("end")
}