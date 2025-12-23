# Dokumentasi API RoxyDental Backend

## Daftar Isi
1. [Informasi Umum](#informasi-umum)
2. [Authentication](#authentication)
3. [Doctor Dashboard](#doctor-dashboard)
4. [Nurse Dashboard](#nurse-dashboard)
5. [Patient Management](#patient-management)
6. [Visit Management](#visit-management)
7. [Treatment Management](#treatment-management)
8. [Payment Management](#payment-management)
9. [Schedule Management](#schedule-management)
10. [Leave Management](#leave-management)
11. [Commission Management](#commission-management)
12. [Finance Management](#finance-management)
13. [User Management](#user-management)
14. [Calendar Management](#calendar-management)
15. [Medication Management](#medication-management)
16. [AI Services](#ai-services)

---

## Informasi Umum

### Base URL
```
Production: https://api.roxydental.com
Development: http://localhost:5000
```

### Response Format
Semua response menggunakan format JSON dengan struktur:

**Success Response:**
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Pesan error",
  "errors": []
}
```

### Authentication Header
```
Authorization: Bearer {jwt_token}
```

### User Roles
- `DOKTER` - Dokter/Doctor
- `PERAWAT` - Perawat/Nurse

---

## Authentication

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "password": "string (min: 6)",
  "role": "DOKTER | PERAWAT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "role": "DOKTER | PERAWAT",
      "phone": "string",
      "specialization": "string | null",
      "isActive": true
    },
    "token": "jwt_token"
  }
}
```

**Error Codes:**
- `401` - Username atau password salah
- `403` - Role tidak sesuai / Akun tidak aktif

---

### 2. Register (Nurse)
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "email": "string (email)",
  "password": "string (min: 6)",
  "fullName": "string (min: 3)",
  "phone": "string (min: 10)",
  "specialization": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "role": "PERAWAT",
      "phone": "string",
      "specialization": "string | null",
      "isActive": true
    },
    "token": "jwt_token"
  }
}
```

**Error Codes:**
- `400` - Username/email sudah digunakan

---

### 3. Register Doctor
**Endpoint:** `POST /api/auth/register-doctor`

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "email": "string (email)",
  "password": "string (min: 6)",
  "fullName": "string (min: 3)",
  "phone": "string (min: 10)",
  "specialization": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registrasi dokter berhasil",
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "role": "DOKTER",
      "phone": "string",
      "specialization": "string",
      "isActive": true
    },
    "token": "jwt_token"
  }
}
```

---

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string (email)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda",
  "data": null
}
```

**Error Codes:**
- `404` - Email tidak ditemukan

---

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "string (email)",
  "token": "string",
  "newPassword": "string (min: 6)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password berhasil direset",
  "data": null
}
```

**Error Codes:**
- `400` - Token tidak valid atau sudah kadaluarsa
- `404` - User tidak ditemukan

---

### 6. Change Password
**Endpoint:** `PUT /api/auth/change-password`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "string (min: 6)",
  "newPassword": "string (min: 6)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password berhasil diubah",
  "data": null
}
```

**Error Codes:**
- `400` - Password saat ini salah

---

### 7. Get Current User
**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "DOKTER | PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "isActive": true,
    "createdAt": "timestamp"
  }
}
```

---

## Doctor Dashboard

### 1. Get Doctor Summary
**Endpoint:** `GET /api/doctor/dashboard/summary`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Summary berhasil diambil",
  "data": {
    "totalVisits": 150,
    "todayVisits": 5,
    "monthlyVisits": 45,
    "profile": {
      "id": "uuid",
      "username": "string",
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string",
      "education": "string | null",
      "experience": "string | null",
      "sipNumber": "string | null",
      "sipStartDate": "date | null",
      "sipEndDate": "date | null",
      "profilePhoto": "string | null",
      "isActive": true,
      "createdAt": "timestamp"
    },
    "schedules": [
      {
        "day": "Senin",
        "start": "08:00",
        "end": "17:00",
        "location": "POLADC"
      }
    ],
    "practiceStatus": "ACTIVE | INACTIVE | EXPIRED",
    "sipRemaining": {
      "percentage": 75.5,
      "years": 2,
      "months": 3,
      "days": 730
    }
  }
}
```

---

## Nurse Dashboard

### 1. Get Nurse Summary
**Endpoint:** `GET /api/nurse/dashboard/summary`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Summary berhasil diambil",
  "data": {
    "totalVisits": 200,
    "todayVisits": 8,
    "monthlyVisits": 60,
    "profile": {
      "id": "uuid",
      "username": "string",
      "fullName": "string",
      "email": "string",
      "phone": "string",
      "specialization": "string | null",
      "education": "string | null",
      "experience": "string | null",
      "profilePhoto": "string | null",
      "isActive": true,
      "createdAt": "timestamp"
    },
    "schedules": [
      {
        "day": "Senin",
        "start": "08:00",
        "end": "17:00",
        "location": "POLADC"
      }
    ]
  }
}
```

---

## Patient Management

### 1. Get All Patients
**Endpoint:** `GET /api/doctor/patients`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar pasien berhasil diambil",
  "data": {
    "patients": [
      {
        "id": "uuid",
        "patientNumber": "P-202412-0001",
        "medicalRecordNumber": "RM-202412-0001",
        "fullName": "string",
        "dateOfBirth": "date",
        "gender": "L | P",
        "phone": "string",
        "email": "string | null",
        "address": "string | null",
        "bloodType": "string | null",
        "allergies": "string | null",
        "medicalHistory": "string | null",
        "createdAt": "timestamp",
        "lastVisit": "timestamp | null",
        "lastVisitId": "uuid | null",
        "lastVisitNumber": "string | null",
        "chiefComplaint": "string | null",
        "lastDiagnosis": "string | null",
        "lastServiceName": "string | null"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Get Patient by ID
**Endpoint:** `GET /api/doctor/patients/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Detail pasien berhasil diambil",
  "data": {
    "id": "uuid",
    "patientNumber": "P-202412-0001",
    "medicalRecordNumber": "RM-202412-0001",
    "fullName": "string",
    "dateOfBirth": "date",
    "gender": "L | P",
    "phone": "string",
    "email": "string | null",
    "address": "string | null",
    "bloodType": "string | null",
    "allergies": "string | null",
    "medicalHistory": "string | null",
    "createdAt": "timestamp",
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20241224-1234567",
        "visitDate": "timestamp",
        "status": "COMPLETED",
        "chiefComplaint": "string | null",
        "nurse": {
          "fullName": "string"
        },
        "treatments": []
      }
    ],
    "_count": {
      "visits": 10,
      "treatments": 25
    }
  }
}
```

---

### 3. Create Patient
**Endpoint:** `POST /api/doctor/patients`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "fullName": "string (min: 3)",
  "dateOfBirth": "date (ISO format)",
  "gender": "L | P",
  "phone": "string (min: 10)",
  "email": "string (email, optional)",
  "address": "string (optional)",
  "bloodType": "string (optional)",
  "allergies": "string (optional)",
  "medicalHistory": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pasien berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "patientNumber": "P-202412-0001",
    "medicalRecordNumber": "RM-202412-0001",
    "fullName": "string",
    "dateOfBirth": "date",
    "gender": "L | P",
    "phone": "string",
    "email": "string | null",
    "address": "string | null",
    "bloodType": "string | null",
    "allergies": "string | null",
    "medicalHistory": "string | null",
    "createdAt": "timestamp"
  }
}
```

---

### 4. Get Patient Records
**Endpoint:** `GET /api/doctor/patients/:id/records`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Rekam medis berhasil diambil",
  "data": {
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202412-0001",
      "fullName": "string"
    },
    "treatments": [
      {
        "id": "uuid",
        "diagnosis": "string",
        "treatmentNotes": "string | null",
        "toothNumber": "string | null",
        "quantity": 1,
        "unitPrice": 500000,
        "discount": 0,
        "subtotal": 500000,
        "images": [],
        "createdAt": "timestamp",
        "visit": {
          "visitNumber": "V-20241224-1234567",
          "visitDate": "timestamp"
        },
        "service": {
          "serviceName": "string",
          "category": "CONSULTATION"
        },
        "performer": {
          "fullName": "string",
          "role": "DOKTER"
        }
      }
    ]
  }
}
```

---

### 5. Update Medical History
**Endpoint:** `PUT /api/doctor/patients/:id/medical-history`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "medicalHistory": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Riwayat medis berhasil diupdate",
  "data": {
    "id": "uuid",
    "medicalHistory": "string"
  }
}
```

---

### 6. Create Treatment for Patient
**Endpoint:** `POST /api/doctor/patients/:id/records`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "visitId": "uuid",
  "serviceId": "uuid",
  "toothNumber": "string (optional)",
  "diagnosis": "string (optional)",
  "treatmentNotes": "string (optional)",
  "quantity": 1,
  "discount": 0,
  "images": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Treatment berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "serviceId": "uuid",
    "performedBy": "uuid",
    "toothNumber": "string | null",
    "diagnosis": "string | null",
    "treatmentNotes": "string | null",
    "quantity": 1,
    "unitPrice": 500000,
    "discount": 0,
    "subtotal": 500000,
    "images": [],
    "createdAt": "timestamp",
    "service": {},
    "performer": {
      "fullName": "string"
    }
  }
}
```

---

## Visit Management

### 1. Get All Visits
**Endpoint:** `GET /api/doctor/visits`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `status` (WAITING | IN_PROGRESS | COMPLETED | CANCELLED, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar kunjungan berhasil diambil",
  "data": {
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20241224-1234567",
        "visitDate": "timestamp",
        "queueNumber": 1,
        "status": "WAITING | IN_PROGRESS | COMPLETED | CANCELLED",
        "chiefComplaint": "string | null",
        "bloodPressure": "string | null",
        "notes": "string | null",
        "totalCost": 0,
        "createdAt": "timestamp",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202412-0001",
          "medicalRecordNumber": "RM-202412-0001",
          "fullName": "string",
          "phone": "string",
          "gender": "L | P",
          "dateOfBirth": "date"
        },
        "nurse": {
          "id": "uuid",
          "fullName": "string"
        }
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Get Visit by ID
**Endpoint:** `GET /api/doctor/visits/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Detail kunjungan berhasil diambil",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20241224-1234567",
    "visitDate": "timestamp",
    "queueNumber": 1,
    "status": "WAITING",
    "chiefComplaint": "string | null",
    "bloodPressure": "string | null",
    "notes": "string | null",
    "totalCost": 0,
    "createdAt": "timestamp",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202412-0001",
      "medicalRecordNumber": "RM-202412-0001",
      "fullName": "string",
      "dateOfBirth": "date",
      "gender": "L | P",
      "phone": "string",
      "email": "string | null",
      "address": "string | null",
      "bloodType": "string | null",
      "allergies": "string | null",
      "medicalHistory": "string | null"
    },
    "nurse": {
      "id": "uuid",
      "fullName": "string"
    },
    "treatments": [],
    "payments": []
  }
}
```

---

### 3. Get Visit by Visit Number
**Endpoint:** `GET /api/doctor/visits/number/:visitNumber`

**Headers:** `Authorization: Bearer {token}`

**Response:** Same as Get Visit by ID

---

### 4. Get Visit by Medical Record Number
**Endpoint:** `GET /api/doctor/visits/medical-record/:medicalRecordNumber`

**Headers:** `Authorization: Bearer {token}`

**Response:** Same as Get Visit by ID

---

### 5. Create Visit
**Endpoint:** `POST /api/doctor/visits`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "patient": {
    "id": "uuid (optional, for existing patient)",
    "fullName": "string (min: 3)",
    "dateOfBirth": "date (ISO format)",
    "gender": "L | P",
    "phone": "string (min: 10)",
    "email": "string (email, optional)",
    "address": "string (optional)",
    "bloodType": "string (optional)",
    "allergies": "string (optional)",
    "medicalHistory": "string (optional)"
  },
  "visit": {
    "visitDate": "datetime (ISO format)",
    "chiefComplaint": "string (optional)",
    "bloodPressure": "string (optional)",
    "notes": "string (optional)",
    "status": "WAITING | IN_PROGRESS (optional)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kunjungan berhasil dibuat",
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "nurseId": "uuid",
    "visitNumber": "V-20241224-1234567",
    "visitDate": "timestamp",
    "queueNumber": 1,
    "status": "WAITING",
    "chiefComplaint": "string | null",
    "bloodPressure": "string | null",
    "notes": "string | null",
    "totalCost": 0,
    "createdAt": "timestamp",
    "patient": {},
    "nurse": {
      "id": "uuid",
      "fullName": "string"
    }
  }
}
```

---

### 6. Get Queue
**Endpoint:** `GET /api/doctor/visits/queue`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar antrian berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitNumber": "V-20241224-1234567",
      "visitDate": "timestamp",
      "queueNumber": 1,
      "status": "WAITING | IN_PROGRESS",
      "chiefComplaint": "string | null",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202412-0001",
        "medicalRecordNumber": "RM-202412-0001",
        "fullName": "string",
        "phone": "string"
      },
      "nurse": {
        "id": "uuid",
        "fullName": "string"
      }
    }
  ]
}
```

---

### 7. Update Visit Status
**Endpoint:** `PATCH /api/doctor/visits/:id/status`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "status": "WAITING | IN_PROGRESS | COMPLETED | CANCELLED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status kunjungan berhasil diupdate",
  "data": {
    "id": "uuid",
    "status": "COMPLETED",
    "patient": {
      "fullName": "string"
    }
  }
}
```

---

### 8. Get Completed Visits
**Endpoint:** `GET /api/doctor/visits/completed`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar kunjungan selesai berhasil diambil",
  "data": {
    "visits": [
      {
        "id": "uuid",
        "visitNumber": "V-20241224-1234567",
        "visitDate": "timestamp",
        "status": "COMPLETED",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202412-0001",
          "medicalRecordNumber": "RM-202412-0001",
          "fullName": "string",
          "dateOfBirth": "date",
          "gender": "L | P",
          "phone": "string"
        },
        "treatments": [
          {
            "id": "uuid",
            "diagnosis": "string",
            "service": {
              "serviceName": "string"
            }
          }
        ]
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 9. Update Visit
**Endpoint:** `PUT /api/doctor/visits/:id`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "visitDate": "datetime (ISO format, optional)",
  "chiefComplaint": "string (optional)",
  "bloodPressure": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kunjungan berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20241224-1234567",
    "visitDate": "timestamp",
    "chiefComplaint": "string | null",
    "bloodPressure": "string | null",
    "notes": "string | null",
    "patient": {},
    "nurse": {},
    "treatments": []
  }
}
```

---

### 10. Update Visit Examination
**Endpoint:** `PUT /api/doctor/visits/:id/examination`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "chiefComplaint": "string (optional)",
  "bloodPressure": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:** Same as Update Visit

---

## Treatment Management

### 1. Get All Treatments
**Endpoint:** `GET /api/doctor/treatments`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10)
- `patientId` (uuid, optional)
- `startDate` (ISO date, optional)
- `endDate` (ISO date, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar treatment berhasil diambil",
  "data": {
    "treatments": [
      {
        "id": "uuid",
        "visitId": "uuid",
        "patientId": "uuid",
        "serviceId": "uuid",
        "performedBy": "uuid",
        "toothNumber": "string | null",
        "diagnosis": "string | null",
        "treatmentNotes": "string | null",
        "quantity": 1,
        "unitPrice": 500000,
        "discount": 0,
        "subtotal": 500000,
        "images": [],
        "createdAt": "timestamp",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202412-0001",
          "fullName": "string",
          "gender": "L | P"
        },
        "service": {
          "id": "uuid",
          "serviceName": "string",
          "category": "CONSULTATION"
        },
        "visit": {
          "id": "uuid",
          "visitNumber": "V-20241224-1234567",
          "visitDate": "timestamp"
        }
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 2. Get Treatment by ID
**Endpoint:** `GET /api/doctor/treatments/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Detail treatment berhasil diambil",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "serviceId": "uuid",
    "performedBy": "uuid",
    "toothNumber": "string | null",
    "diagnosis": "string | null",
    "treatmentNotes": "string | null",
    "quantity": 1,
    "unitPrice": 500000,
    "discount": 0,
    "subtotal": 500000,
    "images": [],
    "createdAt": "timestamp",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202412-0001",
      "fullName": "string",
      "dateOfBirth": "date",
      "gender": "L | P",
      "phone": "string",
      "email": "string | null",
      "address": "string | null",
      "bloodType": "string | null",
      "allergies": "string | null",
      "medicalHistory": "string | null"
    },
    "service": {
      "id": "uuid",
      "serviceCode": "SRV-0001",
      "serviceName": "string",
      "category": "CONSULTATION",
      "description": "string | null",
      "basePrice": 500000,
      "commissionRate": 10.00,
      "durationMinutes": 30,
      "isActive": true
    },
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20241224-1234567",
      "visitDate": "timestamp",
      "patient": {
        "fullName": "string"
      }
    },
    "performer": {
      "id": "uuid",
      "fullName": "string",
      "specialization": "string | null"
    },
    "commissions": [
      {
        "id": "uuid",
        "commissionAmount": 50000,
        "status": "PENDING | PAID"
      }
    ]
  }
}
```

---

### 3. Get Treatments by Visit
**Endpoint:** `GET /api/doctor/treatments/visit/:visitId`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Daftar treatment berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "toothNumber": "string | null",
      "diagnosis": "string | null",
      "treatmentNotes": "string | null",
      "quantity": 1,
      "unitPrice": 500000,
      "discount": 0,
      "subtotal": 500000,
      "images": [],
      "createdAt": "timestamp",
      "service": {
        "id": "uuid",
        "serviceName": "string",
        "category": "CONSULTATION",
        "basePrice": 500000
      },
      "performer": {
        "id": "uuid",
        "fullName": "string",
        "specialization": "string | null"
      }
    }
  ]
}
```

---

### 4. Create Treatment
**Endpoint:** `POST /api/doctor/treatments`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "visitId": "uuid",
  "patientId": "uuid",
  "serviceId": "uuid",
  "toothNumber": "string (optional)",
  "diagnosis": "string (min: 10, optional)",
  "treatmentNotes": "string (optional)",
  "quantity": 1,
  "discount": 0,
  "images": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Treatment berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "serviceId": "uuid",
    "performedBy": "uuid",
    "toothNumber": "string | null",
    "diagnosis": "string | null",
    "treatmentNotes": "string | null",
    "quantity": 1,
    "unitPrice": 500000,
    "discount": 0,
    "subtotal": 500000,
    "images": [],
    "createdAt": "timestamp",
    "service": {},
    "performer": {
      "fullName": "string"
    }
  }
}
```

**Notes:**
- Automatically updates visit.totalCost
- Creates commission record for the doctor

---

### 5. Update Treatment
**Endpoint:** `PUT /api/doctor/treatments/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "toothNumber": "string (optional)",
  "diagnosis": "string (min: 10, optional)",
  "treatmentNotes": "string (min: 10, optional)",
  "quantity": 1,
  "discount": 0,
  "images": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Treatment berhasil diupdate",
  "data": {
    "id": "uuid",
    "toothNumber": "string | null",
    "diagnosis": "string | null",
    "treatmentNotes": "string | null",
    "quantity": 1,
    "unitPrice": 500000,
    "discount": 0,
    "subtotal": 500000,
    "images": [],
    "service": {},
    "patient": {
      "fullName": "string"
    }
  }
}
```

**Notes:**
- Only the doctor who performed the treatment can update it
- Automatically updates visit.totalCost and commission

---

### 6. Delete Treatment
**Endpoint:** `DELETE /api/doctor/treatments/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Treatment berhasil dihapus",
  "data": null
}
```

**Notes:**
- Only the doctor who performed the treatment can delete it
- Automatically updates visit.totalCost

---

### 7. Upload Treatment Images
**Endpoint:** `POST /api/doctor/treatments/upload-images`

**Headers:** 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Role Required:** `DOKTER`

**Request Body:**
- Form data with field `images` (max 5 files)
- Allowed types: JPEG, JPG, PNG, WEBP
- Max file size: 5MB each

**Response:**
```json
{
  "success": true,
  "message": "Gambar berhasil diupload",
  "data": {
    "images": [
      "/uploads/treatments/treatment-1234567890-123456789.jpg",
      "/uploads/treatments/treatment-1234567890-987654321.jpg"
    ]
  }
}
```

---

### 8. Get Visit with Treatments
**Endpoint:** `GET /api/doctor/treatments/visit/:visitId/full`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Data kunjungan berhasil diambil",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20241224-1234567",
    "visitDate": "timestamp",
    "queueNumber": 1,
    "status": "COMPLETED",
    "chiefComplaint": "string | null",
    "bloodPressure": "string | null",
    "notes": "string | null",
    "totalCost": 1000000,
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202412-0001",
      "medicalRecordNumber": "RM-202412-0001",
      "fullName": "string",
      "dateOfBirth": "date",
      "gender": "L | P",
      "phone": "string",
      "email": "string | null",
      "address": "string | null",
      "bloodType": "string | null",
      "allergies": "string | null",
      "medicalHistory": "string | null"
    },
    "nurse": {
      "id": "uuid",
      "fullName": "string"
    },
    "treatments": [
      {
        "id": "uuid",
        "toothNumber": "string | null",
        "diagnosis": "string | null",
        "treatmentNotes": "string | null",
        "quantity": 1,
        "unitPrice": 500000,
        "discount": 0,
        "subtotal": 500000,
        "images": [],
        "service": {
          "id": "uuid",
          "serviceName": "string",
          "category": "CONSULTATION"
        },
        "performer": {
          "id": "uuid",
          "fullName": "string",
          "specialization": "string | null"
        }
      }
    ]
  }
}
```

---

## Payment Management

### 1. Create Payment
**Endpoint:** `POST /api/payments`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "visitId": "uuid",
  "paymentMethod": "CASH | TRANSFER | CARD | QRIS",
  "amount": 1000000,
  "paidAmount": 1000000,
  "referenceNumber": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pembayaran berhasil dibuat",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "paymentNumber": "PAY-202412-0001",
    "paymentDate": "timestamp",
    "paymentMethod": "CASH",
    "amount": 1000000,
    "paidAmount": 1000000,
    "changeAmount": 0,
    "status": "PAID | PENDING | PARTIAL",
    "referenceNumber": "string | null",
    "notes": "string | null",
    "createdAt": "timestamp",
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20241224-1234567",
      "visitDate": "timestamp",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202412-0001",
        "medicalRecordNumber": "RM-202412-0001",
        "fullName": "string"
      }
    }
  }
}
```

**Notes:**
- Status automatically calculated based on paidAmount vs amount
- `changeAmount` automatically calculated

---

### 2. Update Payment
**Endpoint:** `PUT /api/payments/:id`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "paymentMethod": "CASH | TRANSFER | CARD | QRIS (optional)",
  "amount": 1000000,
  "paidAmount": 1000000,
  "referenceNumber": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:** Same as Create Payment

---

### 3. Get Payments by Visit
**Endpoint:** `GET /api/payments/visit/:visitId`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Daftar pembayaran berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "paymentNumber": "PAY-202412-0001",
      "paymentDate": "timestamp",
      "paymentMethod": "CASH",
      "amount": 1000000,
      "paidAmount": 1000000,
      "changeAmount": 0,
      "status": "PAID",
      "referenceNumber": "string | null",
      "notes": "string | null",
      "createdAt": "timestamp"
    }
  ]
}
```

---

### 4. Get All Payments
**Endpoint:** `GET /api/payments`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar pembayaran berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "paymentNumber": "PAY-202412-0001",
      "paymentDate": "timestamp",
      "paymentMethod": "CASH",
      "amount": 1000000,
      "paidAmount": 1000000,
      "changeAmount": 0,
      "status": "PAID",
      "referenceNumber": "string | null",
      "notes": "string | null",
      "createdAt": "timestamp",
      "visit": {
        "id": "uuid",
        "visitNumber": "V-20241224-1234567",
        "visitDate": "timestamp",
        "patient": {
          "id": "uuid",
          "patientNumber": "P-202412-0001",
          "medicalRecordNumber": "RM-202412-0001",
          "fullName": "string"
        }
      }
    }
  ]
}
```

---

### 5. Get Payment by ID
**Endpoint:** `GET /api/payments/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Detail pembayaran berhasil diambil",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "paymentNumber": "PAY-202412-0001",
    "paymentDate": "timestamp",
    "paymentMethod": "CASH",
    "amount": 1000000,
    "paidAmount": 1000000,
    "changeAmount": 0,
    "status": "PAID",
    "referenceNumber": "string | null",
    "notes": "string | null",
    "createdAt": "timestamp",
    "visit": {
      "id": "uuid",
      "visitNumber": "V-20241224-1234567",
      "visitDate": "timestamp",
      "patient": {
        "id": "uuid",
        "patientNumber": "P-202412-0001",
        "medicalRecordNumber": "RM-202412-0001",
        "fullName": "string",
        "dateOfBirth": "date",
        "gender": "L | P",
        "phone": "string",
        "email": "string | null",
        "address": "string | null",
        "bloodType": "string | null",
        "allergies": "string | null",
        "medicalHistory": "string | null"
      }
    }
  }
}
```

---

## Schedule Management

### 1. Get Schedules
**Endpoint:** `GET /api/doctor/schedules`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `type` (SHIFT | MEETING | ACTIVITY, optional)

**Response:**
```json
{
  "success": true,
  "message": "Jadwal berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "string",
      "description": "string | null",
      "scheduleType": "SHIFT | MEETING | ACTIVITY",
      "startDatetime": "timestamp",
      "endDatetime": "timestamp",
      "location": "string | null",
      "isRecurring": false,
      "recurrencePattern": "string | null",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### 2. Create Schedule
**Endpoint:** `POST /api/doctor/schedules`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "title": "string (min: 3)",
  "description": "string (optional)",
  "scheduleType": "SHIFT | MEETING | ACTIVITY",
  "startDatetime": "datetime (ISO format)",
  "endDatetime": "datetime (ISO format)",
  "location": "string (optional)",
  "isRecurring": false,
  "recurrencePattern": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Jadwal berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "string",
    "description": "string | null",
    "scheduleType": "SHIFT",
    "startDatetime": "timestamp",
    "endDatetime": "timestamp",
    "location": "string | null",
    "isRecurring": false,
    "recurrencePattern": "string | null",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Validation:**
- `endDatetime` must be after `startDatetime`

---

### 3. Get Activities
**Endpoint:** `GET /api/doctor/schedules/activities`

**Headers:** `Authorization: Bearer {token}`

**Response:** Same structure as Get Schedules, filtered by `scheduleType: ACTIVITY`

---

### 4. Get Meetings
**Endpoint:** `GET /api/doctor/schedules/meetings`

**Headers:** `Authorization: Bearer {token}`

**Response:** Same structure as Get Schedules, filtered by `scheduleType: MEETING`

---

## Leave Management

### 1. Get Leave Requests
**Endpoint:** `GET /api/doctor/leaves`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Daftar cuti berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "approvedBy": "uuid | null",
      "startDate": "date",
      "endDate": "date",
      "leaveType": "SICK | ANNUAL | EMERGENCY | UNPAID",
      "reason": "string",
      "status": "PENDING | APPROVED | REJECTED",
      "rejectionReason": "string | null",
      "approvedAt": "timestamp | null",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "approver": {
        "fullName": "string"
      } | null
    }
  ]
}
```

---

### 2. Create Leave Request
**Endpoint:** `POST /api/doctor/leaves`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "startDate": "date (ISO format)",
  "endDate": "date (ISO format)",
  "leaveType": "SICK | ANNUAL | EMERGENCY | UNPAID",
  "reason": "string (min: 10)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Pengajuan cuti berhasil",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "date",
    "endDate": "date",
    "leaveType": "ANNUAL",
    "reason": "string",
    "status": "PENDING",
    "createdAt": "timestamp"
  }
}
```

**Validation:**
- `endDate` must be >= `startDate`
- `reason` minimum 10 characters

**Notes:**
- For DOKTER role, status is automatically `APPROVED`
- For PERAWAT role, status is `PENDING` and requires doctor approval

---

## Commission Management

All commission endpoints require `DOKTER` role.

### 1. Get Commission Summary
**Endpoint:** `GET /api/doctor/finance/commissions/summary`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `month` (number 1-12, optional)
- `year` (number, optional)

**Response:**
```json
{
  "success": true,
  "message": "Summary komisi berhasil diambil",
  "data": {
    "total": 5000000,
    "byCategory": {
      "CONSULTATION": 2000000,
      "SCALING": 1500000,
      "FILLING": 1000000,
      "EXTRACTION": 500000
    },
    "commissions": [
      {
        "id": "uuid",
        "userId": "uuid",
        "treatmentId": "uuid",
        "baseAmount": 500000,
        "commissionRate": 10.00,
        "commissionAmount": 50000,
        "periodMonth": 12,
        "periodYear": 2024,
        "status": "PENDING | PAID",
        "paidAt": "timestamp | null",
        "notes": "string | null",
        "createdAt": "timestamp",
        "treatment": {
          "id": "uuid",
          "service": {
            "serviceName": "string",
            "category": "CONSULTATION"
          }
        }
      }
    ]
  }
}
```

---

### 2. Get Services Commission
**Endpoint:** `GET /api/doctor/finance/commissions/services`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `month` (number 1-12, optional)
- `year` (number, optional)

**Response:**
```json
{
  "success": true,
  "message": "Komisi layanan berhasil diambil",
  "data": {
    "category": "CONSULTATION",
    "total": 2000000,
    "commissions": [
      {
        "id": "uuid",
        "baseAmount": 500000,
        "commissionRate": 10.00,
        "commissionAmount": 50000,
        "periodMonth": 12,
        "periodYear": 2024,
        "status": "PENDING",
        "createdAt": "timestamp",
        "treatment": {
          "service": {
            "serviceName": "Konsultasi Umum",
            "category": "CONSULTATION"
          },
          "visit": {
            "visitNumber": "V-20241224-1234567",
            "patient": {
              "fullName": "string"
            }
          }
        }
      }
    ]
  }
}
```

---

### 3. Get Pharmacy Commission
**Endpoint:** `GET /api/doctor/finance/commissions/pharmacy`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `month` (number 1-12, optional)
- `year` (number, optional)

**Response:** Same structure as Get Services Commission, filtered by pharmacy-related services

---

### 4. Get Packages Commission
**Endpoint:** `GET /api/doctor/finance/commissions/packages`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `month` (number 1-12, optional)
- `year` (number, optional)

**Response:** Same structure as Get Services Commission, filtered by package services

---

### 5. Get Labs Commission
**Endpoint:** `GET /api/doctor/finance/commissions/labs`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `month` (number 1-12, optional)
- `year` (number, optional)

**Response:** Same structure as Get Services Commission, filtered by laboratory services

---

## Finance Management

All finance endpoints require `DOKTER` role.

### 1. Get Finance Reports
**Endpoint:** `GET /api/doctor/finance/reports`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Data laporan keuangan berhasil diambil",
  "data": {
    "reports": [
      {
        "id": "uuid",
        "userId": "uuid",
        "tipe": "string",
        "nama": "string",
        "prosedur": "string | null",
        "potongan": 0,
        "bhpHarga": 0,
        "bhpKomisi": 0,
        "farmasiHarga": 0,
        "farmasiKomisi": 0,
        "paketHarga": 0,
        "paketKomisi": 0,
        "labHarga": 0,
        "labKomisi": 0,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "total": {
      "potongan": 0,
      "bhpHarga": 0,
      "farmasiHarga": 0,
      "paketHarga": 0,
      "labHarga": 0
    }
  }
}
```

