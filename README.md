# Smart ERP

A full-stack Enterprise Resource Planning (ERP) web application built with Next.js, Express.js, PostgreSQL, and JWT Authentication. The application enables businesses to manage companies, customers, suppliers, inventory, purchases, and sales through a secure and intuitive interface.

---

## Features

### Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes

### Company Management
- Create Company
- Company Selection
- Company Dashboard

### Ledger Management
- Customer Management
- Supplier Management
- Stock Group Management
- Unit Management
- Stock Item Management

### Voucher Management
- Purchase Entry
- Sales Entry

---

## Tech Stack

### Frontend
- Next.js 15
- React.js
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- PostgreSQL (Supabase)

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

---

## Project Structure

```
smart-erp/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── config/
│   └── package.json
│
└── README.md
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/sowjithchinnu/smart-erp.git
cd smart-erp
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
PORT=10000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## Live Demo

**Frontend**
```
https://smart-erp-beryl.vercel.app
```


---

## Workflow

1. Register a new account.
2. Login using your credentials.
3. Create a company.
4. Select the company.
5. Manage:
   - Customers
   - Suppliers
   - Stock Groups
   - Units
   - Stock Items
6. Record Purchase and Sales entries.

---

## API Modules

- Authentication
- Company
- Customer
- Supplier
- Stock Group
- Unit
- Stock Item
- Purchase
- Sales

---

## Security

- Password hashing using bcrypt
- JWT-based authentication
- Protected backend routes
- Environment variables for sensitive credentials

---

## Future Enhancements

- Role-Based Access Control (RBAC)
- GST Reports
- Invoice Generation (PDF)
- Dashboard Analytics
- Excel Import/Export
- Audit Logs
- Multi-user Permissions

---

## Author

**Sowjith N**

Electronics and Communication Engineering  
IIIT Dharwad

GitHub: https://github.com/sowjithchinnu

---

## License

This project is developed for educational and internship purposes.
