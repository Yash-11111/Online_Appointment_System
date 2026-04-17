# Hospital Appointment Booking System

A full-stack MERN application for managing hospital appointments with role-based access control for patients, doctors, and administrators.

## 🎯 Features

### 👤 Patient Features
- User registration and secure authentication
- View available departments and doctors
- Book appointments with multi-step workflow
- Select preferred date and time slots
- Cancel or reschedule appointments
- View appointment history
- Access prescriptions from completed appointments

### 👨‍⚕️ Doctor Features
- Secure login
- Set availability and create time slots
- View scheduled appointments
- Access patient information
- Add prescriptions after consultation

### 🏥 Admin Features
- Manage departments (CRUD operations)
- Manage doctors and their profiles
- Monitor all appointments
- View system statistics
- Manage doctor schedules

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 18** with React Router v6
- **Fetch API** for HTTP requests
- **Context API** for state management
- **Vanilla CSS** for styling

## 🚀 Getting Started

### Prerequisites
- Node.js v14+ 
- npm or yarn
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure MongoDB connection**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-booking
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   ```

5. **Start the server**
   ```bash
   npm start       # Production
   npm run dev     # Development (requires nodemon)
   ```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure API URL** (typically already set)
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

App will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

**Register Patient**
```
POST /api/auth/register
Body: { name, email, password, phone, age, gender, address }
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

**Get Current User**
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Department Endpoints

**Get All Departments**
```
GET /api/departments
```

**Create Department (Admin)**
```
POST /api/departments
Body: { name, description }
```

**Update Department (Admin)**
```
PUT /api/departments/:id
Body: { name, description }
```

**Delete Department (Admin)**
```
DELETE /api/departments/:id
```

### Doctor Endpoints

**Get All Doctors**
```
GET /api/doctors
GET /api/doctors?department=<departmentId>
```

**Get Doctor Profile (Doctor)**
```
GET /api/doctors/profile/me
Headers: Authorization: Bearer <token>
```

**Create Doctor (Admin)**
```
POST /api/doctors
Body: { name, email, password, phone, gender, department, specialization, ... }
```

### Slot Endpoints

**Get Available Slots**
```
GET /api/slots?doctor=<doctorId>&date=YYYY-MM-DD
```

**Create Slots (Doctor)**
```
POST /api/slots
Headers: Authorization: Bearer <token>
Body: { date, slots: [{ startTime, endTime }, ...] }
```

**Get My Slots (Doctor)**
```
GET /api/slots/my-slots?date=YYYY-MM-DD
Headers: Authorization: Bearer <token>
```

### Appointment Endpoints

**Book Appointment (Patient)**
```
POST /api/appointments
Headers: Authorization: Bearer <token>
Body: { doctorId, slotId, departmentId, type, reason }
```

**Get My Appointments (Patient)**
```
GET /api/appointments/my-appointments
Headers: Authorization: Bearer <token>
```

**Get Doctor Appointments (Doctor)**
```
GET /api/appointments/doctor-appointments?date=YYYY-MM-DD
Headers: Authorization: Bearer <token>
```

**Get All Appointments (Admin)**
```
GET /api/appointments?status=<status>&date=<date>
Headers: Authorization: Bearer <token>
```

**Cancel Appointment**
```
PUT /api/appointments/:id/cancel
Headers: Authorization: Bearer <token>
Body: { reason }
```

**Reschedule Appointment (Patient)**
```
PUT /api/appointments/:id/reschedule
Headers: Authorization: Bearer <token>
Body: { newSlotId }
```

### Prescription Endpoints

**Create Prescription (Doctor)**
```
POST /api/prescriptions
Headers: Authorization: Bearer <token>
Body: { appointmentId, diagnosis, notes, medicines, followUpDate }
```

**Get My Prescriptions (Patient)**
```
GET /api/prescriptions/my-prescriptions
Headers: Authorization: Bearer <token>
```

