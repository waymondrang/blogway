#!/bin/bash

# exit immediately if a command exists with a non-zero status
# see more here: https://linuxcommand.org/lc3_man_pages/seth.html
set -e

template_file=template.yaml

# shellcheck disable=SC1091
source .env

bucket_source_dir="./static"
bucket_remote_dir="static"

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

# print_info "running npm ci in root directory"

# npm ci
# exit_status=$?

# if [ $exit_status -ne 0 ]; then
#     print_error "failed to install dependencies in root directory"
#     exit $exit_status
# fi

# print_success "dependencies installed successfully in root directory"

#################
# npm run build #
#################

print_step "building project with npm run build..."

npm run build

exit_status=$?
if [ $exit_status -ne 0 ]; then
	print_error "failed to build project with npm run build"
	exit $exit_status
fi

print_success "project built successfully with npm run build"

# print_step "packaging and uploading to s3 using cloudformation package..."
# aws cloudformation package \
#     --template-file $original_template_file \
#     --s3-bucket $s3_deployment_name \
#     --output-template-file $output_template_file

#############
# sam build #
#############

print_step "building project with sam build..."

sam build \
	--template-file $template_file \
	--use-container
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to build project with sam build"
	exit $exit_status
fi

print_success "project built successfully with sam build"

################
# sam validate #
################

print_step "validating template file using sam validate..."

sam validate
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to validate template with sam validate"
	exit $exit_status
fi

print_success "template validated successfully with sam validate"

##############
# sam deploy #
##############

print_step "deploying stack using sam deploy..."

# build parameter overrides from .env
PARAMETER_OVERRIDES=""
PARAMETER_OVERRIDES+="CustomDomainAcmCertificateArn=$CERTIFICATE_ARN"
# add any other parameters here (remember to add spaces)

sam deploy \
	--no-confirm-changeset \
	--no-fail-on-empty-changeset \
	--parameter-overrides "$PARAMETER_OVERRIDES"
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to deploy stack with sam deploy"
	exit $exit_status
fi

print_success "stack deployed successfully with sam deploy"

################
# upload_s3.sh #
################

print_step "uploading static files using upload_s3.sh..."

../scripts/upload_s3.sh \
	--stack-name "$CLOUDFORMATION_STACK_NAME" \
	--bucket-key "$S3_BUCKET_KEY" \
	--source-dir "$S3_BUCKET_SOURCE_DIR" \
	--remote-dir "$S3_BUCKET_REMOTE_DIR"
exit_status=$?

if [ $exit_status -ne 0 ]; then
	print_error "failed to upload static files with upload_s3.sh"
	exit $exit_status
fi

print_success "static files uploaded successfully with upload_s3.sh"

########
# done #
########

print_success "deployment completed successfully!"
