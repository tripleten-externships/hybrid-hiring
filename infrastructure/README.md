# Static image CDN (S3 + CloudFront)

Galaxy forces `Cache-Control: no-store` on app-served files, so hero images in `public/` are re-downloaded every visit. This stack hosts those images on **S3 behind CloudFront** with proper cache headers.

## What gets created

| Resource                | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| S3 bucket               | Private storage for `public/assets/images/*.webp`     |
| CloudFront OAC          | Lets CloudFront read the bucket (no public S3 access) |
| CloudFront distribution | CDN with long-lived caching                           |

## Prerequisites

1. **AWS CLI** installed and logged in:
   ```bash
   aws sts get-caller-identity
   ```
2. **Region:** deploy in **`us-east-1`** if you want a custom domain (`cdn.hybridhiringsolutions.com`).
3. **Optional custom domain:** request an ACM certificate in **us-east-1** for `cdn.hybridhiringsolutions.com`, validate via GoDaddy DNS, then use its ARN in parameters.

## Quick start (CloudFront default domain only)

No custom domain — fastest way to test:

```bash
chmod +x infrastructure/scripts/*.sh

./infrastructure/scripts/deploy-static-cdn.sh
```

Note the outputs:

- `BucketName`
- `DistributionDomainName` (e.g. `d1111abcdef8.cloudfront.net`)
- `StaticCdnUrl`

Upload images:

```bash
BUCKET_NAME=hybrid-hiring-static-123456789012 \
  ./infrastructure/scripts/upload-static-assets.sh
```

Test:

```bash
curl -sI "https://d1111abcdef8.cloudfront.net/assets/images/hh_home_header.webp" | grep -i cache-control
```

You should see `max-age=31536000`, not `no-store`.

## Custom domain (`cdn.hybridhiringsolutions.com`)

### 1. Request ACM certificate (us-east-1)

AWS Console → **Certificate Manager** → **us-east-1** → Request certificate → `cdn.hybridhiringsolutions.com` → DNS validation.

Add the validation CNAME records in GoDaddy. Wait until status is **Issued**.

### 2. Copy and edit parameters

```bash
cp infrastructure/cloudformation/parameters.example.json \
   infrastructure/cloudformation/parameters.prod.json
```

Edit `parameters.prod.json` with your ACM ARN.

> `parameters.prod.json` is gitignored — do not commit account-specific ARNs.

### 3. Deploy stack

```bash
AWS_REGION=us-east-1 ./infrastructure/scripts/deploy-static-cdn.sh \
  infrastructure/cloudformation/parameters.prod.json
```

### 4. DNS in GoDaddy

Add a **CNAME** from the stack output `DnsRecordInstructions`:

```
cdn.hybridhiringsolutions.com  →  dxxxx.cloudfront.net
```

### 5. Upload images

```bash
BUCKET_NAME=<from stack output> \
DISTRIBUTION_ID=<from stack output> \
  ./infrastructure/scripts/upload-static-assets.sh
```

## Wire the app to the CDN

After deploy, point the app at CloudFront. **The live site will keep using `/assets/images/…` until one of these is set and the app is redeployed.**

### Option A — `STATIC_CDN_URL` env var (simplest on Galaxy)

Galaxy → your app → **Variables** → under `galaxy.meteor.com` → **env**, add:

```
STATIC_CDN_URL=https://dkwb5rw1kvqhs.cloudfront.net
```

No trailing slash. Redeploy the app.

The server merges this into `Meteor.settings.public.staticCdnUrl` for the client.

### Option B — Galaxy Settings JSON (`public` key)

In Galaxy **Variables** → **Settings** (Galaxy Mode), ensure the JSON includes:

```json
{
  "public": {
    "staticCdnUrl": "https://dkwb5rw1kvqhs.cloudfront.net"
  }
}
```

See `settings.cdn.example.json` in the repo root. Redeploy.

> Do **not** put `staticCdnUrl` only in a private/server section — the client must receive it under `public`.

### Verify it worked

```bash
curl -s https://www.hybridhiringsolutions.com/ | grep -o 'PUBLIC_SETTINGS[^%]*'
```

You should see `staticCdnUrl` in `PUBLIC_SETTINGS`, not `{}`.

Or in the browser Network tab, hero images should load from `*.cloudfront.net`, not `www.hybridhiringsolutions.com/assets/images/…`.

Local dev omits `staticCdnUrl` and keeps serving from `/assets/images/…`.

## Updating images

1. Replace files in `public/assets/images/`
2. Re-run `upload-static-assets.sh` with `DISTRIBUTION_ID` set (creates a CloudFront invalidation)
3. Or use a new filename / `?v=2` query in `backgroundImages.ts` to bust cache without invalidation

## Tear down

```bash
aws cloudformation delete-stack \
  --stack-name hybrid-hiring-static-cdn \
  --region us-east-1
```

Empty the S3 bucket first if `delete-stack` fails on a non-empty bucket.

## Files

| File                                     | Role                               |
| ---------------------------------------- | ---------------------------------- |
| `cloudformation/static-cdn.yaml`         | CloudFormation template            |
| `cloudformation/parameters.example.json` | Example parameters (custom domain) |
| `scripts/deploy-static-cdn.sh`           | Deploy / update stack              |
| `scripts/upload-static-assets.sh`        | Sync local WebP assets to S3       |