**Get Prescription by Appointment**
```
GET /api/prescriptions/appointment/:appointmentId
Headers: Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Collections

**Users**
- _id (ObjectId)
- name, email, password
- role (patient/doctor/admin)
- phone, age, gender, address
- timestamps

**Departments**
- _id, name, description
- isActive (boolean)
- timestamps

**Doctors**
- _id, user (ref), department (ref)
- specialization, experience
- qualifications [], consultationFee
- isAvailable (boolean)
- timestamps

**Slots**
- _id, doctor (ref), date, startTime, endTime
- isBooked, isActive (booleans)
- Unique index: (doctor, date, startTime)

**Appointments**
- _id, patient (ref), doctor (ref), slot (ref), department (ref)
- type (normal/emergency), status
- reason, notes, cancelledBy, cancelReason
- timestamps

**Prescriptions**
- _id, appointment (ref), doctor (ref), patient (ref)
- diagnosis, notes, followUpDate
- medicines: [{ name, dosage, frequency, duration }]
- timestamps

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth with expiration
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control**: Middleware enforces role restrictions
- **Atomic Transactions**: MongoDB sessions prevent double booking
- **Input Validation**: Mongoose schema validation on all models

## 🏗️ Project Structure

```
hospital-booking/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── Doctor.js
│   │   ├── Slot.js
│   │   ├── Appointment.js
│   │   └── Prescription.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── departmentController.js
│   │   ├── doctorController.js
│   │   ├── slotController.js
│   │   ├── appointmentController.js
│   │   └── prescriptionController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── departments.js
│   │   ├── doctors.js
│   │   ├── slots.js
│   │   ├── appointments.js
│   │   └── prescriptions.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── PatientDashboard.js
│   │   │   ├── BookAppointment.js
│   │   │   ├── MyAppointments.js
│   │   │   ├── Prescriptions.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── DoctorSchedule.js
│   │   │   ├── DoctorAppointments.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── .env.example
│   └── package.json
└── README.md
```

## 🔄 Appointment Booking Flow (Strict)

1. **Patient selects Department** → Filters available doctors
2. **Patient selects Doctor** → Shows available dates
3. **Patient selects Date** → Fetches available time slots
4. **Patient selects Time Slot** → Reserves the slot (atomic operation)
5. **Patient confirms booking** → Provides reason/notes
6. **Appointment Created** → Status: confirmed
7. **Doctor adds Prescription** → After consultation, marks as completed

## 🚨 Critical Features

### Double Booking Prevention
- Uses MongoDB atomic operations with `findOneAndUpdate`
- Slot marked as `isBooked: true` in a single atomic transaction
- If slot is already booked, operation fails with 409 Conflict

### Role-Based Authorization
- `protect` middleware verifies JWT and attaches user to request
- `authorize` middleware checks user role against allowed roles
- Applied at route level for granular control

### Error Handling
- Centralized error handler middleware
- Custom error messages for validation, auth, and database errors
- Proper HTTP status codes (400, 401, 403, 404, 409, 500)

## 📝 Sample Data Setup

Create initial data via API:

**Create Department**
```bash
curl -X POST http://localhost:5000/api/departments \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cardiology","description":"Heart and cardiovascular care"}'
```

**Create Doctor**
```bash
curl -X POST http://localhost:5000/api/doctors \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Dr. Ahmed",
    "email":"ahmed@hospital.com",
    "password":"password123",
    "department":"<dept_id>",
    "specialization":"Cardiologist",
    "experience":10
  }'
```

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Verify MongoDB is running
- Check MONGO_URI format: `mongodb+srv://user:pass@cluster.mongo.com/dbname`
- Whitelist your IP in MongoDB Atlas

**CORS Error**
- Backend CORS origin must match frontend URL
- Update in `server.js`: `origin: 'http://localhost:3000'`

**Token Expired**
- Re-login to get a new token
- Token expires in 7 days by default (see JWT_EXPIRES_IN)

**Slots Not Loading**
- Ensure doctor has slots created for that date
- Check date format: YYYY-MM-DD
- Verify doctor exists in department

## 📦 Deployment

### Backend (e.g., Render, Railway, Heroku)
1. Push code to GitHub
2. Connect repo to deployment platform
3. Set environment variables (MONGO_URI, JWT_SECRET)
4. Deploy

### Frontend (e.g., Vercel, Netlify)
1. Build: `npm run build`
2. Deploy build folder
3. Set environment variables for API URL

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for GLA University - CSE Department

---

**For questions or issues, please create an issue in the repository.**
