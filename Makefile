SHELL=/bin/bash

dep: godep reactdep

godep:
	glide up

reactdep:
	cd web/react && yarn

build: gobuild reactbuild

gobuild:
	go build

reactbuild:
	cd web/react && yarn build

test: gotest

gotest:
	go test ./...

lint: golint

golint:
	gometalinter --disable-all --enable=vet --enable=vetshadow --enable=varcheck --enable=structcheck \
	--enable=ineffassign --enable=unconvert --enable=goimports -enable=gosimple --enable=staticcheck \
	--enable=nakedret --tests  --vendor ./...

gometalinter-install:
	go get -u github.com/alecthomas/gometalinter
	gometalinter --install
