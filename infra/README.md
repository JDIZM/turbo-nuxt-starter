# Infrastructure

Terraform configurations for deploying to Google Cloud Platform.

## Documentation

📚 **Complete deployment guides are available in the [Docus documentation site](../apps/docus/content/4.deployment/)**:

- [Authentication Setup](../apps/docus/content/4.deployment/0.authentication-setup.md) - Configure gcloud CLI and avoid common auth issues
- [GCP Cloud Run](../apps/docus/content/4.deployment/2.gcp-cloud-run.md) - Complete deployment guide with Terraform
- [GCP Testing Guide](../apps/docus/content/4.deployment/6.gcp-testing-guide.md) - Step-by-step testing with a fresh GCP project
- [CI/CD Configuration](../apps/docus/content/4.deployment/3.ci-cd.md) - GitHub Actions setup
- [Environment Variables](../apps/docus/content/4.deployment/4.environment-variables.md) - All configuration options
- [Troubleshooting](../apps/docus/content/4.deployment/5.troubleshooting.md) - Common issues and solutions

## Quick Start

```bash
# 1. Authenticate (CRITICAL: unset service account keys first)
unset GOOGLE_APPLICATION_CREDENTIALS
gcloud auth login
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID

# 2. Create state bucket (first time only)
gcloud storage buckets create gs://YOUR_PROJECT_ID-turbo-tfstate \
  --project=YOUR_PROJECT_ID \
  --location=YOUR_REGION \
  --uniform-bucket-level-access

# 3. Configure Terraform
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Update versions.tf with your bucket name:
# backend "gcs" {
#   bucket = "YOUR_PROJECT_ID-turbo-tfstate"
#   prefix = "turbo-nuxt-starter"
# }

# 4. Build and push Docker images FIRST (from repo root)
cd ../..
gcloud auth configure-docker ${REGION}-docker.pkg.dev

docker build -f apps/api/Dockerfile -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/api:latest .
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/api:latest

docker build -f apps/nuxt/Dockerfile -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/nuxt:latest .
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/nuxt:latest

docker build -f apps/docus/Dockerfile -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/docus:latest .
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/turbo-repo/docus:latest

# 5. Apply Terraform
cd infra/terraform
terraform init
terraform apply
```

## What Gets Created

- **Artifact Registry** - Container image repository
- **Cloud Run Services** - turbo-api, turbo-nuxt, turbo-docus (scale-to-zero enabled)
- **Secret Manager** - Secrets for database and Supabase credentials
- **Service Account** - Limited permissions for GitHub Actions deployments
- **Workload Identity Federation** - Keyless GitHub Actions authentication

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Artifact Registry → Cloud Run Services (api, nuxt, docus)  │
│  Secret Manager → Environment Variables                      │
│  Workload Identity Federation → GitHub Actions              │
└─────────────────────────────────────────────────────────────┘
```

## Cost Optimization

Default configuration scales to zero (`min_instances = 0`):
- **Idle cost**: ~$1/month (Artifact Registry storage only)
- **Active cost**: ~$12-50/month depending on traffic
- Pay only when services handle requests

## Destroying Infrastructure

```bash
terraform destroy
```

⚠️ This deletes all Cloud Run services and Secret Manager secrets.

## Need Help?

See the [complete documentation](../apps/docus/content/4.deployment/) for detailed guides and troubleshooting.
