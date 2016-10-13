# -------------------------------------------------------------
# GLOBALLY DEFINED CONSTANTS (Defined Once, on a Per-Project Basis)
# -------------------------------------------------------------

PROJECT-NAME = frontend-template
DOMAIN-NAME = headless.workshopdesignstudio.org
PROJECT-IP = 45.55.43.76

ROOT-DIRECTORY = ./
TEMPLATE-DIRECTORY=templates/
STATIC-DIRECTORY = static/
DYNAMIC-DIRECTORY = dynamic/
JAVASCRIPT-SOURCE-DIRECTORY = $(STATIC-DIRECTORY)javascript/
SCSS-SOURCE-DIRECTORY = $(STATIC-DIRECTORY)scss/
JAVASCRIPT-TARGET-DIRECTORY = $(STATIC-DIRECTORY)
SCSS-TARGET-DIRECTORY = $(STATIC-DIRECTORY)

JAVASCRIPT-SOURCE-MAIN = main.js
JAVASCRIPT-TARGET-MAIN = bundle.js
SCSS-SOURCE-MAIN = main.scss
SCSS-TARGET-MAIN = bundle.css

SERVER-MAIN = index.js

# ----------------------------------------------------------------------
# LOCALLY DEFINED RULE PARAMETERS (Defined on a Per-invocation Basis, with Sensible Defaults)
# ----------------------------------------------------------------------

branch=master
javascript-postcompilation-hook=cat
scss-postcompilation-hook=cat

# ----------------------------------------------------------------------
# RULE SET
# ----------------------------------------------------------------------

.PHONY: all clean

all: build-client-js build-client-scss

install-dependencies:
	brew install fswatch
	npm install -g browserify
	npm install -g livereload
	git remote add live root@$(PROJECT-IP):/var/www/$(PROJECT-NAME)/$(DOMAIN-NAME)/git

deploy-project:
	git push live +$(branch):refs/heads/master

build-client-js:
	browserify $(JAVASCRIPT-SOURCE-DIRECTORY)$(JAVASCRIPT-SOURCE-MAIN) | $(javascript-postcompilation-hook) > $(JAVASCRIPT-TARGET-DIRECTORY)$(JAVASCRIPT-TARGET-MAIN)

build-client-scss:
	sass --scss --quiet $(SCSS-SOURCE-DIRECTORY)$(SCSS-SOURCE-MAIN) | $(scss-postcompilation-hook) > $(SCSS-TARGET-DIRECTORY)$(SCSS-TARGET-MAIN)

watch-build:
	fswatch -r -0 $(JAVASCRIPT-SOURCE-DIRECTORY) | xargs -0 -n 1 make build-client-js 1>/dev/null &
	fswatch -r -0 $(SCSS-SOURCE-DIRECTORY) | xargs -0 -n 1 make build-client-scss 1>/dev/null &
	livereload . &

kill-watch:
	kill -9 $$(ps aux | grep -v grep | grep "fswatch" | awk '{print $$2}')
	kill -9 $$(ps aux | grep -v grep | grep "node /usr/local/bin/livereload" | awk '{print $$2}')

run-server:
	pm2 start local-process.json --node-args "--development"

kill-server:
	pm2 stop local-process.json
	pm2 delete local-process.json
