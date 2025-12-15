# Infrastructure

This directory contains Terraform configurations for deploying the turbo-nuxt-starter monorepo to Google Cloud Platform.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Artifact Registry          Cloud Run Services              │
│  ┌──────────────┐          ┌─────────────────────────────┐ │
│  │ turbo-repo   │          │                             │ │
│  │ ├─ api      ─┼──────────┼─► turbo-api    (Port 3002)  │ │
│  │ ├─ nuxt     ─┼──────────┼─► turbo-nuxt   (Port 3001)  │ │
│  │ └─ docus    ─┼──────────┼─► turbo-docus  (Port 80)    │ │
│  └──────────────┘          └─────────────────────────────┘ │
│                                                              │
│  Secret Manager             IAM                              │
│  ┌──────────────┐          ┌─────────────────────────────┐ │
│  │ database-url │          │ github-actions-deploy (SA)  │ │
│  │ supabase-url │          │ ├─ roles/run.developer      │ │
│  │ supabase-*   │          │ ├─ roles/artifactregistry   │ │
│  └──────────────┘          │ └─ roles/secretmanager      │ │
│                             └─────────────────────────────┘ │
│                                                              │
│  Workload Identity                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ github-actions-pool/github-provider                   │  │
│  │ └─ Allows GitHub Actions to authenticate without keys │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and authenticated
3. **Terraform** >= 1.5.0 installed

## Quick Start

### 1. Initial Setup

```bash
# Authenticate with GCP
gcloud auth login
gcloud auth application-default login

# Set your project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Configure Terraform

```bash
cd infra/terraform

# Copy the example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit with your values
# Required: project_id
# Optional: region, service names, resource limits, secrets
```

### 3. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply changes
terraform apply
```

### 4. Push Initial Images

After Terraform creates the infrastructure, push your first images:

```bash
# From the repository root
cd ../..

# Configure Docker for GCP
gcloud auth configure-docker europe-west1-docker.pkg.dev

# Build and push images
docker build -f apps/api/Dockerfile -t europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/api:latest .
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/api:latest

docker build -f apps/nuxt/Dockerfile -t europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/nuxt:latest .
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/nuxt:latest

docker build -f apps/docus/Dockerfile -t europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/docus:latest .
docker push europe-west1-docker.pkg.dev/YOUR_PROJECT/turbo-repo/docus:latest
```

## GitHub Actions Integration

The Terraform configuration sets up Workload Identity Federation for secure, keyless authentication from GitHub Actions.

### Required GitHub Secrets

After running `terraform apply`, add these secrets to your GitHub repository:

| Secret                           | Value                 | Source                                            |
| -------------------------------- | --------------------- | ------------------------------------------------- |
| `GCP_PROJECT_ID`                 | Your GCP project ID   | Your configuration                                |
| `GCP_REGION`                     | e.g., `europe-west1`  | Your configuration                                |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Full provider path    | `terraform output workload_identity_provider`     |
| `GCP_SERVICE_ACCOUNT`            | Service account email | `terraform output github_actions_service_account` |

### Workload Identity Setup

The GitHub Actions service account has **minimal permissions**:

- `roles/run.developer` - Deploy to Cloud Run (no delete/create)
- `roles/artifactregistry.writer` - Push container images
- `roles/secretmanager.secretAccessor` - Read secrets for deployment

This ensures CI/CD can only deploy, not modify infrastructure.

## Managing Secrets

Secrets are stored in Google Secret Manager. You can set them via:

### Option 1: Terraform Variables

```hcl
# In terraform.tfvars (gitignored)
database_url        = "postgresql://user:pass@host:5432/db"
supabase_url        = "https://project.supabase.co"
supabase_anon_key   = "your-key"
supabase_jwt_secret = "your-secret"
```

### Option 2: GCP Console

1. Go to Secret Manager in GCP Console
2. Find each secret (database-url, supabase-url, etc.)
3. Add a new version with your value

### Option 3: gcloud CLI

```bash
echo -n "your-secret-value" | gcloud secrets versions add database-url --data-file=-
```

## Custom Domains

To use custom domains:

1. Set the domain variables in `terraform.tfvars`:

   ```hcl
   api_domain  = "api.example.com"
   nuxt_domain = "app.example.com"
   ```

2. After `terraform apply`, configure your DNS to point to the Cloud Run URLs

3. Cloud Run will automatically provision SSL certificates

## Cost Optimization

Default configuration is optimized for cost:

- **Scale to zero**: `min_instances = 0` means no charges when idle
- **Reasonable limits**: 1 CPU, 512Mi memory per service
- **Auto-scaling**: Services scale based on traffic

For production with SLA requirements:

```hcl
min_instances = 1  # Always-on for lower latency
max_instances = 20 # Handle traffic spikes
```

## Outputs

After `terraform apply`, useful outputs include:

```bash
# Get all outputs
terraform output

# Specific values
terraform output api_service_url
terraform output nuxt_service_url
terraform output docus_service_url
```

## Destroying Infrastructure

To tear down all resources:

```bash
terraform destroy
```

⚠️ This will delete all Cloud Run services and data in Secret Manager.
