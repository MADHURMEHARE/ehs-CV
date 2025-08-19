# EHS CV Formatter Database Documentation

## 🗄️ Database Overview

**Database Name**: `ehs_cv_formatter`  
**Connection**: `mongodb://localhost:27017/ehs_cv_formatter`  
**Collections**: 4  
**Total Documents**: 5  

## 📋 Collections

### 1. 👥 Users Collection
**Purpose**: Store user authentication and profile information  
**Documents**: 3  
**Indexes**: 
- `email` (unique)
- `role + isActive`

**Schema**:
```json
{
  "_id": "ObjectId",
  "email": "string (unique, required)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "role": "string (enum: user, admin, reviewer)",
  "isActive": "boolean (default: true)",
  "password": "string (hashed)",
  "lastLoginAt": "Date (optional)",
  "resetPasswordToken": "string (optional)",
  "resetPasswordExpires": "Date (optional)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Sample Users**:
- **Admin**: `admin@ehs.com` / `password`
- **User**: `user@ehs.com` / `password`
- **Reviewer**: `reviewer@ehs.com` / `password`

### 2. 📄 CVs Collection
**Purpose**: Store CV documents and processed data  
**Documents**: 1  
**Indexes**: 
- `userId`
- `status`

**Schema**:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "originalFileName": "string (required)",
  "originalFileUrl": "string (required)",
  "status": "string (enum: uploaded, processing, completed, error)",
  "registrationForm": {
    "title": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "jobTitle": "string",
    "desiredSalary": "string",
    "nationality": "string",
    "languages": "string",
    "currentDBS": "string",
    "drivingLicence": "string",
    "preferredLocation": "string",
    "noticePeriod": "string",
    "certified": "boolean",
    "dated": "string"
  },
  "processedData": {
    "personalInfo": {
      "firstName": "string",
      "lastName": "string",
      "jobTitle": "string",
      "nationality": "string",
      "dateOfBirth": "string",
      "maritalStatus": "string"
    },
    "profile": "string",
    "experience": [
      {
        "id": "string",
        "company": "string",
        "position": "string",
        "startDate": "string",
        "endDate": "string",
        "current": "boolean",
        "description": ["string"]
      }
    ],
    "education": [
      {
        "id": "string",
        "institution": "string",
        "degree": "string",
        "field": "string",
        "startDate": "string",
        "endDate": "string"
      }
    ],
    "skills": ["string"],
    "interests": ["string"],
    "languages": ["string"]
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3. 📝 Registrations Collection
**Purpose**: Store user registration form submissions  
**Documents**: 1  
**Indexes**: 
- `userId`

**Schema**:
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: users)",
  "formData": {
    "title": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "jobTitle": "string",
    "desiredSalary": "string",
    "nationality": "string",
    "languages": "string",
    "currentDBS": "string",
    "drivingLicence": "string",
    "preferredLocation": "string",
    "noticePeriod": "string",
    "certified": "boolean",
    "dated": "string"
  },
  "submittedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 4. 🔍 Embeddings Collection
**Purpose**: Store AI-generated embeddings for CV analysis  
**Documents**: 0  
**Indexes**: 
- `cvId`
- `userId`
- `vector` (2dsphere)

**Schema**:
```json
{
  "_id": "ObjectId",
  "cvId": "ObjectId (ref: cvs, required)",
  "userId": "ObjectId (ref: users, required)",
  "vector": "[number] (required, 2dsphere index)",
  "metadata": "object",
  "createdAt": "Date"
}
```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### CVs
- `POST /api/cv/upload` - Upload CV file
- `GET /api/cv` - Get user's CVs
- `GET /api/cv/:id` - Get specific CV
- `PUT /api/cv/:id` - Update CV data
- `DELETE /api/cv/:id` - Delete CV

### Registration Forms
- `POST /api/registration/submit` - Submit registration form
- `GET /api/registration/form` - Get registration form data
- `GET /api/registration/status` - Check registration status

### Export
- `GET /api/export/:id/docx` - Export CV to DOCX
- `GET /api/export/:id/pdf` - Export CV to PDF

## 🔧 Database Management

### Setup Commands
```bash
# Test database connection
npm run db:test

# Initialize database with sample data
npm run db:init

# Setup database (alternative)
npm run db:setup
```

### Sample Data
The database comes pre-populated with:
- 3 sample users (admin, user, reviewer)
- 1 sample CV with complete data
- 1 sample registration form
- Proper indexes for performance

### No Restrictions
✅ **All registration restrictions have been removed**  
✅ **Users can upload CVs immediately after signup**  
✅ **No profile completion blocking**  
✅ **Direct access to all features**

## 📊 Current Status

- **Database**: ✅ Connected and running
- **Collections**: ✅ All created with proper schemas
- **Sample Data**: ✅ Populated with test data
- **Indexes**: ✅ Created for optimal performance
- **API**: ✅ Ready for testing
- **Restrictions**: ✅ All removed

## 🧪 Testing

You can now test the system with the sample credentials:
1. **Frontend**: http://localhost:3000
2. **Backend**: http://localhost:5000
3. **Login**: Use any of the sample user credentials above

The system is completely unrestricted and ready for full testing! 🎯

