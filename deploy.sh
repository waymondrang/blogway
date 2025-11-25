#!/bin/bash

# exit immediately if a command exists with a non-zero status
# see more here: https://linuxcommand.org/lc3_man_pages/seth.html
set -e

print_red() { echo -e "\033[31m${1:-$(cat)}\033[0m"; }
print_green() { echo -e "\033[32m${1:-$(cat)}\033[0m"; }
print_yellow() { echo -e "\033[33m${1:-$(cat)}\033[0m"; }
print_blue() { echo -e "\033[34m${1:-$(cat)}\033[0m"; }
print_magenta() { echo -e "\033[35m${1:-$(cat)}\033[0m"; }
print_cyan() { echo -e "\033[36m${1:-$(cat)}\033[0m"; }
print_white() { echo -e "\033[37m${1:-$(cat)}\033[0m"; }
print_bold() { echo -e "\033[1m${1:-$(cat)}\033[0m"; }
print_dim() { echo -e "\033[2m${1:-$(cat)}\033[0m"; }

print_success() { print_green "[ok] ${1:-$(cat)}"; }
print_error() { print_red "[error] ${1:-$(cat)}"; }
print_warning() { print_yellow "[warn] ${1:-$(cat)}"; }
print_info() { print_blue "[info] ${1:-$(cat)}"; }
print_step() { print_cyan "> ${1:-$(cat)}"; }

# store the original directory
ORIGINAL_DIR=$(pwd)

##############
# serverless #
##############

print_step "deploying serverless infrastructure..."

cd "${ORIGINAL_DIR}/src/serverless" && ./deploy.sh
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to deploy serverless infrastructure"
	exit $exit_status
fi

print_success "serverless infrastructure successfully deployed"

##############
# admin page #
##############

print_step "deploying admin page..."

cd "${ORIGINAL_DIR}/src/admin" && ./deploy.sh
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to deploy admin page"
	exit $exit_status
fi

print_success "admin page successfully deployed"

########
# done #
########

print_success "deployment completed successfully!"
