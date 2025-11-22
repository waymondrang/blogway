#!/bin/bash

# TODO: support --bucket-name which will override --bucket-key and lookup

usage="usage: upload_s3.sh --stack-name <stack name> --bucket-key <bucket output key> --source-dir <source directory> --remote-dir <remote bucket directory> [--clear-dir]"

stack_name=""
bucket_output_key=""
source_dir=""
remote_dir=""
clear_dir=false

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

while [[ $# -gt 0 ]]; do
	case $1 in
	--stack-name)
		stack_name="$2"
		shift 2
		# https://stackoverflow.com/a/16905786
		# ;; is used in case constructs to indicate the end of an alternative (like break)
		;;
	--bucket-key)
		bucket_output_key="$2"
		shift 2
		;;
	--source-dir)
		source_dir="$2"
		shift 2
		;;
	--remote-dir)
		remote_dir="$2"
		shift 2
		;;
	--bucket-dir)
		remote_dir="$2"
		shift 2
		;;
	--clear-dir)
		clear_dir=true
		shift 1
		;;
	-h | --help)
		echo "upload_s3.sh"
		echo ""
		echo "options:"
		echo "  --stack-name <name>      name of the cloudformation stack"
		echo "  --bucket-key <key>       output key for the s3 bucket in the stack"
		echo "  --source-dir <dir>       local source directory"
		echo "  --remote-dir <dir>       remote destination directory"
		echo "  --bucket-dir <dir>       alias for --remote-dir"
		echo "  --clear-dir              (optional) clear the bucket directory before uploading"
		echo "  -h, --help               help message"
		exit 0
		;;
	*)
		print_error "unknown option: $1"
		echo "$usage"
		exit 1
		;;
	esac
done

######################
# validate arguments #
######################

if [ -z "$stack_name" ]; then
	print_error "--stack-name is required"
	exit 1
fi

if [ -z "$bucket_output_key" ]; then
	print_error "--bucket-key is required"
	exit 1
fi

if [ -z "$source_dir" ]; then
	print_error "--source-dir is required"
	exit 1
fi

if [ -z "$remote_dir" ]; then
	print_error "--remote-dir is required"
	exit 1
fi

#####################
# fetch bucket name #
#####################

print_step "fetching bucket name from stack: $stack_name using output key: $bucket_output_key..."

s3_bucket_name=$(aws cloudformation describe-stacks --stack-name "$stack_name" --query "Stacks[0].Outputs[?OutputKey=='$bucket_output_key'].OutputValue" --output text)

if [ -z "$s3_bucket_name" ]; then
	print_error "s3 bucket name could not be found in cloudformation stack output"
	exit 1
fi

print_info "s3 bucket name found: $s3_bucket_name"

##########################
# clear bucket directory #
##########################

if [ "$clear_dir" = true ]; then
	print_step "clearing bucket directory: s3://${s3_bucket_name}/${remote_dir}..."

	aws s3 rm "s3://${s3_bucket_name}/${remote_dir}" \
		--recursive
	exit_code=$?

	if [ $exit_code -eq 0 ]; then
		print_success "bucket directory cleared successfully!"
	else
		print_warning "failed to clear bucket directory (exit code: $exit_code)"
	fi
fi

########
# sync #
########

print_step "syncing source dir: $source_dir into bucket directory: s3://${s3_bucket_name}/${remote_dir}..."

aws s3 sync "$source_dir" "s3://${s3_bucket_name}/${remote_dir}"
exit_code=$?

if [ $exit_code -ne 0 ]; then
	print_error "s3 upload failed with exit code: $exit_code"
	exit $exit_code
fi

print_success "s3 upload completed successfully!"