---

### 2. Create Finance Report
**Endpoint:** `POST /api/doctor/finance/reports`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "tipe": "string",
  "nama": "string",
  "prosedur": "string (optional)",
  "potongan": 0,
  "bhpHarga": 0,
  "bhpKomisi": 0,
  "farmasiHarga": 0,
  "farmasiKomisi": 0,
  "paketHarga": 0,
  "paketKomisi": 0,
  "labHarga": 0,
  "labKomisi": 0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Laporan keuangan berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "tipe": "string",
    "nama": "string",
    "prosedur": "string | null",
    "potongan": 0,
    "bhpHarga": 0,
    "bhpKomisi": 0,
    "farmasiHarga": 0,
    "farmasiKomisi": 0,
    "paketHarga": 0,
    "paketKomisi": 0,
    "labHarga": 0,
    "labKomisi": 0,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 3. Get Procedures
**Endpoint:** `GET /api/doctor/finance/procedures`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Data prosedur berhasil diambil",
  "data": {
    "procedures": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "string",
        "code": "string",
        "quantity": 1,
        "salePrice": 500000,
        "avgComm": 10.00,
        "totalSale": 500000,
        "totalComm": 50000,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "total": {
      "totalSale": 5000000,
      "totalComm": 500000
    }
  }
}
```

---

### 4. Create Procedure
**Endpoint:** `POST /api/doctor/finance/procedures`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "name": "string",
  "code": "string (unique)",
  "quantity": 1,
  "salePrice": 500000,
  "avgComm": "10.00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prosedur berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "string",
    "code": "string",
    "quantity": 1,
    "salePrice": 500000,
    "avgComm": 10.00,
    "totalSale": 500000,
    "totalComm": 50000,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Codes:**
- `400` - Kode prosedur sudah digunakan

---

### 5. Get Packages
**Endpoint:** `GET /api/doctor/finance/packages`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Data paket berhasil diambil",
  "data": {
    "packages": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "string",
        "sku": "string",
        "quantity": 1,
        "salePrice": 1000000,
        "avgComm": 15.00,
        "totalSale": 1000000,
        "totalComm": 150000,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "total": {
      "totalSale": 10000000,
      "totalComm": 1500000
    }
  }
}
```

