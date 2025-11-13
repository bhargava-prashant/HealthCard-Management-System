import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  patientSignup: (data) => api.post('/auth/patient/signup', data),
  patientLogin: (data) => api.post('/auth/patient/login', data),
  doctorSignup: (data) => api.post('/auth/doctor/signup', data),
  doctorLogin: (data) => api.post('/auth/doctor/login', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify-token'),
};

// Admin APIs
export const adminAPI = {
  approveDoctor: (id, data) => api.patch(`/admin/approve/doctor/${id}`, data),
  approvePatient: (id, data) => api.patch(`/admin/approve/patient/${id}`, data),
  getDoctors: () => api.get('/admin/get/doctors'),
  getPatients: () => api.get('/admin/get/patients'),
  getDoctorById: (id) => api.get(`/admin/get/doctor/${id}`),
  getPatientById: (id) => api.get(`/admin/get/patient/${id}`),
  editDoctor: (id, data) => api.put(`/admin/edit/doctor/${id}`, data),
  editPatient: (id, data) => api.put(`/admin/edit/patient/${id}`, data),
  deleteDoctor: (id) => api.delete(`/admin/delete/doctor/${id}`),
  deletePatient: (id) => api.delete(`/admin/delete/patient/${id}`),
  getAppointments: () => api.get('/admin/appointments'),
  getUserAppointments: (id) => api.get(`/admin/appointments/${id}`),
};

// Doctor APIs
export const doctorAPI = {
  getProfile: (id) => api.get(`/doctor/profile/${id}`),
  updateProfile: (id, data) => api.put(`/doctor/profile/${id}`, data),
  getPatients: () => api.get('/doctor/patients'),
  getAppointments: () => api.get('/doctor/appointments'),
  uploadReport: (patientId, formData) => api.post(`/doctor/upload-report/${patientId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getUnapprovedReports: (patientId) => api.get(`/doctor/unapporved-reports/${patientId}`),
  prescribe: (patientId, data) => api.post(`/doctor/prescribe/${patientId}`, data),
  approveReport: (reportId, data) => api.patch(`/doctor/approve-report/${reportId}`, data),
  getPrescriptions: (patientId) => api.get(`/doctor/get-prescription/${patientId}`),
};

// Patient APIs
export const patientAPI = {
  getProfile: () => api.get('/patient/profile'),
  updateProfile: (data) => api.put('/patient/profile', data),
  uploadPhoto: (formData) => api.post('/patient/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMedicalHistory: () => api.get('/patient/medical-history'),
  getHealthCard: () => api.get('/patient/health-card'),
};

// Appointment APIs
export const appointmentAPI = {
  bookAppointment: (data) => api.post('/appointment/book', data),
  cancelAppointment: (appointmentId) => api.delete(`/appointment/cancel/${appointmentId}`),
  rescheduleAppointment: (appointmentId, data) => api.patch(`/appointment/reschedule/${appointmentId}`, data),
  getPatientAppointments: (patientId) => api.get(`/appointment/get/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => api.get(`/appointment/get/doctor/${doctorId}`),
  getEmergencyDoctors: () => api.get('/appointment/emergency'),
  getAppointmentById: (appointmentId) => api.get(`/appointment/${appointmentId}`),
};

// Prescription APIs
export const prescriptionAPI = {
  getCurrentMedicines: (patientId) => api.get(`/prescription/current/${patientId}`),
  getHistory: (patientId) => api.get(`/prescription/history/${patientId}`),
  getPrescriptionById: (prescriptionId) => api.get(`/prescription/${prescriptionId}`),
};

// Report APIs
export const reportAPI = {
  uploadReport: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  viewReports: (patientId) => api.get(`/reports/view/${patientId}`),
  getReport: (reportId) => api.get(`/reports/${reportId}`),
};

// Health Card APIs
export const healthCardAPI = {
  generate: (patientId) => api.post(`/healthcard/generate/${patientId}`),
  scan: (qrId) => api.get(`/healthcard/scan/${qrId}`),
  update: (patientId, data) => api.patch(`/healthcard/update/${patientId}`, data),
};

export default api;

