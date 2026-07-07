#!/usr/bin/env bash
set -euo pipefail

# Deploy (or update) the static CDN CloudFormation stack.
#
# Usage:
#   ./infrastructure/scripts/deploy-static-cdn.sh
#
# With custom domain + ACM cert:
#   ./infrastructure/scripts/deploy-static-cdn.sh infrastructure/cloudformation/parameters.prod.json
#
# Prerequisites:
#   - AWS CLI configured (aws sts get-caller-identity)
#   - Stack must be deployed in us-east-1 if using ACM for CloudFront custom domains

STACK_NAME="${STACK_NAME:-hybrid-hiring-static-cdn}"
TEMPLATE_FILE="$(cd "$(dirname "$0")/.." && pwd)/cloudformation/static-cdn.yaml"
PARAMS_FILE="${1:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"

if [[ -n "$PARAMS_FILE" && ! -f "$PARAMS_FILE" ]]; then
  echo "Error: parameters file not found: $PARAMS_FILE" >&2
  exit 1
fi

echo "Deploying stack: $STACK_NAME (region: $AWS_REGION)"

DEPLOY_ARGS=(
  --stack-name "$STACK_NAME"
  --template-file "$TEMPLATE_FILE"
  --region "$AWS_REGION"
  --no-fail-on-empty-changeset
)

if [[ -n "$PARAMS_FILE" ]]; then
  PARAM_OVERRIDES="$(node -e "
    const params = require('${PARAMS_FILE}');
    if (!Array.isArray(params)) process.exit(1);
    process.stdout.write(
      params.map((p) => 'ParameterKey=' + p.ParameterKey + ',ParameterValue=' + p.ParameterValue).join(' ')
    );
  ")"
  DEPLOY_ARGS+=(--parameter-overrides $PARAM_OVERRIDES)
else
  DEPLOY_ARGS+=(--parameter-overrides ProjectName=hybrid-hiring)
fi

aws cloudformation deploy "${DEPLOY_ARGS[@]}"

echo ""
echo "Stack outputs:"
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
  --output table

echo ""
echo "Next: upload images with the UploadCommand output above."