---

### 6. Create Package
**Endpoint:** `POST /api/doctor/finance/packages`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "name": "string",
  "sku": "string (unique)",
  "quantity": 1,
  "salePrice": 1000000,
  "avgComm": "15.00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Paket berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "string",
    "sku": "string",
    "quantity": 1,
    "salePrice": 1000000,
    "avgComm": 15.00,
    "totalSale": 1000000,
    "totalComm": 150000,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Error Codes:**
- `400` - SKU sudah digunakan

---

## User Management

All user management endpoints require `DOKTER` role.

### 1. Get All Users
**Endpoint:** `GET /api/users`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Query Parameters:**
- `role` (DOKTER | PERAWAT, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar user berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "fullName": "string",
      "role": "DOKTER | PERAWAT",
      "phone": "string",
      "specialization": "string | null",
      "isActive": true,
      "createdAt": "timestamp"
    }
  ]
}
```

---

### 2. Get User by ID
**Endpoint:** `GET /api/users/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Detail user berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "DOKTER | PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "isActive": true,
    "createdAt": "timestamp",
    "_count": {
      "visitsAsNurse": 50,
      "treatmentsPerformed": 150,
      "schedules": 20,
      "leaveRequests": 5,
      "commissions": 100
    }
  }
}
```

---

### 3. Create User
**Endpoint:** `POST /api/users`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "username": "string (min: 3)",
  "email": "string (email)",
  "password": "string (min: 6)",
  "fullName": "string (min: 3)",
  "phone": "string (min: 10)",
  "role": "DOKTER | PERAWAT",
  "specialization": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "isActive": true,
    "createdAt": "timestamp"
  }
}
```

