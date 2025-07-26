# 🚀 Easily Job Portal

<div align="center">

![Job Portal Banner](https://img.shields.io/badge/Job%20Portal-Professional%20Platform-blue?style=for-the-badge&logo=linkedin)
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**A modern, feature-rich job portal platform connecting talented professionals with amazing opportunities**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Now-green?style=for-the-badge&logo=vercel)](YOUR_FRONTEND_URL)
[![API Docs](https://img.shields.io/badge/API%20Docs-View%20Docs-blue?style=for-the-badge&logo=postman)](YOUR_BACKEND_URL)

</div>

---

## ✨ Features

### 🔐 **Advanced Authentication System**
- **Google OAuth Integration** - Seamless login with Google accounts
- **Multi-Role System** - User, Admin, and Portal Admin roles
- **Secure JWT & Session Management** - Dual authentication support
- **OTP Verification** - Email-based verification system
- **Password Reset** - Secure password recovery via email

### 🏢 **Company Management**
- **Portal Admin Dashboard** - Register and manage companies
- **Unique Admin Codes** - 14-digit codes for company registration
- **Company Profiles** - Complete company information management
- **Admin-Company Linking** - Admins automatically linked to their companies

### 💼 **Job Management**
- **Smart Job Filtering** - Filter by skills, location, type, and salary
- **Expiry Date Protection** - Automatic removal of expired job listings
- **Featured & Recommended Jobs** - AI-powered job recommendations
- **Real-time Search** - Instant search with animated search bar
- **Job Categories** - Organized job classifications

### 📱 **Responsive Design**
- **Mobile-First Approach** - Optimized for all devices
- **Progressive Web App** - Native app-like experience
- **Touch-Friendly Interface** - Smooth interactions on mobile
- **Adaptive Layouts** - Perfect display on desktop, tablet, and mobile

### 🎨 **Modern UI/UX**
- **Animated Components** - Smooth transitions and micro-interactions
- **Dark/Light Theme Support** - Customizable appearance
- **Loading Animations** - Lottie animations for better UX
- **Toast Notifications** - Real-time feedback system

### 🔍 **Advanced Search & Filters**
- **Smart Search Bar** - Real-time job search
- **Advanced Filters** - Multiple filter options
- **Mobile Filter Drawer** - Collapsible filter interface
- **Search History** - Track recent searches

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-4.0+-646CFF?style=flat-square&logo=vite&logoColor=white)
![Styled Components](https://img.shields.io/badge/Styled%20Components-5.3+-DB7093?style=flat-square&logo=styledcomponents&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-6.0+-CA4245?style=flat-square&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.0+-5A29E4?style=flat-square&logo=axios&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-18.0+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.18+-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-7.0+-880000?style=flat-square&logo=mongoose&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-0.6+-34E27A?style=flat-square&logo=passport&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0+-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

### **Authentication & Security**
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-2.0+-4285F4?style=flat-square&logo=google&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-5.0+-000000?style=flat-square&logo=bcrypt&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-6.0+-339933?style=flat-square&logo=nodemailer&logoColor=white)

### **File Upload & Storage**
![Multer](https://img.shields.io/badge/Multer-1.4+-000000?style=flat-square&logo=multer&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-1.0+-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mitsshivashish/Job-Portal.git
cd easily-job-portal
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_REGISTRATION_CODE=your_14_digit_admin_code
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. **Initialize Portal Admin**
```bash
cd backend
npm run init-portal-admin
```

5. **Start the application**
```bash
# Start backend server
cd backend
npm run dev

# Start frontend (in new terminal)
cd client
npm run dev
```

---

## 📱 Screenshots

<div align="center">

### 🏠 Home Page
![Home Page](https://via.placeholder.com/800x400/007bff/ffffff?text=Home+Page)

### 🔍 Job Search
![Job Search](https://via.placeholder.com/800x400/28a745/ffffff?text=Job+Search)

### 📝 Post Job
![Post Job](https://via.placeholder.com/800x400/ffc107/000000?text=Post+Job)

### 👤 User Profile
![User Profile](https://via.placeholder.com/800x400/6f42c1/ffffff?text=User+Profile)

</div>

---

## 🏗️ Project Structure

```
easily-job-portal/
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 controllers/     # API logic
│   │   ├── 📁 models/         # Database schemas
│   │   ├── 📁 routes/         # API routes
│   │   ├── 📁 middlewares/    # Custom middlewares
│   │   ├── 📁 config/         # Configuration files
│   │   └── 📁 scripts/        # Utility scripts
│   ├── 📄 app.js             # Express app setup
│   └── 📄 package.json
├── 📁 client/
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable components
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 context/       # React context
│   │   ├── 📁 api/           # API functions
│   │   ├── 📁 assets/        # Static assets
│   │   └── 📁 styles/        # Global styles
│   ├── 📄 index.html
│   └── 📄 package.json
└── 📄 README.md
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/recommended` - Get recommended jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/my` - Get user applications
- `GET /api/applications/job/:id` - Get job applicants

### Companies
- `POST /api/companies/register` - Register company
- `GET /api/companies` - Get all companies
- `GET /api/companies/admin-code/:code` - Get company by admin code

---

## 🎯 Key Features Explained

### 🔐 **Multi-Role Authentication System**
The platform implements a sophisticated role-based access control system:
- **Regular Users**: Can browse jobs, apply, and manage their profile
- **Company Admins**: Can post jobs, manage applications, and view company analytics
- **Portal Admins**: Can register companies and manage the entire platform

### 🏢 **Company Registration Flow**
1. Portal Admin registers companies with unique 14-digit admin codes
2. Company Admins register using these codes and get linked to their companies
3. When posting jobs, company details are automatically prefilled

### 📱 **Responsive Design Implementation**
- **Mobile-First Approach**: All components designed for mobile first
- **Flexible Grid System**: CSS Grid and Flexbox for adaptive layouts
- **Touch-Optimized**: Large touch targets and smooth interactions
- **Progressive Enhancement**: Enhanced features on larger screens

### 🔍 **Smart Job Filtering**
- **Real-time Search**: Instant results as you type
- **Advanced Filters**: Multiple filter combinations
- **Mobile Filter Drawer**: Collapsible filter interface on mobile
- **Search History**: Track and reuse recent searches

---

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### Backend Deployment
```bash
# Build for production
cd backend
npm run build

# Deploy to Railway/Render
railway up
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **MongoDB** - For the flexible database
- **Google** - For OAuth integration
- **Vercel/Netlify** - For hosting solutions
- **Open Source Community** - For inspiration and support

---

## 📞 Support

- **Email**: Shivashishtiwari18@gmail.com
- **Issues**: [GitHub Issues](https://github.com/mitsshivashish/Job-Portal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mitsshivashish/Job-Portal/discussions)

---

<div align="center">

**Made with ❤️ by Shivashish Tiwari**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourusername)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/yourusername)

**⭐ Star this repository if you found it helpful!**

</div> 