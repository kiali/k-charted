package http

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jotak/k-charted/business"
	"github.com/jotak/k-charted/config"
	"github.com/jotak/k-charted/model"
	"k8s.io/apimachinery/pkg/api/errors"
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
			respondWithError(w, http.StatusBadRequest, err.Error())
			return
		}

		dashboard, err := svc.GetDashboard(params, template)
		if err != nil {
			if errors.IsNotFound(err) {
				respondWithError(w, http.StatusNotFound, err.Error())
			} else {
				respondWithError(w, http.StatusInternalServerError, err.Error())
			}
			return
		}
		respondWithJSON(w, http.StatusOK, dashboard)
	}
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, err := json.Marshal(payload)
	if err != nil {
		response, _ = json.Marshal(map[string]string{"error": err.Error()})
		code = http.StatusInternalServerError
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}