**Error Codes:**
- `400` - Username atau email sudah terdaftar

---

### 4. Update User
**Endpoint:** `PUT /api/users/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "fullName": "string (min: 3, optional)",
  "phone": "string (min: 10, optional)",
  "specialization": "string (optional)",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "isActive": true,
    "updatedAt": "timestamp"
  }
}
```

---

### 5. Delete User
**Endpoint:** `DELETE /api/users/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "User berhasil dihapus",
  "data": null
}
```

---

### 6. Toggle User Status
**Endpoint:** `PATCH /api/users/:id/toggle-status`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Status user berhasil diubah",
  "data": {
    "id": "uuid",
    "username": "string",
    "fullName": "string",
    "isActive": false
  }
}
```

---

### 7. Get User Profile
**Endpoint:** `GET /api/users/profile`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "DOKTER",
    "phone": "string",
    "specialization": "string | null",
    "education": "string | null",
    "experience": "string | null",
    "sipNumber": "string | null",
    "sipStartDate": "date | null",
    "sipEndDate": "date | null",
    "profilePhoto": "string | null",
    "isActive": true,
    "createdAt": "timestamp"
  }
}
```

---

### 8. Update User Profile
**Endpoint:** `PUT /api/users/profile`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "fullName": "string (min: 3, optional)",
  "email": "string (email, optional)",
  "phone": "string (min: 10, optional)",
  "specialization": "string (optional)",
  "education": "string (optional)",
  "experience": "string (optional)",
  "sipNumber": "string (optional)",
  "sipStartDate": "date (ISO format, optional)",
  "sipEndDate": "date (ISO format, optional)",
  "profilePhoto": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "DOKTER",
    "phone": "string",
    "specialization": "string | null",
    "education": "string | null",
    "experience": "string | null",
    "sipNumber": "string | null",
    "sipStartDate": "date | null",
    "sipEndDate": "date | null",
    "profilePhoto": "string | null",
    "isActive": true,
    "updatedAt": "timestamp"
  }
}
```

**Error Codes:**
- `400` - Email sudah digunakan

---

### 9. Delete Account
**Endpoint:** `DELETE /api/users/account`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Akun berhasil dihapus",
  "data": null
}
```

