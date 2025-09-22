# Azure Function Deployment Instructions

## Prerequisites
1. Azure CLI installed
2. Azure Functions Core Tools installed
3. Node.js 18+ installed

## Setup Steps

### 1. Install Dependencies
```bash
cd azure-function
npm install
```

### 2. Create Function App in Azure
```bash
# Login to Azure
az login

# Create resource group (if not exists)
az group create --name harambee-rg --location eastus

# Create storage account for function app (different from data storage)
az storage account create \
  --name harambeefunctions \
  --resource-group harambee-rg \
  --location eastus \
  --sku Standard_LRS

# Create function app
az functionapp create \
  --resource-group harambee-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name harambee-board-api \
  --storage-account harambeefunctions
```

### 3. Configure App Settings
```bash
# Set storage account settings for data storage
az functionapp config appsettings set \
  --name harambee-board-api \
  --resource-group harambee-rg \
  --settings STORAGE_ACCOUNT_NAME=harambeedata

# Set storage account key (get this from Azure portal)
az functionapp config appsettings set \
  --name harambee-board-api \
  --resource-group harambee-rg \
  --settings STORAGE_ACCOUNT_KEY="YOUR_STORAGE_ACCOUNT_KEY"

# Set container and blob names
az functionapp config appsettings set \
  --name harambee-board-api \
  --resource-group harambee-rg \
  --settings CONTAINER_NAME=board-data BLOB_NAME=board-data.json
```

### 4. Deploy Function
```bash
# Deploy to Azure
func azure functionapp publish harambee-board-api
```

### 5. Test the API
After deployment, your API will be available at:
```
https://harambee-board-api.azurewebsites.net/api/board-members
```

## API Endpoints

### GET /api/board-members
Get all board members
```
curl https://harambee-board-api.azurewebsites.net/api/board-members
```

### GET /api/board-members/{id}
Get specific board member
```
curl https://harambee-board-api.azurewebsites.net/api/board-members/1
```

### POST /api/board-members
Add new board member
```
curl -X POST https://harambee-board-api.azurewebsites.net/api/board-members \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "title": "Secretary"}'
```

### PUT /api/board-members/{id}
Update existing board member
```
curl -X PUT https://harambee-board-api.azurewebsites.net/api/board-members/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "John Smith", "title": "President"}'
```

### DELETE /api/board-members/{id}
Delete board member
```
curl -X DELETE https://harambee-board-api.azurewebsites.net/api/board-members/1
```

## Getting Storage Account Key

1. Go to Azure Portal
2. Navigate to your storage account (harambeedata)
3. Go to "Access keys" in the left menu
4. Copy "key1" value
5. Use this in the STORAGE_ACCOUNT_KEY setting

## Local Development

### 1. Create local.settings.json
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "STORAGE_ACCOUNT_NAME": "harambeedata",
    "STORAGE_ACCOUNT_KEY": "YOUR_STORAGE_ACCOUNT_KEY",
    "CONTAINER_NAME": "board-data",
    "BLOB_NAME": "board-data.json"
  }
}
```

### 2. Run locally
```bash
func start
```

Your function will be available at:
```
http://localhost:7071/api/board-members
```