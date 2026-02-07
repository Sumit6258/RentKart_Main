# 🏠 Rentkart - Smart Rental Marketplace

<div align="center">
  <img src="assets/rentkart-logo.png" alt="Rentkart Logo" width="200"/>
  
  ### *Rent Smart. Live Better.*
  
  [![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat&logo=angular)](https://angular.io/)
  [![Django](https://img.shields.io/badge/Django-5.0-092E20?style=flat&logo=django)](https://www.djangoproject.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python)](https://www.python.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
  
  **India's fastest-growing rental marketplace for electronics, furniture, appliances, and vehicles.**
  
  [Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)
  
</div>

---

## 📖 Introduction

**Rentkart** is a full-stack, production-ready rental marketplace platform that connects customers with verified vendors across India. Built with modern technologies and designed for scalability, Rentkart makes renting as simple as shopping online.

Whether you need a camera for the weekend, furniture for your apartment, or equipment for a project, Rentkart provides a trusted platform where you can:
- Browse thousands of verified products
- Book rentals instantly with secure payments
- Track your rentals in real-time
- Manage everything from a powerful dashboard

For vendors, Rentkart offers a complete business management suite to list products, track earnings, and manage incoming rental requests—all from a dedicated vendor portal.

---

## 🎯 Objective

The rental economy is growing exponentially, yet most people still face challenges accessing quality products temporarily. Rentkart solves this by:

- **Making Premium Products Accessible**: Rent high-quality items at a fraction of the purchase cost
- **Empowering Vendors**: Helping individuals and businesses monetize idle assets
- **Building Trust**: Through verified vendors, secure payments, and transparent processes
- **Promoting Sustainability**: Reducing waste by encouraging shared consumption
- **Streamlining Operations**: Providing enterprise-grade tools for rental management

Our mission is to democratize access to products and create a sustainable sharing economy that benefits everyone.

---

## ✨ Key Features

### 🛒 Customer Features

- **Smart Product Discovery**
  - Advanced search with filters (category, location, price)
  - Featured products and trending rentals
  - Category-wise browsing (Electronics, Furniture, Appliances, Vehicles)
  - Product details with high-quality images

- **Seamless Rental Experience**
  - Instant booking with flexible rental periods (daily, weekly, monthly)
  - Real-time availability checking
  - Security deposit management with full refund guarantee
  - Rental duration calculator with transparent pricing

- **Comprehensive Dashboard**
  - Live rental overview with active/completed/pending status
  - Rental progress tracking with visual indicators
  - Days remaining countdown for active rentals
  - Rental history with detailed analytics

- **Payment & Invoicing**
  - Secure simulated payment processing (card, UPI, net banking)
  - Automated invoice generation with GST breakdown
  - PDF invoice download with professional formatting
  - Transaction history and payment receipts

- **Profile Management**
  - Personal information management
  - Profile picture upload/remove
  - Multiple delivery address management
  - Google Maps autocomplete for address entry
  - Set default addresses for quick checkout

### 🏪 Vendor Features

- **Dedicated Vendor Portal**
  - Isolated dashboard with vendor-specific UI
  - Role-based access control (vendors cannot access customer features)
  - Real-time business metrics and earnings tracking

- **Product Management**
  - Add products with image upload and detailed specifications
  - Edit product details, pricing, and inventory
  - Toggle product availability (show/hide from marketplace)
  - Delete products with confirmation
  - Category selection and product organization

- **Rental Operations**
  - View incoming rental requests with customer details
  - Track active rentals per product
  - Monitor rental durations and return dates
  - Rental status updates

- **Business Analytics**
  - Total earnings dashboard
  - Active rentals count
  - Product performance metrics
  - Pending rental requests overview

### 🔐 Admin Features

- **Secure Admin Access**
  - Hidden admin login URL (`/admin-login`)
  - Separate authentication flow
  - Superuser-level permissions

- **Complete Platform Control**
  - User management (customers, vendors, admins)
  - Block/activate user accounts
  - Role-based user filtering

- **Content Management**
  - Category CRUD operations
  - Product CRUD with image management
  - Bulk product operations

- **Operations Dashboard**
  - System-wide statistics (users, products, rentals, revenue)
  - Rental monitoring and status updates
  - Payment transaction logs
  - Vendor verification and approval

### 🚀 Platform Features

- **Advanced Authentication**
  - JWT-based stateless authentication
  - Token refresh mechanism
  - Role-based route guards (Customer/Vendor/Admin isolation)
  - Secure password hashing

- **Responsive Design**
  - Mobile-first approach
  - Tailwind CSS utility-first styling
  - Modern UI with smooth animations
  - Professional gradient backgrounds and card designs

- **Developer Experience**
  - RESTful API architecture
  - Comprehensive error handling
  - Toast notifications for user feedback
  - Loading states and shimmer effects
  - Form validation with instant feedback

- **Integrations**
  - Google Maps API for address autocomplete
  - Interactive maps with draggable markers
  - PDF generation with ReportLab
  - Email notifications (configurable)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 18.x | Progressive web framework |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.x | Utility-first styling |
| **RxJS** | 7.x | Reactive programming |
| **Angular Router** | 18.x | Client-side routing |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Django** | 5.0 | Python web framework |
| **Django REST Framework** | 3.14 | RESTful API development |
| **Django CORS Headers** | 4.x | Cross-origin requests |
| **SimpleJWT** | 5.x | JWT authentication |
| **Pillow** | 10.x | Image processing |
| **ReportLab** | 4.x | PDF generation |

### Database

- **PostgreSQL** (Production) - Robust relational database
- **SQLite** (Development) - Lightweight local database

### Additional Tools

- **Google Maps API** - Address autocomplete and geocoding
- **Gunicorn** - WSGI HTTP server for production
- **WhiteNoise** - Static file serving

---

## 🏗️ System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Angular Frontend (SPA)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Customer   │  │   Vendor    │  │    Admin    │         │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│         │                │                 │                 │
│         └────────────────┴─────────────────┘                 │
│                          │                                   │
│                   HTTP/REST API                              │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                ┌──────────▼──────────┐
                │  Django REST API    │
                │  ┌───────────────┐  │
                │  │ Authentication│  │
                │  │   (JWT)       │  │
                │  └───────────────┘  │
                │  ┌───────────────┐  │
                │  │ Products API  │  │
                │  └───────────────┘  │
                │  ┌───────────────┐  │
                │  │ Rentals API   │  │
                │  └───────────────┘  │
                │  ┌───────────────┐  │
                │  │ Payments API  │  │
                │  └───────────────┘  │
                └──────────┬──────────┘
                           │
                ┌──────────▼──────────┐
                │   PostgreSQL DB     │
                │  ┌───────────────┐  │
                │  │ Users         │  │
                │  │ Products      │  │
                │  │ Subscriptions │  │
                │  │ Payments      │  │
                │  │ Invoices      │  │
                │  └───────────────┘  │
                └─────────────────────┘
```

**Architecture Highlights:**
- **Separation of Concerns**: Frontend and backend are completely decoupled
- **RESTful Design**: Stateless API with JWT authentication
- **Role-Based Access**: Three distinct user roles with isolated dashboards
- **Scalable**: Horizontal scaling possible for both frontend and backend
- **Modern Stack**: Industry-standard technologies used throughout

---

## 📁 Project Structure
```
rentkart/
│
├── backend/                          # Django REST API
│   ├── rentkart/                     # Project settings
│   │   ├── settings.py              # Django configuration
│   │   ├── urls.py                  # Main URL routing
│   │   └── wsgi.py                  # WSGI entry point
│   │
│   ├── users/                        # User management app
│   │   ├── models.py                # Custom User model
│   │   ├── views.py                 # Auth & profile APIs
│   │   ├── serializers.py           # User serialization
│   │   └── urls.py                  # User routes
│   │
│   ├── products/                     # Product management app
│   │   ├── models.py                # Product & Category models
│   │   ├── views.py                 # Product CRUD APIs
│   │   ├── serializers.py           # Product serialization
│   │   └── urls.py                  # Product routes
│   │
│   ├── customers/                    # Customer app
│   │   ├── models.py                # Address model
│   │   ├── views.py                 # Customer profile APIs
│   │   └── urls.py                  # Customer routes
│   │
│   ├── subscriptions/                # Rental management app
│   │   ├── models.py                # Subscription model
│   │   ├── views.py                 # Rental APIs
│   │   └── urls.py                  # Subscription routes
│   │
│   ├── payments/                     # Payment processing app
│   │   ├── models.py                # Payment & Invoice models
│   │   ├── views.py                 # Payment & invoice APIs
│   │   ├── invoice_generator.py    # PDF generation logic
│   │   └── urls.py                  # Payment routes
│   │
│   ├── media/                        # Uploaded files (images)
│   ├── manage.py                    # Django management script
│   └── requirements.txt             # Python dependencies
│
├── frontend/                         # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # Core services & guards
│   │   │   │   ├── guards/         # Route guards
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── role.guard.ts
│   │   │   │   ├── services/       # Business logic services
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── product.service.ts
│   │   │   │   │   ├── toast.service.ts
│   │   │   │   │   └── google-maps.service.ts
│   │   │   │   └── interceptors/   # HTTP interceptors
│   │   │   │       └── auth.interceptor.ts
│   │   │   │
│   │   │   ├── features/           # Feature modules
│   │   │   │   ├── home/          # Landing page
│   │   │   │   ├── auth/          # Login & register
│   │   │   │   ├── products/      # Product listing & detail
│   │   │   │   ├── dashboard/     # Customer dashboard
│   │   │   │   ├── vendor/        # Vendor portal
│   │   │   │   ├── admin/         # Admin panel
│   │   │   │   └── rent/          # Rental booking flow
│   │   │   │
│   │   │   ├── shared/            # Shared components & pipes
│   │   │   │   ├── components/
│   │   │   │   └── pipes/
│   │   │   │       └── currency.pipe.ts
│   │   │   │
│   │   │   ├── app.component.ts   # Root component
│   │   │   └── app.routes.ts      # Route configuration
│   │   │
│   │   ├── environments/           # Environment configs
│   │   │   ├── environment.ts     # Development
│   │   │   └── environment.prod.ts # Production
│   │   │
│   │   └── assets/                # Static assets
│   │
│   ├── angular.json               # Angular configuration
│   ├── package.json              # Node dependencies
│   ├── tailwind.config.js        # Tailwind CSS config
│   └── tsconfig.json             # TypeScript config
│
└── README.md                      # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **PostgreSQL**: 14.x or higher (optional, SQLite works for development)

### Backend Setup

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/rentkart.git
   cd rentkart/backend
```

2. **Create virtual environment**
```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
```

3. **Install dependencies**
```bash
   pip install -r requirements.txt
```

4. **Environment configuration**
```bash
   cp .env.example .env
   # Edit .env with your settings
```

5. **Run migrations**
```bash
   python manage.py makemigrations
   python manage.py migrate
```

6. **Create superuser (admin)**
```bash
   python manage.py createsuperuser
```

7. **Load sample data (optional)**
```bash
   python manage.py loaddata fixtures/sample_data.json
```

8. **Run development server**
```bash
   python manage.py runserver
```

   Backend will be available at: `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
   cd ../frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Environment configuration**
```bash
   # Update src/environments/environment.ts with your API URL
```

4. **Start development server**
```bash
   npm start
   # or
   ng serve
```

   Frontend will be available at: `http://localhost:4200`

### Google Maps API Setup (Optional)

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Add to `frontend/src/index.html`:
```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Homepage
![Homepage](screenshots/homepage.png)
*Modern landing page with real-time stats and featured products*

### 📊 Customer Dashboard
![Customer Dashboard](screenshots/customer-dashboard.png)
*Comprehensive rental management with progress tracking*

### 🏪 Vendor Portal
![Vendor Portal](screenshots/vendor-dashboard.png)
*Dedicated vendor dashboard with product & earnings management*

### 🔐 Admin Panel
![Admin Panel](screenshots/admin-panel.png)
*Complete platform control with user & product management*

### 💳 Payment Flow
![Payment Modal](screenshots/payment-modal.png)
*Secure payment processing with multiple payment methods*

### 📄 Invoice Generation
![Invoice PDF](screenshots/invoice-pdf.png)
*Professional invoice PDFs with GST breakdown*

</div>

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests
```bash
npm run e2e
```

---

## 📦 Deployment

### Backend (Django)

**Using Gunicorn + Nginx:**
```bash
# Install gunicorn
pip install gunicorn

# Run production server
gunicorn rentkart.wsgi:application --bind 0.0.0.0:8000

# Configure Nginx as reverse proxy
```

**Environment Variables:**
```bash
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Frontend (Angular)

**Build for production:**
```bash
cd frontend
npm run build --configuration=production
```

**Deploy to:**
- **Netlify**: Drag & drop `dist/rentkart` folder
- **Vercel**: Connect GitHub repo
- **AWS S3 + CloudFront**: Upload static files
- **Firebase Hosting**: Use Firebase CLI

---

## 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with Django's built-in hasher
- ✅ CORS protection with whitelist
- ✅ CSRF token validation
- ✅ SQL injection prevention (Django ORM)
- ✅ XSS protection with Angular sanitization
- ✅ Role-based access control
- ✅ Secure HTTP headers
- ✅ Rate limiting (configurable)

---

## 🎯 Future Enhancements

### Phase 1 - Payment Integration
- [ ] Razorpay payment gateway integration
- [ ] Stripe for international payments
- [ ] Wallet system for customers
- [ ] Automatic refund processing

### Phase 2 - Mobile Application
- [ ] React Native mobile app
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Biometric authentication

### Phase 3 - Advanced Features
- [ ] AI-powered product recommendations
- [ ] Chatbot for customer support
- [ ] Real-time chat between customer & vendor
- [ ] Advanced analytics dashboard

### Phase 4 - Business Tools
- [ ] Vendor subscription plans
- [ ] Commission management system
- [ ] Automated vendor payouts
- [ ] Marketing automation

### Phase 5 - Platform Expansion
- [ ] Multi-language support
- [ ] Multi-currency support
- [ ] Franchise model
- [ ] White-label solution

---

## 📄 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register/` | User registration |
| POST | `/api/v1/auth/login/` | User login (JWT) |
| POST | `/api/v1/auth/logout/` | User logout |
| POST | `/api/v1/auth/token/refresh/` | Refresh JWT token |
| GET | `/api/v1/auth/profile/` | Get user profile |
| PATCH | `/api/v1/auth/profile/` | Update profile |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/products/` | List all products |
| GET | `/api/v1/products/{slug}/` | Get product details |
| POST | `/api/v1/products/vendor/products/create/` | Create product (vendor) |
| PATCH | `/api/v1/products/vendor/products/{id}/` | Update product (vendor) |
| DELETE | `/api/v1/products/vendor/products/{id}/` | Delete product (vendor) |

### Rental Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/subscriptions/` | List user rentals |
| POST | `/api/v1/subscriptions/` | Create rental booking |
| GET | `/api/v1/subscriptions/{id}/` | Get rental details |

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/payments/process/` | Process payment |
| GET | `/api/v1/payments/invoices/` | List invoices |
| GET | `/api/v1/payments/invoices/{id}/download/` | Download invoice PDF |

**Full API documentation:** [Swagger UI](http://localhost:8000/api/docs/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Coding Standards:**
- Follow PEP 8 for Python
- Use ESLint for TypeScript
- Write unit tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Sumit Suman**

- Portfolio: [sumitsuman.dev](#)
- LinkedIn: [linkedin.com/in/sumitsuman](#)
- GitHub: [@sumitsuman](#)
- Email: sumitsuman@example.com

---

## 🙏 Acknowledgments

- [Angular Team](https://angular.io/) for the amazing framework
- [Django](https://www.djangoproject.com/) for the robust backend
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- Google Maps Platform for geocoding services
- All open-source contributors

---

## 📞 Support

For support, email support@rentkart.com or join our Slack channel.

---

<div align="center">
  
  **Made with ❤️ in India**
  
  ⭐ Star this repository if you found it helpful!
  
  [Report Bug](https://github.com/yourusername/rentkart/issues) • [Request Feature](https://github.com/yourusername/rentkart/issues)
  
</div>