---

## Nurse Profile Management

All nurse profile endpoints require `PERAWAT` role.

### 1. Get Nurse Profile
**Endpoint:** `GET /api/nurse/profile`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "education": "string | null",
    "experience": "string | null",
    "sipNumber": "string | null",
    "sipStartDate": "date | null",
    "sipEndDate": "date | null",
    "profilePhoto": "string | null",
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 2. Update Nurse Profile
**Endpoint:** `PUT /api/nurse/profile`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Request Body:**
```json
{
  "fullName": "string (min: 3, optional)",
  "email": "string (email, optional)",
  "phone": "string (min: 10, optional)",
  "specialization": "string (optional)",
  "education": "string (optional)",
  "experience": "string (optional)",
  "sipNumber": "string (optional)",
  "sipStartDate": "date (ISO format, optional)",
  "sipEndDate": "date (ISO format, optional)",
  "profilePhoto": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profil berhasil diupdate",
  "data": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "fullName": "string",
    "role": "PERAWAT",
    "phone": "string",
    "specialization": "string | null",
    "education": "string | null",
    "experience": "string | null",
    "sipNumber": "string | null",
    "sipStartDate": "date | null",
    "sipEndDate": "date | null",
    "profilePhoto": "string | null",
    "isActive": true,
    "updatedAt": "timestamp"
  }
}
```

