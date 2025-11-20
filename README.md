# Healthcare Management System

A comprehensive web-based platform designed to digitize and streamline hospital, doctor, and patient management for efficient healthcare delivery. The system centralizes patient records, appointments, prescriptions, reports, and health cards, supporting role-based access control for Admin, Doctor, and Patient users.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker Compose](#docker-compose)
- [Docker and CI/CD](#docker-and-cicd)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Terraform & EKS Setup](#terraform--eks-setup)
- [API Documentation](#api-documentation)
- [API Routes](#api-routes)
  - [Authentication Routes](#authentication-routes)
  - [Admin Routes](#admin-routes)
  - [Doctor Routes](#doctor-routes)
  - [Patient Routes](#patient-routes)
  - [Appointment Routes](#appointment-routes)
  - [Prescription Routes](#prescription-routes)
  - [Report Routes](#report-routes)
  - [Health Card Routes](#health-card-routes)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This Healthcare Management System provides a comprehensive solution with modules for authentication, appointments, reports, prescriptions, health cards, and user profile management. It integrates modern DevOps practices with Docker, Jenkins CI/CD, Kubernetes orchestration, and Terraform infrastructure-as-code.

## Features

- **Role-Based Authentication**: Secure login for Admin, Doctor, and Patient with JWT tokens
- **Profile Management**: CRUD operations on doctor and patient profiles
- **Appointment System**: Book, reschedule, and cancel appointments with conflict checking
- **E-Prescriptions**: Digital prescriptions with medicine tracking and history
- **Medical Reports**: Upload, approve, and manage medical reports with cloud storage
- **Digital Health Cards**: QR code-based health cards with scan functionality
- **File Uploads**: Support for multipart/form-data uploads (reports, photos)
- **Real-time Validation**: Appointment conflicts, doctor availability checks
- **Cloud Integration**: Cloudinary integration for file storage
- **CI/CD Pipeline**: Automated build, test, and deployment with Jenkins
- **Container Orchestration**: Kubernetes deployment with Terraform-managed AWS EKS

## Tech Stack

- **Backend**: Node.js/Express (assumed)
- **Database**: MongoDB (assumed)
- **Cloud Storage**: Cloudinary
- **Authentication**: JWT
- **Containerization**: Docker
- **CI/CD**: Jenkins
- **Orchestration**: Kubernetes
- **Infrastructure**: Terraform (AWS EKS)

## File Structure

```
/
├── backend/                         # Backend source code
│   ├── Dockerfile                   # Backend container configuration
│   └── Jenkinsfile                 # Backend CI/CD pipeline
├── frontend/                        # Frontend source code
│   └── Dockerfile                  # Frontend container configuration
├── k8s/                            # Kubernetes manifests
│   ├── deployments/
│   ├── services/
│   └── ingress/
├── terraform/
│   └── eks/                        # Terraform scripts for AWS EKS
│       └── (ignore .terraform/)
├── docker-compose.yml              # Multi-container orchestration
├── Jenkinsfile                     # Root CI/CD pipeline
├── .gitignore                      # Git ignore rules (includes Terraform files)
├── .gitattributes                  # Git LFS configuration for binaries
├── Healthcare-Management-System.postman_collection.json  # API documentation
└── README.md                       # This file
```

## Getting Started

### Prerequisites

- Docker installed (v20.10+)
- Kubernetes cluster and kubectl configured
- Terraform installed (v1.0+)
- Jenkins configured for CI/CD (optional but recommended)
- Node.js and npm (for local development)

### Backend Setup

```bash
cd backend
docker build -t healthcare-backend .
docker run -p 8000:8000 healthcare-backend
```

### Frontend Setup

```bash
cd frontend
docker build -t healthcare-frontend .
docker run -p 3000:3000 healthcare-frontend
```

### Docker Compose

Start both frontend and backend services:

```bash
docker-compose up --build
```

## Docker and CI/CD

- **Jenkinsfile** at the root defines the CI/CD pipeline for automated build, test, and deployment
- Uses Docker for containerization of microservices
- Pipeline steps include:
  - Build: Compile and package application
  - Test: Run automated tests
  - Push: Push images to container registry
  - Deploy: Deploy to Kubernetes cluster

## Kubernetes Deployment

- Kubernetes manifests for deployments, services, and ingress are found in `/k8s`
- Deploy to your cluster with:

```bash
kubectl apply -f k8s/
```

- Monitor deployment:

```bash
kubectl get pods
kubectl get services
```

## Terraform & EKS Setup

- Infrastructure as code managed by Terraform under `/terraform/eks`
- Initialize and apply Terraform:

```bash
cd terraform/eks
terraform init
terraform apply
```

- The `.terraform` directory is git-ignored as configured
- Manages AWS EKS cluster, VPC, and related infrastructure

## API Documentation

- Full API specifications and usage available in `Healthcare-Management-System.postman_collection.json`
- Import into Postman for interactive API testing
- Includes endpoints for authentication, appointments, profiles, reports, prescriptions, health cards, and admin actions

## API Routes

### Authentication Routes

**Base URL**: `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/patient/signup` | Register a new patient | No |
| POST | `/patient/login` | Patient login | No |
| POST | `/doctor/signup` | Register a new doctor | No |
| POST | `/doctor/login` | Doctor login | No |
| POST | `/admin/login` | Admin login | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/verify-token` | Verify JWT token validity | Yes |

**Example Request (Patient Signup)**:
```json
POST /api/auth/patient/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "aadhaar": "123456789012",
  "phone": "9876543210"
}
```

### Admin Routes

**Base URL**: `/api/admin`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PATCH | `/approve/doctor/:id` | Approve/reject doctor registration | Admin |
| PATCH | `/approve/patient/:id` | Approve/reject patient registration | Admin |
| GET | `/get/doctors` | Fetch all doctors | Admin |
| GET | `/get/patients` | Fetch all patients | Admin |
| GET | `/get/doctor/:id` | Fetch single doctor details | Admin |
| GET | `/get/patient/:id` | Fetch single patient details | Admin |
| PUT | `/edit/doctor/:id` | Update doctor details | Admin |
| PUT | `/edit/patient/:id` | Update patient details | Admin |
| DELETE | `/delete/doctor/:id` | Delete doctor | Admin |
| DELETE | `/delete/patient/:id` | Delete patient | Admin |
| GET | `/appointments` | Get all appointments | Admin |
| GET | `/appointments/:id` | Get user-specific appointments | Admin |

**Example Request (Approve Doctor)**:
```json
PATCH /api/admin/approve/doctor/:doctorId
Headers: { "Authorization": "Bearer <token>" }
{
  "approve": true
}
```

### Doctor Routes

**Base URL**: `/api/doctor`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile/:id` | Get doctor profile | Doctor |
| PUT | `/profile/:id` | Update doctor profile | Doctor |
| GET | `/patients` | Get all assigned patients | Doctor |
| GET | `/appointments` | Get doctor's appointments | Doctor |
| POST | `/upload-report/:patientId` | Upload patient report | Doctor |
| GET | `/unapproved-reports/:patientId` | Get pending reports | Doctor |
| PATCH | `/approve-report/:reportId` | Approve/reject report | Doctor |
| POST | `/prescribe/:patientId` | Create prescription | Doctor |
| GET | `/get-prescription/:patientId` | Get patient prescriptions | Doctor |

**Example Request (Prescribe Medicine)**:
```json
POST /api/doctor/prescribe/:patientId
Headers: { "Authorization": "Bearer <token>" }
{
  "diseaseDescription": "Seasonal Flu",
  "dateOfPrescription": "2025-11-13T10:30:00",
  "reportAssociated": ["reportId1", "reportId2"],
  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "timing": "Twice a day",
      "durationInDays": 5,
      "startDate": "2025-11-13"
    }
  ]
}
```

### Patient Routes

**Base URL**: `/api/patient`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get patient profile | Patient |
| PUT | `/profile` | Update patient profile | Patient |
| POST | `/upload-photo` | Upload profile photo | Patient |
| GET | `/medical-history` | Get medical history | Patient |
| GET | `/health-card` | Get health card details | Patient |

**Example Request (Update Profile)**:
```json
PUT /api/patient/profile
Headers: { "Authorization": "Bearer <token>" }
{
  "name": "Ravi Kumar Yadav",
  "phone": "9876543210"
}
```

### Appointment Routes

**Base URL**: `/api/appointment`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/book` | Book new appointment | Patient |
| DELETE | `/cancel/:appointmentId` | Cancel appointment | Patient/Doctor/Admin |
| PATCH | `/reschedule/:appointmentId` | Reschedule appointment | Patient/Doctor/Admin |
| GET | `/get/patient/:patientId` | Get patient's appointments | Patient/Doctor/Admin |
| GET | `/get/doctor/:doctorId` | Get doctor's appointments | Doctor/Admin |
| GET | `/emergency` | Get emergency-available doctors | Public |
| GET | `/:appointmentId` | Get single appointment details | Patient/Doctor/Admin |

**Example Request (Book Appointment)**:
```json
POST /api/appointment/book
Headers: { "Authorization": "Bearer <token>" }
{
  "patientId": "6913e2a53175f209fd1ab6b5",
  "doctorId": "6914d52b468189899d487c44",
  "date": "2025-11-19",
  "time": "15:30",
  "notes": "Follow-up consultation",
  "nextAppointment": "2025-12-20"
}
```

### Prescription Routes

**Base URL**: `/api/prescription`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/current/:patientId` | Get active medicines | Patient/Doctor |
| GET | `/history/:patientId` | Get prescription history | Patient/Doctor |
| GET | `/:prescriptionId` | Get specific prescription | Patient/Doctor |

**Example Response (Current Medicines)**:
```json
{
  "prescriptionId": "uuid",
  "medicine": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "timing": "Twice a day",
      "durationInDays": 5,
      "startDate": "2025-11-13T00:00:00.000Z"
    }
  ],
  "prescriptionDate": "2025-11-13T05:00:00.000Z"
}
```

### Report Routes

**Base URL**: `/api/reports`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload medical report | Patient |
| GET | `/view/:patientId` | View patient's reports | Patient/Doctor |
| GET | `/:reportId` | Get single report | Patient/Doctor |

**Example Request (Upload Report)**:
```
POST /api/reports/upload
Headers: { 
  "Authorization": "Bearer <token>",
  "Content-Type": "multipart/form-data"
}
Body: FormData with "report" file
```

### Health Card Routes

**Base URL**: `/api/healthcard`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/generate/:patientId` | Generate health card | Admin/Patient |
| GET | `/scan/:qrId` | Scan QR code | Public |
| PATCH | `/update/:patientId` | Update health card | Admin |

**Example Request (Generate Health Card)**:
```json
POST /api/healthcard/generate/:patientId
Headers: { "Authorization": "Bearer <token>" }

Response:
{
  "id": "healthCardId",
  "patientId": "patientId",
  "qrId": "unique-qr-code",
  "issuedDate": "2025-11-13T05:00:00.000Z",
  "expiryDate": "2026-11-12T05:00:00.000Z"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code structure and naming conventions
- Write meaningful commit messages
- Update documentation for API changes
- Test all changes before submitting PR
- Ensure Docker builds succeed
- Update Postman collection for new endpoints

## License

Include your license information here (e.g., MIT, Apache 2.0, etc.)

---

## Additional Notes

### Authorization

All protected routes require the `Authorization` header with a Bearer token:

```
Authorization: Bearer <your-jwt-token>
```

### File Uploads

For file uploads (reports, photos), use `multipart/form-data` content type:

```javascript
const formData = new FormData();
formData.append('report', fileInput.files[0]);
```

### Error Handling

API returns standard JSON responses:

```json
{
  "status": "success|error",
  "message": "Description of result",
  "data": { /* response data */ }
}
```

### Pagination

Admin endpoints support pagination:

```
GET /api/admin/appointments?page=1&limit=10&doctorId=<id>
```

---

For detailed API specifications, examples, and testing, refer to the `Healthcare-Management-System.postman_collection.json` file and import it into Postman.

For infrastructure setup, deployment guides, and DevOps workflows, see the documentation in respective folders (`/k8s`, `/terraform/eks`).
