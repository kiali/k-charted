package config

import (
	"github.com/kiali/k-charted/config/extconfig"
	"github.com/kiali/k-charted/model"
)

type Config struct {
	Prometheus      extconfig.PrometheusConfig `yaml:"prometheus"`
	Grafana         extconfig.GrafanaConfig    `yaml:"grafana"`
	GlobalNamespace string                     `yaml:"global_namespace"`
	NamespaceLabel  string                     `yaml:"namespace_label"`
	PodsLoader      func(string, string) ([]model.Pod, error)
}