---

### 3. Get Profile Completion
**Endpoint:** `GET /api/nurse/profile/completion`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Kelengkapan profil berhasil diambil",
  "data": {
    "percentage": 80,
    "filledFields": 8,
    "totalFields": 10,
    "missingFields": 2
  }
}
```

---

### 4. Get Current Shift Status
**Endpoint:** `GET /api/nurse/profile/shift-status`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Status shift berhasil diambil",
  "data": {
    "status": "On Duty | Off Duty",
    "shift": {
      "patientName": "string",
      "complaint": "string",
      "startTime": "08:00",
      "endTime": "08:30",
      "location": "POLADC"
    } | null,
    "remainingTime": {
      "hours": 0,
      "minutes": 25,
      "formatted": "25 menit"
    } | null
  }
}
```

---

### 5. Get Account Status
**Endpoint:** `GET /api/nurse/profile/account-status`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Status akun berhasil diambil",
  "data": {
    "isActive": true,
    "isVerified": true,
    "completionPercentage": 80,
    "shiftStatus": "On Duty"
  }
}
```

---

### 6. Get License Info
**Endpoint:** `GET /api/nurse/profile/license`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Informasi lisensi berhasil diambil",
  "data": {
    "hasLicense": true,
    "sipNumber": "SIP-12345",
    "startDate": "2023-01-01",
    "endDate": "2026-01-01",
    "status": "ACTIVE | EXPIRED | EXPIRING_SOON",
    "remaining": {
      "percentage": 75,
      "years": 2,
      "months": 3,
      "days": 730,
      "formatted": "2 tahun 3 bulan"
    }
  }
}
```

