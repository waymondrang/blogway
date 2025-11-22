#!/bin/bash

# exit immediately if a command exists with a non-zero status
# see more here: https://linuxcommand.org/lc3_man_pages/seth.html
set -e

# shellcheck disable=SC1091
source .env

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

# print_step "installing dependencies..."

# npm ci
# exit_code=$?

# if [ $exit_code -eq 0 ]; then
#     print_success "successfully installed dependencies"
# else
#     print_error "failed to install dependencies"
#     exit 1
# fi

print_step "building project..."

npm run build
exit_code=$?

if [ $exit_code -eq 0 ]; then
	print_success "successfully built project "
else
	print_error "failed to build project"
	exit 1
fi

print_step "uploading files to s3 bucket..."

../scripts/upload_s3.sh \
	--stack-name "$CLOUDFORMATION_STACK_NAME" \
	--bucket-key "$S3_BUCKET_KEY" \
	--source-dir "$S3_BUCKET_SOURCE_DIR" \
	--remote-dir "$S3_BUCKET_REMOTE_DIR"
exit_code=$?

if [ $exit_code -eq 0 ]; then
	print_success "successfully deployed project!"
else
	print_error "failed to deploy project"
	exit 1
fi
