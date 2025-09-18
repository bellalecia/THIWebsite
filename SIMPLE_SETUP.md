# Board Member Management - Quick Setup

Update your website's board list via Microsoft Form in 4 simple steps.

**Flow:** Form → Power Automate → Azure Blob Storage → Website

---

## 1. Azure Storage Account

- Go to: `https://portal.azure.com`
- Create "Storage Account" → Enable **"Allow Blob public access"**
- Create container: **"board-data"** (Public access level)
- Create `board-data.json` with your current board:

```json
[
  {"id": 1, "name": "John Smith", "title": "President"},
  {"id": 2, "name": "Jane Doe", "title": "Vice President"}
]
```

- Upload file → Copy **public URL** (e.g., `https://yourstorage.blob.core.windows.net/board-data/board-data.json`)

---

## 2. Microsoft Form

- Go to: https://forms.microsoft.com → "New Form"
- Title: **"Board Member Management"**
- Questions:
  1. **Choice**: "Action" 
     - Add New Member
     - Remove Member  
     - Update Existing Member
  2. **Text**: "Full Name" (Required)
  3. **Text**: "Title/Position" (Optional)

---

## 3. Power Automate Flow

- Go to: https://flow.microsoft.com → "Create" → "Automated cloud flow"
- Name: **"Update Board Members"**
- Trigger: **"When a new response is submitted (Microsoft Forms)"**

**Steps to add:**
1. **Get response details** (Forms)
2. **Get blob content** (Azure Blob Storage) → Select your storage account, container: `board-data`, blob: `board-data.json`
3. **Compose** → Expression: `json(body('Get_blob_content'))`
4. **Switch** → On form response "Action"

   **Case: Add New Member**
   - Value: "Add New Member"
   - Add action: **Compose**
   - Inputs → Expression:
   ```
   union(outputs('Compose'), createArray(json(concat('{"id":', add(length(outputs('Compose')), 1), ',"name":"', body('Get_response_details')?['<FULL_NAME_FIELD_ID>'], '","title":"', body('Get_response_details')?['<TITLE_POSITION_FIELD_ID>'], '"}'))))
   ```

   **Case: Remove Member**
   - Value: "Remove Member"
   - Add action: **Compose**
   - Inputs → Expression:
   ```
   filter(outputs('Compose'), not(equals(item()['name'], body('Get_response_details')?['<FULL_NAME_FIELD_ID>'])))
   ```

   **Case: Update Existing Member**
   - Value: "Update Existing Member"
   - Add action: **Apply to each**
   - Select an output: `outputs('Compose')` (the one that parsed the JSON file)
   - Inside loop, add: **Condition**
     - Left: `item()['name']`
     - Equals: Form response "Full Name" field
     - **If Yes**: Add **Compose** action with Expression:
       ```
       json(concat('{"id":', item()['id'], ',"name":"', item()['name'], '","title":"', body('Get_response_details')?['<TITLE_POSITION_FIELD_ID>'], '"}'))
       ```
     - **If No**: Add **Compose** action with: `item()`
   - After Apply to each: **Compose** → Expression: `outputs('Apply_to_each')`

5. **Create blob** (Azure Blob Storage connector)
   - Storage account: Select your storage account
   - Container name: `board-data`
   - Blob name: `board-data.json`
   - Blob content: Use this expression to get the right output:
   ```
   if(equals(body('Get_response_details')?['<ACTION_FIELD_ID>'], 'Add New Member'), outputs('Compose_Add'), if(equals(body('Get_response_details')?['<ACTION_FIELD_ID>'], 'Remove Member'), outputs('Compose_Remove'), outputs('Compose_Update')))
   ```
   
   **Or simpler approach**: Add a **Compose** action after the Switch that combines all outputs:
   - Expression: `coalesce(outputs('Compose_Add'), outputs('Compose_Remove'), outputs('Compose_Update'))`
   - Then use this Compose output for the blob content

**Note**: 
- Replace `<ACTION_FIELD_ID>` with the dynamic content for "Action" from your form
- Replace `<FULL_NAME_FIELD_ID>` with the dynamic content for "Full Name" from your form  
- Replace `<TITLE_POSITION_FIELD_ID>` with the dynamic content for "Title/Position" from your form

**How to find these:**
1. In the "Get response details" action, you'll see dynamic content like:
   - "Action" (for your choice field)
   - "Full Name" (for your name field)
   - "Title/Position" (for your position field)
2. Click on these dynamic content items instead of typing the `<FIELD_ID>` placeholders
3. Power Automate will automatically insert the correct field references

**Example:** Instead of `body('Get_response_details')?['<FULL_NAME_FIELD_ID>']`, you'll click the "Full Name" dynamic content and it becomes something like `body('Get_response_details')?['r123abc456def']`

---

## 4. Update Website

In `sharepoint-config.js`:
```javascript
documentLibraryUrl: 'YOUR_AZURE_BLOB_URL_FROM_STEP_1', // e.g., 'https://yourstorage.blob.core.windows.net/board-data/board-data.json'
enabled: true
```

**Example:**
```javascript
documentLibraryUrl: 'https://harambeedata.blob.core.windows.net/board-data/board-data.json',
```

---

## Test & Done!

1. Submit form → Check JSON updates → Verify website changes
2. ✅ **Non-technical users can now manage board members via form!**

---

## Quick Troubleshooting

- **Flow fails**: Check run history
- **Website not loading**: Test JSON URL in browser  
- **Form IDs wrong**: Check response field names in Power Automate
- **DLP issues**: All Microsoft connectors = no problems