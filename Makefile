SHELL=/bin/bash
GO?=go

.PHONY: go gobuild gotest golint
.PHONY: pf4 pf4build pf4test pf4lint
.PHONY: storybook

gobuild:
	${GO} build

pf4build:
	cd web/pf4 && yarn && yarn build

gotest:
	${GO} test ./...

pf4test:
	cd web/pf4 && yarn test

golint:
	golangci-lint run

pf4lint:
	cd web/pf4 && yarn lint

go: gobuild golint gotest
pf4: pf4build pf4lint pf4test

storybook:
	cd web/pf4 && yarn storybook
