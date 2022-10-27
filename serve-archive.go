package main

import (
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("serving on port 8090")
	http.Handle("/", http.FileServer(http.Dir("./archive")))
	http.ListenAndServe(":8090", nil)
}
