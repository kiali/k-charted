package config

type Config struct {
	PrometheusURL   string `yaml:"prometheus_url,omitempty"`
	GlobalNamespace string `yaml:"global_namespace,omitempty"`
	Errorf          func(string, ...interface{})
}
