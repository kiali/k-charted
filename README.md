# K-Charted

Dashboards and Charts library for Kubernetes, to use with `MonitoringDashboard` custom resources as [documented in Kiali](https://www.kiali.io/documentation/runtimes-monitoring/#_create_new_dashboards).

It consists in a Go library and a TypeScript / React library.
The Go code:

- Provides a service that loads dashboards from Kubernetes resources and fill them up with timeseries data from Prometheus.
- Includes some helper to use as an HTTP endpoint handler to use with Gorilla / mux

The TypeScript code:

- Provides Dashboards as React components, with two available implementations: one using Patternfly 3 (ie. C3 charts), the other Patternfly 4 (ie. Victory charts).
- The data model used for these components is exactly what is returned from Go.

## Usage

### Go

This code must run in-cluster.

Using the provided HTTP handler:

```go
import (
  "github.com/gorilla/mux"
  "github.com/kiali/k-charted/config"
  khttp "github.com/kiali/k-charted/http"
  // ...
)

func SetRoute() {
  cfg := config.Config{
    GlobalNamespace:  "default",
    PrometheusURL:    "http://prometheus",
    AppLabelName:     "app",
    VersionLabelName: "version",
    Errorf:           log.Errorf,
  }
  r := mux.NewRouter()
  r.HandleFunc("/api/namespaces/{namespace}/apps/{app}/customdashboard/{template}", khttp.DashboardHandler(cfg))
}
```

Or calling the dashboards service:

```go
import (
  dashboards "github.com/kiali/k-charted/business"
  "github.com/kiali/k-charted/config"
  "github.com/kiali/k-charted/model"
)

// ...

  cfg := config.Config{
    GlobalNamespace:  "default",
    PrometheusURL:    "http://prometheus",
    AppLabelName:     "app",
    VersionLabelName: "version",
    Errorf:           log.Errorf,
  }

  dashboardsService := dashboards.NewDashboardsService(cfg)
  dashboard, err := dashboardsService.GetDashboard(model.DashboardQuery{Namespace: "my-namespace", App: "my-app"},
    "my-dashboard-name")
```

#### Config

- **GlobalNamespace**: namespace that holds default dashboards. When a dashboard is looked for in a given namespace, when not found and if GlobalNamespace is defined, it will be searched then in that GlobalNamespace. Undefined by default.

- **PrometheusURL**: URL where the Prometheus server can be reached.

- **AppLabelName**: name/key of the label that identifies applications (ex: "app", "app.kubernetes.io/name" ...). See also https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/ .

- **VersionLabelName**: name/key of the label that identifies application versions (ex: "version", "app.kubernetes.io/version" ...). See also https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/ .

- **Errorf**: handler to an error logging function

### React (Javascript / TypeScript)

(TODO)

## Build

### Initial setup

Go vendors are commited so you don't need to pull them first (unless you want to update them, in which case you can run `make godep`).

For a first run, init the JS dependencies:

```bash
make reactdep
```

Install [*golangci-lint*](https://github.com/golangci/golangci-lint), example with v1.16.0:

```bash
curl -sfL https://install.goreleaser.com/github.com/golangci/golangci-lint.sh | sh -s -- -b $(go env GOPATH)/bin v1.16.0
```

To build/lint/test everything:

```bash
make build lint test
```

You can also build/lint/test only the Go code, or only the React code:

```bash
make gobuild golint gotest
make reactbuild reactlint reacttest
```