---

### 7. Delete Nurse Account
**Endpoint:** `DELETE /api/nurse/account`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Akun berhasil dihapus",
  "data": null
}
```

---

## Calendar Management

### 1. Get All Leave Requests
**Endpoint:** `GET /api/calendar/leaves`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "approvedBy": "uuid | null",
      "startDate": "date",
      "endDate": "date",
      "leaveType": "SICK | ANNUAL | EMERGENCY | UNPAID",
      "reason": "string",
      "status": "PENDING | APPROVED | REJECTED",
      "rejectionReason": "string | null",
      "approvedAt": "timestamp | null",
      "createdAt": "timestamp",
      "updatedAt": "timestamp",
      "requester": {
        "id": "uuid",
        "fullName": "string",
        "email": "string",
        "role": "PERAWAT"
      },
      "approver": {
        "id": "uuid",
        "fullName": "string",
        "email": "string"
      } | null
    }
  ]
}
```

---

### 2. Get My Leave Requests
**Endpoint:** `GET /api/calendar/my-leaves`

**Headers:** `Authorization: Bearer {token}`

**Response:** Same structure as Get All Leave Requests, filtered by current user

---

### 3. Get Pending Leave Requests
**Endpoint:** `GET /api/calendar/pending-leaves`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "startDate": "date",
      "endDate": "date",
      "leaveType": "ANNUAL",
      "reason": "string",
      "status": "PENDING",
      "createdAt": "timestamp",
      "requester": {
        "id": "uuid",
        "fullName": "string",
        "email": "string",
        "role": "PERAWAT"
      }
    }
  ]
}
```

**Notes:**
- Only returns PENDING leaves from PERAWAT users

---

### 4. Create Leave Request
**Endpoint:** `POST /api/calendar/leave`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "startDate": "date (ISO format)",
  "endDate": "date (ISO format)",
  "leaveType": "SICK | ANNUAL | EMERGENCY | UNPAID",
  "reason": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "date",
    "endDate": "date",
    "leaveType": "ANNUAL",
    "reason": "string",
    "status": "PENDING | APPROVED",
    "approvedBy": "uuid | null",
    "approvedAt": "timestamp | null",
    "createdAt": "timestamp",
    "requester": {
      "id": "uuid",
      "fullName": "string",
      "email": "string",
      "role": "PERAWAT"
    },
    "approver": null
  },
  "message": "Pengajuan cuti berhasil dibuat"
}
```

**Notes:**
- For DOKTER: auto-approved
- For PERAWAT: status PENDING

---

### 5. Update Leave Request
**Endpoint:** `PUT /api/calendar/leave/:id`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "startDate": "date (ISO format, optional)",
  "endDate": "date (ISO format, optional)",
  "leaveType": "SICK | ANNUAL | EMERGENCY | UNPAID (optional)",
  "reason": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "date",
    "endDate": "date",
    "leaveType": "ANNUAL",
    "reason": "string",
    "status": "PENDING",
    "createdAt": "timestamp",
    "updatedAt": "timestamp",
    "requester": {
      "id": "uuid",
      "fullName": "string",
      "email": "string",
      "role": "PERAWAT"
    }
  },
  "message": "Pengajuan cuti berhasil diubah"
}
```

**Validation:**
- Only requester can update
- Only PENDING leaves can be updated

---

### 6. Delete Leave Request
**Endpoint:** `DELETE /api/calendar/leave/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Pengajuan cuti berhasil dihapus"
}
```

**Validation:**
- Only requester can delete
- Only PENDING leaves can be deleted

---

### 7. Approve Leave Request
**Endpoint:** `POST /api/calendar/leave/:id/approve`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "date",
    "endDate": "date",
    "leaveType": "ANNUAL",
    "reason": "string",
    "status": "APPROVED",
    "approvedBy": "uuid",
    "approvedAt": "timestamp",
    "requester": {
      "id": "uuid",
      "fullName": "string",
      "email": "string",
      "role": "PERAWAT"
    },
    "approver": {
      "id": "uuid",
      "fullName": "string",
      "email": "string"
    }
  },
  "message": "Pengajuan cuti [requester name] berhasil disetujui"
}
```

**Validation:**
- Only DOKTER can approve
- Only PENDING leaves can be approved

---

### 8. Reject Leave Request
**Endpoint:** `POST /api/calendar/leave/:id/reject`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "rejectionReason": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "startDate": "date",
    "endDate": "date",
    "leaveType": "ANNUAL",
    "reason": "string",
    "status": "REJECTED",
    "rejectionReason": "string",
    "approvedBy": "uuid",
    "approvedAt": "timestamp",
    "requester": {
      "id": "uuid",
      "fullName": "string",
      "email": "string",
      "role": "PERAWAT"
    },
    "approver": {
      "id": "uuid",
      "fullName": "string",
      "email": "string"
    }
  },
  "message": "Pengajuan cuti [requester name] berhasil ditolak"
}
```

**Validation:**
- Only DOKTER can reject
- Only PENDING leaves can be rejected
- Rejection reason is required

---

### 9. Get Calendar Events
**Endpoint:** `GET /api/calendar/events`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `startDate` (ISO date, required)
- `endDate` (ISO date, required)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Cuti - John Doe",
      "description": "Cuti tahunan",
      "startDate": "2024-12-24",
      "endDate": "2024-12-26",
      "startTime": "00:00",
      "endTime": "23:59",
      "type": "LEAVE",
      "status": "APPROVED",
      "userId": "uuid",
      "userName": "John Doe",
      "patientName": null,
      "color": "bg-yellow-100"
    },
    {
      "id": "uuid",
      "title": "Kunjungan - Jane Smith",
      "description": "Sakit gigi",
      "startDate": "2024-12-24",
      "endDate": "2024-12-24",
      "startTime": "09:00",
      "endTime": "09:30",
      "type": "VISIT",
      "status": "WAITING",
      "patientName": "Jane Smith",
      "userName": "John Doe",
      "color": "bg-blue-100"
    }
  ]
}
```

**Notes:**
- Combines approved leaves and visits in date range
- Leave events span full days (00:00-23:59)
- Visit events have specific time slots (30min duration)

---

### 10. Get My Calendar Events
**Endpoint:** `GET /api/calendar/my-events`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `startDate` (ISO date, required)
- `endDate` (ISO date, required)

**Response:** Same structure as Get Calendar Events, filtered by current user

---

## Medication Management

### 1. Get Medications by Visit
**Endpoint:** `GET /api/medications/visit/:visitId`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Daftar obat berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "visitId": "uuid",
      "patientId": "uuid",
      "name": "string",
      "quantity": "string",
      "instructions": "string | null",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

