package http

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"k8s.io/apimachinery/pkg/api/errors"

	"github.com/kiali/k-charted/business"
	"github.com/kiali/k-charted/config"
	"github.com/kiali/k-charted/model"
)

// DashboardHandler is the API handler to fetch runtime metrics to be displayed, related to a single app
func DashboardHandler(conf config.Config) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		namespace := vars["namespace"]
		app := vars["app"]
		template := vars["template"]

		svc := business.NewDashboardsService(conf)

		params := model.DashboardQuery{Namespace: namespace, App: app}
		err := ExtractDashboardQueryParams(r, &params)
		if err != nil {
			respondWithError(conf, w, http.StatusBadRequest, err.Error())
			return
		}

		dashboard, err := svc.GetDashboard(params, template)
		if err != nil {
			if errors.IsNotFound(err) {
				respondWithError(conf, w, http.StatusNotFound, err.Error())
			} else {
				respondWithError(conf, w, http.StatusInternalServerError, err.Error())
			}
			return
		}
		respondWithJSON(conf, w, http.StatusOK, dashboard)
	}
}

func respondWithJSON(conf config.Config, w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		response, _ = json.Marshal(map[string]string{"error": err.Error()})
		code = http.StatusInternalServerError
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_, err = w.Write(response)
	if err != nil {
		conf.Errorf("could not write response: %v", err)
	}
}

func respondWithError(conf config.Config, w http.ResponseWriter, code int, message string) {
	respondWithJSON(conf, w, code, map[string]string{"error": message})
}
