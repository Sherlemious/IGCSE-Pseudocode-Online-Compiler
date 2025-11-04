# Deployment Guide: GCP Cloud Run CI/CD

This guide will help you deploy the IGCSE Pseudocode Online Compiler to Google Cloud Platform (GCP) Cloud Run with automated CI/CD using GitHub Actions.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [GCP Setup](#gcp-setup)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Domain Configuration](#domain-configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have:

1. A Google Cloud Platform (GCP) account
2. A GitHub repository with this codebase
3. `gcloud` CLI installed locally (for initial setup)
4. Basic knowledge of Docker and cloud deployments

## 🌐 GCP Setup

### 1. Create a GCP Project

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Create the project
gcloud projects create $PROJECT_ID --name="IGCSE Pseudocode Compiler"

# Set the project as default
gcloud config set project $PROJECT_ID
```

### 2. Enable Required APIs

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry API
gcloud services enable containerregistry.googleapis.com

# Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com

# Enable Cloud Build API (optional, for faster builds)
gcloud services enable cloudbuild.googleapis.com
```

### 3. Create Artifact Registry Repository

```bash
# Create a Docker repository in Artifact Registry
gcloud artifacts repositories create cloud-run-images \
  --repository-format=docker \
  --location=us-central1 \
  --description="Docker images for IGCSE Pseudocode Compiler"
```

### 4. Create Service Account for GitHub Actions

```bash
# Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer"

# Get service account email
export SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# Create and download service account key
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=$SA_EMAIL
```

⚠️ **Important**: Keep the `github-actions-key.json` file secure! You'll need it for GitHub Secrets.

### 5. Generate Django Secret Key

```bash
# Generate a secure Django secret key
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Save this key for the GitHub Secrets configuration.

## 🔐 GitHub Secrets Configuration

Navigate to your GitHub repository settings: **Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `GCP_PROJECT_ID` | Your GCP Project ID | `igcse-pseudocode-123456` |
| `GCP_REGION` | GCP region for deployment | `us-central1` |
| `GCP_SA_KEY` | Service account JSON key (entire file contents) | `{"type": "service_account", ...}` |
| `DJANGO_SECRET_KEY` | Django secret key (generated above) | `django-insecure-xyz...` |
| `BACKEND_DOMAIN` | (Optional) Custom domain for backend | `api.yourcompiler.com` |
| `FRONTEND_DOMAIN` | (Optional) Custom domain for frontend | `yourcompiler.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://yourcompiler.com` |

### Setting Secrets via GitHub CLI

If you have GitHub CLI installed:

```bash
# Set GCP Project ID
gh secret set GCP_PROJECT_ID --body "your-project-id"

# Set GCP Region
gh secret set GCP_REGION --body "us-central1"

# Set GCP Service Account Key (from JSON file)
gh secret set GCP_SA_KEY < github-actions-key.json

# Set Django Secret Key
gh secret set DJANGO_SECRET_KEY --body "your-generated-secret-key"

# Set Frontend URL for CORS
gh secret set FRONTEND_URL --body "https://your-frontend-domain.com"
```

## 🌍 Domain Configuration

### Option 1: Using Cloud Run Default Domains

When deployed, Cloud Run automatically provides URLs like:
- Backend: `https://igcse-pseudocode-backend-xxxxx-uc.a.run.app`
- Frontend: `https://igcse-pseudocode-frontend-xxxxx-uc.a.run.app`

No additional configuration needed!

### Option 2: Using Custom Domains

#### Step 1: Verify Domain Ownership

```bash
# Verify your domain with Google
gcloud domains verify yourdomain.com
```

Follow the instructions to add a TXT record to your domain's DNS.

#### Step 2: Map Domain to Cloud Run Service

The GitHub Actions workflow will automatically attempt to map domains if you've set the `BACKEND_DOMAIN` and `FRONTEND_DOMAIN` secrets.

Alternatively, map manually:

```bash
# Map backend domain
gcloud run domain-mappings create \
  --service igcse-pseudocode-backend \
  --domain api.yourdomain.com \
  --region us-central1

# Map frontend domain
gcloud run domain-mappings create \
  --service igcse-pseudocode-frontend \
  --domain yourdomain.com \
  --region us-central1
```

#### Step 3: Update DNS Records

Get the DNS records needed:

```bash
gcloud run domain-mappings describe \
  --domain yourdomain.com \
  --region us-central1
```

Add the provided CNAME or A records to your DNS provider.

## 🚀 Deployment

### Automatic Deployment (CI/CD)

Once everything is configured, deployments happen automatically:

1. **Push to main branch**: Triggers automatic deployment
   ```bash
   git push origin main
   ```

2. **Manual deployment**: Use GitHub Actions workflow dispatch
   - Go to **Actions** tab in GitHub
   - Select "Deploy to GCP Cloud Run" workflow
   - Click "Run workflow"

### First Time Deployment

After setting up all secrets and pushing to `main`:

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Watch the deployment workflow run
4. Once complete, you'll see the deployed URLs in the workflow logs

### Manual Deployment (Local)

If you need to deploy manually from your local machine:

#### Backend:

```bash
cd backend

# Build image
docker build -t gcr.io/$PROJECT_ID/igcse-pseudocode-backend .

# Push to GCR
docker push gcr.io/$PROJECT_ID/igcse-pseudocode-backend

# Deploy to Cloud Run
gcloud run deploy igcse-pseudocode-backend \
  --image gcr.io/$PROJECT_ID/igcse-pseudocode-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DEBUG=False,DJANGO_SECRET_KEY=your-secret-key"
```

#### Frontend:

```bash
cd frontend

# Create .env.production with backend URL
echo "VITE_API_BASE_URL=https://your-backend-url" > .env.production

# Build image
docker build -t gcr.io/$PROJECT_ID/igcse-pseudocode-frontend .

# Push to GCR
docker push gcr.io/$PROJECT_ID/igcse-pseudocode-frontend

# Deploy to Cloud Run
gcloud run deploy igcse-pseudocode-frontend \
  --image gcr.io/$PROJECT_ID/igcse-pseudocode-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔍 Monitoring and Logs

### View Logs

```bash
# Backend logs
gcloud run services logs read igcse-pseudocode-backend --region us-central1

# Frontend logs
gcloud run services logs read igcse-pseudocode-frontend --region us-central1

# Follow logs in real-time
gcloud run services logs tail igcse-pseudocode-backend --region us-central1
```

### View Service Details

```bash
# Backend service info
gcloud run services describe igcse-pseudocode-backend --region us-central1

# Frontend service info
gcloud run services describe igcse-pseudocode-frontend --region us-central1
```

### Access GCP Console

1. Go to [GCP Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Run** section
3. View deployed services, metrics, and logs

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Fails: "Permission Denied"

**Solution**: Ensure the service account has all required permissions:
```bash
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-deployer@*"
```

#### 2. Deployment Fails: "Domain Mapping Failed"

**Solution**:
- Verify domain ownership first
- Check DNS records are correctly configured
- Wait a few minutes for DNS propagation

#### 3. Backend Returns 500 Error

**Solution**: Check environment variables are set correctly:
```bash
gcloud run services describe igcse-pseudocode-backend \
  --region us-central1 \
  --format="value(spec.template.spec.containers[0].env)"
```

#### 4. Frontend Can't Connect to Backend (CORS Error)

**Solution**:
- Verify `CORS_ALLOWED_ORIGINS` is set in backend
- Check frontend URL is included in the CORS whitelist
- Update the backend environment variable:
  ```bash
  gcloud run services update igcse-pseudocode-backend \
    --region us-central1 \
    --set-env-vars "CORS_ALLOWED_ORIGINS=https://your-frontend-url.com"
  ```

#### 5. Workflow Fails: "Invalid Credentials"

**Solution**:
- Verify `GCP_SA_KEY` secret contains the complete JSON
- Regenerate service account key if needed
- Check service account has not been deleted

### Viewing Detailed Logs

For more detailed debugging:

```bash
# Get recent logs with severity level
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=igcse-pseudocode-backend" \
  --limit 50 \
  --format json
```

## 📊 Cost Optimization

Cloud Run offers generous free tier:
- 2 million requests per month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds of compute time

To minimize costs:

1. **Use min-instances=0**: Scales to zero when not in use (default in workflow)
2. **Right-size resources**: Adjust memory/CPU based on actual usage
3. **Set up budget alerts**: Get notified before costs escalate

```bash
# Update service to optimize costs
gcloud run services update igcse-pseudocode-backend \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 5 \
  --memory 256Mi
```

## 🔄 Rolling Back

If a deployment fails, roll back to previous revision:

```bash
# List revisions
gcloud run revisions list --service igcse-pseudocode-backend --region us-central1

# Roll back to specific revision
gcloud run services update-traffic igcse-pseudocode-backend \
  --to-revisions REVISION_NAME=100 \
  --region us-central1
```

## 🔒 Security Best Practices

1. **Never commit secrets**: Use environment variables and GitHub Secrets
2. **Rotate keys regularly**: Generate new service account keys periodically
3. **Enable VPC**: Consider VPC Service Controls for additional security
4. **Use Secret Manager**: For sensitive data like database credentials
5. **Set up Cloud Armor**: For DDoS protection and WAF rules

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 🆘 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review GitHub Actions workflow logs
3. Check Cloud Run logs in GCP Console
4. Open an issue on GitHub with deployment logs

---

**Happy Deploying! 🚀**
