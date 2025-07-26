# Job Portal Frontend (Vite + React)

A modern React-based frontend for the Job Portal application built with **Vite**, **React 18**, and **Tailwind CSS**.

## 🚀 Features

- ⚡ **Fast Development** - Vite for lightning-fast HMR and build times
- 🔐 **User Authentication** - JWT-based login/register system
- 📋 **Job Management** - Browse, search, and apply for jobs
- 📝 **Recruiter Tools** - Post jobs and manage applications
- 📱 **Responsive Design** - Mobile-first with Tailwind CSS
- 🎨 **Modern UI** - Clean, professional interface
- 🔔 **Real-time Notifications** - Toast notifications for user feedback

## 🛠️ Tech Stack

- **Vite** - Next-generation frontend tooling
- **React 18** - UI framework with hooks
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **JWT** - Authentication tokens

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🌐 Development

The frontend runs on `http://localhost:5173` (Vite's default port) and automatically proxies API requests to your backend at `http://localhost:5000`.

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── api/              # API functions
│   ├── auth.js       # Authentication endpoints
│   └── jobs.js       # Job-related endpoints
├── components/       # Reusable components
│   ├── JobCard.jsx   # Job display card
│   ├── Navbar.jsx    # Navigation bar
│   └── PrivateRoute.jsx # Protected route wrapper
├── context/          # React context providers
│   └── AuthContext.jsx # Authentication state
├── pages/            # Page components
│   ├── Home.jsx      # Landing page
│   ├── Login.jsx     # User login
│   ├── Register.jsx  # User registration
│   ├── Jobs.jsx      # Job listings
│   ├── JobDetails.jsx # Job details & application
│   ├── PostJob.jsx   # Job posting form
│   ├── Applicants.jsx # View job applicants
│   └── Profile.jsx   # User profile
├── App.jsx           # Main app component
├── index.css         # Global styles & Tailwind
└── main.jsx          # Entry point
```

## 🔌 API Integration

The frontend expects these backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/:id/applicants` - Get job applicants
- `GET /api/jobs/my-jobs` - Get user's posted jobs

## 🎨 Styling

The app uses **Tailwind CSS** with PostCSS configuration:

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outline button style
- `.input-field` - Form input styling
- `.form-label` - Form label styling
- `.card` - Card container styling

### Tailwind Configuration
- **PostCSS Integration** - Configured in `postcss.config.js`
- **Custom Colors** - Primary and secondary color palettes
- **Custom Components** - Utility classes for common patterns
- **Responsive Design** - Mobile-first approach

## 🔐 Authentication Flow

1. **Registration** - Users create accounts with name, email, password
2. **Login** - Users authenticate with email/password
3. **JWT Storage** - Tokens stored in localStorage
4. **Protected Routes** - Certain pages require authentication
5. **Auto-logout** - Invalid tokens trigger automatic logout

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

## 🚀 Performance Features

- **Vite HMR** - Instant hot module replacement
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Unused code elimination
- **Optimized Builds** - Production-ready bundles
- **Tailwind Purge** - Automatic CSS purging in production

## 🔧 Configuration

### Vite Config
- Proxy setup for API calls
- React plugin configuration
- Build optimizations

### PostCSS Config
- Tailwind CSS plugin
- Autoprefixer for browser compatibility

### Tailwind Config
- Custom color palette
- Responsive breakpoints
- Component utilities
- Content paths for purging

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts** - Vite will automatically find an available port
2. **API connection** - Ensure backend is running on port 5000
3. **Build errors** - Check for missing dependencies
4. **Styling issues** - Verify PostCSS and Tailwind are properly configured

### Development Tips

- Use `npm run dev` for development with HMR
- Check browser console for API errors
- Use React DevTools for component debugging
- Monitor network tab for API requests
- Tailwind classes are automatically purged in production builds

## 📄 License

This project is part of the Job Portal application.