### 2. Create Medication
**Endpoint:** `POST /api/medications`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "visitId": "uuid",
  "patientId": "uuid",
  "name": "string",
  "quantity": "string",
  "instructions": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Obat berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "name": "string",
    "quantity": "string",
    "instructions": "string | null",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 3. Update Medication
**Endpoint:** `PUT /api/medications/:id`

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "name": "string (optional)",
  "quantity": "string (optional)",
  "instructions": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Obat berhasil diupdate",
  "data": {
    "id": "uuid",
    "visitId": "uuid",
    "patientId": "uuid",
    "name": "string",
    "quantity": "string",
    "instructions": "string | null",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 4. Delete Medication
**Endpoint:** `DELETE /api/medications/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Obat berhasil dihapus",
  "data": null
}
```

---

## Nurse Visit Management

### Get Visit by Medical Record (Nurse)
**Endpoint:** `GET /api/nurse/visits/medical-record/:medicalRecordNumber`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `PERAWAT`

**Response:**
```json
{
  "success": true,
  "message": "Berhasil mengambil data kunjungan",
  "data": {
    "id": "uuid",
    "visitNumber": "V-20241224-1234567",
    "visitDate": "timestamp",
    "queueNumber": 1,
    "status": "COMPLETED",
    "chiefComplaint": "string | null",
    "bloodPressure": "string | null",
    "notes": "string | null",
    "totalCost": 1000000,
    "createdAt": "timestamp",
    "patient": {
      "id": "uuid",
      "patientNumber": "P-202412-0001",
      "medicalRecordNumber": "RM-202412-0001",
      "fullName": "string",
      "dateOfBirth": "date",
      "gender": "L | P",
      "address": "string | null",
      "phone": "string",
      "email": "string | null",
      "allergies": "string | null",
      "medicalHistory": "string | null"
    },
    "treatments": [
      {
        "id": "uuid",
        "toothNumber": "string | null",
        "diagnosis": "string | null",
        "treatmentNotes": "string | null",
        "quantity": 1,
        "unitPrice": 500000,
        "discount": 0,
        "subtotal": 500000,
        "images": [],
        "createdAt": "timestamp",
        "service": {
          "serviceName": "string",
          "category": "CONSULTATION"
        },
        "performer": {
          "fullName": "string",
          "role": "DOKTER"
        }
      }
    ],
    "medications": [
      {
        "id": "uuid",
        "name": "string",
        "quantity": "string",
        "instructions": "string | null",
        "createdAt": "timestamp"
      }
    ]
  }
}
```

**Notes:**
- Returns most recent COMPLETED visit for the medical record number
- Includes full patient details, treatments, and medications

---

## AI Services

### 1. Get Prediction
**Endpoint:** `GET /api/ai/predict`

**Headers:** None required

**Response:**
```json
{
  "status": "success",
  "message": "Prediksi berhasil",
  "data": [
    {
      "date": "2024-12-24",
      "predicted_visits": 15,
      "confidence": 0.85
    }
  ]
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Layanan prediksi sedang tidak tersedia. Pastikan AI Service berjalan di http://localhost:8000",
  "data": []
}
```

**Error Codes:**
- `503` - AI Service tidak tersedia
- `504` - Request timeout

**Notes:**
- Connects to Python AI Service at `http://localhost:8000`
- Timeout: 30 seconds

---

### 2. Chat with Tika (AI Assistant)
**Endpoint:** `POST /api/ai/chat`

**Headers:** None required

**Request Body:**
```json
{
  "message": "string (required)",
  "user_name": "string (optional, default: 'User')"
}
```

**Response:**
```json
{
  "status": "success",
  "reply": "Halo! Ada yang bisa saya bantu?",
  "timestamp": "timestamp"
}
```

**Error Response:**
```json
{
  "status": "error",
  "reply": "Maaf, Tika sedang offline. Pastikan AI Service berjalan di http://localhost:8000"
}
```

**Error Codes:**
- `400` - Pesan tidak boleh kosong
- `503` - AI Service tidak tersedia
- `504` - Request timeout

**Notes:**
- Connects to Python AI Service at `http://localhost:8000`
- Timeout: 15 seconds
- Tika is an AI chatbot assistant for the clinic

---

## Service Management

### 1. Get All Services
**Endpoint:** `GET /api/services` (Note: Not under /doctor or /nurse)

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `category` (CONSULTATION | SCALING | FILLING | EXTRACTION | WHITENING | ORTHODONTIC | OTHER, optional)
- `search` (string, optional)

**Response:**
```json
{
  "success": true,
  "message": "Daftar layanan berhasil diambil",
  "data": {
    "services": [
      {
        "id": "uuid",
        "serviceCode": "SRV-0001",
        "serviceName": "string",
        "category": "CONSULTATION",
        "description": "string | null",
        "basePrice": 500000,
        "commissionRate": 10.00,
        "durationMinutes": 30,
        "isActive": true,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 50,
      "totalPages": 2
    }
  }
}
```

---

### 2. Get Service by ID
**Endpoint:** `GET /api/services/:id`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Detail layanan berhasil diambil",
  "data": {
    "id": "uuid",
    "serviceCode": "SRV-0001",
    "serviceName": "string",
    "category": "CONSULTATION",
    "description": "string | null",
    "basePrice": 500000,
    "commissionRate": 10.00,
    "durationMinutes": 30,
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 3. Create Service
**Endpoint:** `POST /api/services`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "serviceName": "string",
  "category": "CONSULTATION | SCALING | FILLING | EXTRACTION | WHITENING | ORTHODONTIC | OTHER",
  "basePrice": 500000,
  "commissionRate": 10.00,
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Layanan berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "serviceCode": "SRV-0001",
    "serviceName": "string",
    "category": "CONSULTATION",
    "description": "string | null",
    "basePrice": 500000,
    "commissionRate": 10.00,
    "durationMinutes": null,
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

**Notes:**
- Service code is auto-generated (SRV-XXXX)

---

### 4. Update Service
**Endpoint:** `PUT /api/services/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Request Body:**
```json
{
  "serviceName": "string (optional)",
  "category": "CONSULTATION | ... (optional)",
  "basePrice": 500000,
  "commissionRate": 10.00,
  "description": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Layanan berhasil diupdate",
  "data": {
    "id": "uuid",
    "serviceCode": "SRV-0001",
    "serviceName": "string",
    "category": "CONSULTATION",
    "description": "string | null",
    "basePrice": 500000,
    "commissionRate": 10.00,
    "durationMinutes": null,
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

### 5. Delete Service
**Endpoint:** `DELETE /api/services/:id`

**Headers:** `Authorization: Bearer {token}`

**Role Required:** `DOKTER`

**Response:**
```json
{
  "success": true,
  "message": "Layanan berhasil dihapus",
  "data": null
}
```
