package main

import (
	"fmt"

	"github.com/jotak/k-charted/business"
	"github.com/jotak/k-charted/config"
)

func main() {
	fmt.Printf("Hello, Charts")
	business.NewDashboardsService(nil, nil, config.Config{GlobalNamespace: "istio-system"})
}
