# Healthcare Management System - Frontend

A modern, responsive React frontend for the Healthcare Management System with role-based access control for Admin, Doctor, and Patient users.

## Features

- **Role-based Authentication**: Separate login flows for Admin, Doctor, and Patient
- **Admin Dashboard**: Manage doctors, patients, and view all appointments
- **Doctor Dashboard**: Manage profile, view patients, appointments, upload/approve reports, create prescriptions
- **Patient Dashboard**: View profile, health card, medical history, book appointments, upload reports
- **Responsive Design**: Mobile-friendly UI built with TailwindCSS
- **Modern UI**: Clean, professional design with smooth animations
- **Real-time Updates**: Toast notifications for user feedback

## Tech Stack

- **React 18**: UI library
- **React Router 6**: Client-side routing
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Toastify**: Toast notifications
- **QRCode.react**: QR code generation
- **date-fns**: Date formatting utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Table.jsx
│   │   ├── Card.jsx
│   │   └── LoadingSpinner.jsx
│   ├── context/             # React Context for state management
│   │   └── AuthContext.jsx
│   ├── pages/               # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── admin/          # Admin pages
│   │   ├── doctor/         # Doctor pages
│   │   ├── patient/        # Patient pages
│   │   └── shared/         # Shared pages
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## Role-based Features

### Admin
- View dashboard with statistics
- Approve/reject doctors and patients
- Edit/delete doctor and patient profiles
- View all appointments

### Doctor
- View and update profile
- View assigned patients
- Manage appointments (reschedule/cancel)
- Upload and approve patient reports
- Create prescriptions for patients
- View emergency available doctors

### Patient
- View and update profile
- Upload profile photo
- Book, reschedule, and cancel appointments
- View medical history (prescriptions and reports)
- Upload reports
- Generate and view health card with QR code
- View current medicines

## API Integration

The frontend integrates with the backend REST API:

- **Auth**: `/api/auth/*`
- **Admin**: `/api/admin/*`
- **Doctor**: `/api/doctor/*`
- **Patient**: `/api/patient/*`
- **Appointments**: `/api/appointment/*`
- **Prescriptions**: `/api/prescription/*`
- **Reports**: `/api/reports/*`
- **Health Card**: `/api/healthcard/*`

All protected endpoints require JWT authentication token in the Authorization header.

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: `http://localhost:5000/api`)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

