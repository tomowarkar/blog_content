package main

import (
	"os"
	"bufio"
	"fmt"
	"strings"
)



func inputLine() string {
	var sc = bufio.NewScanner(os.Stdin)
	sc.Scan()
	return sc.Text()
}

func main() {
	fmt.Println(inputLine())

	inputs := strings.Split(inputLine(), " ")
		
	fmt.Println(inputs)
	var nums []int
	fmt.Println(nums)
}