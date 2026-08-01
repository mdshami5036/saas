# AutoPrint SaaS - REST & Realtime API Documentation

All requests use JSON payload format unless uploading FormData files.

Base API Endpoint: `https://api.yourdomain.com/api/v1`

---

## 1. Authentication Endpoints

### Register Cyber Cafe Account
`POST /auth/register`
```json
{
  "name": "Shami Cyber Hub",
  "email": "shami@example.com",
  "password": "password123",
  "phone": "9876543210",
  "bwPricePerPage": 2.0,
  "colorPricePerPage": 10.0
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "credentials": {
    "id": "uuid-v4",
    "name": "Shami Cyber Hub",
    "slug": "shami-cyber-hub-a8f3",
    "websiteUrl": "https://print.yourdomain.com/cafe/shami-cyber-hub-a8f3",
    "backendApiUrl": "https://api.yourdomain.com/api/v1",
    "apiKey": "pk_xxxxxxxx",
    "agentToken": "ag_xxxxxxxx",
    "qrCodeUrl": "data:image/png;base64,..."
  }
}
```

### Cyber Cafe Login
`POST /auth/login`
```json
{
  "email": "shami@example.com",
  "password": "password123"
}
```

---

## 2. Customer Public Endpoints (`/public`)

### Fetch Cyber Cafe Details
`GET /public/cafe/:slug/info`

### Upload PDF Document
`POST /public/upload`
- Content-Type: `multipart/form-data`
- Body: `pdf` (File)

**Response:**
```json
{
  "success": true,
  "file": {
    "originalName": "Document.pdf",
    "fileName": "print-1718000000-123.pdf",
    "totalPages": 5
  }
}
```

### Create Razorpay Payment Order
`POST /public/create-order?slug=:slug`
```json
{
  "customerName": "Rahul Sharma",
  "customerPhone": "9876543210",
  "fileName": "print-1718000000-123.pdf",
  "originalName": "Document.pdf",
  "totalPages": 5,
  "pagesToPrint": "1-3,5",
  "copies": 2,
  "colorMode": "BW"
}
```

### Verify Razorpay Payment
`POST /public/verify-payment`
```json
{
  "jobId": "job-uuid",
  "razorpayOrderId": "order_123",
  "razorpayPaymentId": "pay_123",
  "razorpaySignature": "signature_hex"
}
```

---

## 3. Print Agent Communication (`/agent` + Socket.IO)

### WebSocket Connection
- URL: `wss://api.yourdomain.com`
- Handshake Query Params: `agentToken`, `deviceId`, `hardwareHash`

### Socket Events
- **Server -> Agent**: `job:new_print` (payload: `jobId`, `downloadUrl`, `pagesToPrint`, `copies`, `colorMode`)
- **Agent -> Server**: `agent:printers` (payload: `printers`, `selectedPrinter`)
- **Agent -> Server**: `job:status_update` (payload: `jobId`, `status`: `PRINTING` | `COMPLETED` | `FAILED` | `PRINTER_OFFLINE`)

### HTTP Long-Polling Fallback
- `GET /agent/poll` (Headers: `X-Agent-Token`)
- `POST /agent/jobs/:id/status` (Headers: `X-Agent-Token`)
