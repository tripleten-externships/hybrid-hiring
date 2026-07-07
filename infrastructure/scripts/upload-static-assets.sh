#!/usr/bin/env bash
set -euo pipefail

# Sync hero/background images from public/assets/images/ to the CDN S3 bucket.
#
# Usage:
#   BUCKET_NAME=hybrid-hiring-static-123456789 ./infrastructure/scripts/upload-static-assets.sh
#
# Optional:
#   DISTRIBUTION_ID=E1234567890   # invalidate CloudFront after upload
#   AWS_PROFILE=my-profile
#   AWS_REGION=us-east-1

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SOURCE_DIR="${SOURCE_DIR:-$ROOT_DIR/public/assets/images}"
DEST_PREFIX="${DEST_PREFIX:-assets/images}"
CACHE_CONTROL="${CACHE_CONTROL:-public, max-age=31536000, immutable}"

if [[ -z "${BUCKET_NAME:-}" ]]; then
  echo "Error: BUCKET_NAME is required." >&2
  echo "Get it from the CloudFormation output BucketName." >&2
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: source directory not found: $SOURCE_DIR" >&2
  exit 1
fi

echo "Uploading $SOURCE_DIR -> s3://$BUCKET_NAME/$DEST_PREFIX/"
aws s3 sync "$SOURCE_DIR" "s3://$BUCKET_NAME/$DEST_PREFIX/" \
  --cache-control "$CACHE_CONTROL" \
  --content-type "image/webp" \
  --exclude "*" \
  --include "*.webp" \
  --delete

echo "Upload complete."

if [[ -n "${DISTRIBUTION_ID:-}" ]]; then
  echo "Creating CloudFront invalidation for /$DEST_PREFIX/* ..."
  aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/$DEST_PREFIX/*"
  echo "Invalidation submitted."
fi
