#!/bin/bash

# IGCSE Pseudocode Compiler - GCP Setup Script
# This script automates the initial GCP setup for Cloud Run deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}IGCSE Pseudocode Compiler - GCP Setup${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed.${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Prompt for project ID
read -p "Enter your GCP Project ID (or press Enter to create a new one): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    read -p "Enter a name for your new project: " PROJECT_NAME
    PROJECT_ID=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')-$(date +%s)
    echo -e "${YELLOW}Creating project: $PROJECT_ID${NC}"
    gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME"
fi

# Set project
echo -e "\n${YELLOW}Setting project to: $PROJECT_ID${NC}"
gcloud config set project "$PROJECT_ID"

# Prompt for region
echo -e "\n${YELLOW}Available regions (some popular options):${NC}"
echo "  us-central1 (Iowa)"
echo "  us-east1 (South Carolina)"
echo "  us-west1 (Oregon)"
echo "  europe-west1 (Belgium)"
echo "  asia-northeast1 (Tokyo)"
read -p "Enter your preferred region [us-central1]: " REGION
REGION=${REGION:-us-central1}

echo -e "\n${YELLOW}Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

echo -e "\n${YELLOW}Creating Artifact Registry repository...${NC}"
gcloud artifacts repositories create cloud-run-images \
  --repository-format=docker \
  --location="$REGION" \
  --description="Docker images for IGCSE Pseudocode Compiler" || echo "Repository may already exist"

echo -e "\n${YELLOW}Creating service account for GitHub Actions...${NC}"
SA_NAME="github-actions-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create "$SA_NAME" \
  --display-name="GitHub Actions Deployer" || echo "Service account may already exist"

echo -e "\n${YELLOW}Granting permissions to service account...${NC}"
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" --quiet

echo -e "\n${YELLOW}Creating service account key...${NC}"
KEY_FILE="github-actions-key.json"
gcloud iam service-accounts keys create "$KEY_FILE" \
  --iam-account="$SA_EMAIL"

echo -e "\n${YELLOW}Generating Django secret key...${NC}"
DJANGO_SECRET=$(python3 -c 'from secrets import token_urlsafe; print(token_urlsafe(50))')

# Create setup summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}\n"
echo "1. Add these GitHub Secrets to your repository:"
echo "   (Settings → Secrets and variables → Actions → New repository secret)"
echo ""
echo -e "   ${GREEN}GCP_PROJECT_ID${NC}"
echo "   Value: $PROJECT_ID"
echo ""
echo -e "   ${GREEN}GCP_REGION${NC}"
echo "   Value: $REGION"
echo ""
echo -e "   ${GREEN}GCP_SA_KEY${NC}"
echo "   Value: <paste entire contents of $KEY_FILE>"
echo ""
echo -e "   ${GREEN}DJANGO_SECRET_KEY${NC}"
echo "   Value: $DJANGO_SECRET"
echo ""
echo -e "   ${GREEN}FRONTEND_URL${NC}"
echo "   Value: https://your-frontend-domain.com (or leave empty for now)"
echo ""
echo -e "   ${GREEN}BACKEND_DOMAIN${NC} (optional)"
echo "   Value: api.yourdomain.com"
echo ""
echo -e "   ${GREEN}FRONTEND_DOMAIN${NC} (optional)"
echo "   Value: yourdomain.com"
echo ""
echo "2. Service account key has been saved to: ${GREEN}$KEY_FILE${NC}"
echo "   ${RED}⚠️  Keep this file secure and never commit it to Git!${NC}"
echo ""
echo "3. After adding secrets, push to main branch to trigger deployment:"
echo "   ${GREEN}git push origin main${NC}"
echo ""
echo "4. Monitor deployment at:"
echo "   ${GREEN}https://github.com/YOUR_USERNAME/YOUR_REPO/actions${NC}"
echo ""

# Optionally set up GitHub secrets via CLI
read -p "Do you have GitHub CLI installed and want to set secrets now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${YELLOW}Setting GitHub secrets...${NC}"

    gh secret set GCP_PROJECT_ID --body "$PROJECT_ID"
    gh secret set GCP_REGION --body "$REGION"
    gh secret set GCP_SA_KEY < "$KEY_FILE"
    gh secret set DJANGO_SECRET_KEY --body "$DJANGO_SECRET"

    echo -e "${GREEN}Secrets set successfully!${NC}"
    echo -e "${YELLOW}Remember to set FRONTEND_URL, BACKEND_DOMAIN, and FRONTEND_DOMAIN manually if needed.${NC}"
fi

echo -e "\n${GREEN}Setup script completed!${NC}"
echo -e "For more information, see ${YELLOW}DEPLOYMENT.md${NC}\n"
