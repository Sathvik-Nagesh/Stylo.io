# Stylo.io - Virtual Wardrobe & Outfit Generator

A modern, secure web application that helps users manage their wardrobe and generate intelligent outfit suggestions using AI. Built with security best practices and modern web technologies.

## ✨ Features

### Core Functionality
- **Virtual Wardrobe Management**: Upload, organize, and categorize clothing items
- **AI-Powered Outfit Generation**: Smart outfit suggestions based on occasion, season, and style preferences
- **Advanced Search & Filtering**: Find items by type, color, season, brand, or custom tags
- **Outfit Planning**: Create, save, and manage outfit combinations
- **Style Analytics**: Track your fashion choices and get insights

### Security Features
- **Secure Authentication**: JWT-based authentication with password hashing
- **Input Validation**: Comprehensive server-side validation and sanitization
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for comprehensive security headers
- **CORS Protection**: Properly configured cross-origin resource sharing
- **Session Management**: Secure session handling with MongoDB store

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **React Router** for navigation
- **Axios** for API communication
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express-validator** for input validation
- **Helmet.js** for security headers
- **Rate limiting** for API protection

### Security & Middleware
- **CORS** configuration
- **Input sanitization**
- **Error handling**
- **Request validation**
- **Session management**

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v5.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Sathvik-Nagesh/Stylo.io.git
cd Stylo.io
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Set up environment variables**

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/stylo-wardrobe
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
SESSION_SECRET=your-super-secret-session-key
FRONTEND_URL=http://localhost:3000
```

Create `.env` in root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Start the application**
```bash
# Start backend server
cd server
npm run dev

# In a new terminal, start frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Stylo.io/
├── src/                          # Frontend source code
│   ├── components/               # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── FloatingGenerateButton.tsx
│   ├── pages/                    # Page components
│   │   ├── Auth.tsx
│   │   ├── Wardrobe.tsx
│   │   ├── Upload.tsx
│   │   ├── GenerateOutfit.tsx
│   │   └── Profile.tsx
│   ├── contexts/                 # React contexts
│   │   └── AuthContext.tsx
│   ├── services/                 # API services
│   │   └── auth.ts
│   ├── types/                    # TypeScript type definitions
│   │   └── ClothingTypes.ts
│   └── theme/                    # Theme configuration
│       └── index.ts
├── server/                       # Backend source code
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── clothingController.ts
│   │   │   ├── outfitController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/           # Custom middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validation.ts
│   │   ├── models/               # MongoDB models
│   │   │   ├── User.ts
│   │   │   ├── Clothing.ts
│   │   │   └── Outfit.ts
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── clothing.ts
│   │   │   ├── outfit.ts
│   │   │   └── user.ts
│   │   └── index.ts              # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── README.md
├── SECURITY.md                   # Security documentation
└── DEPLOYMENT.md                 # Deployment guide
```

## 🔐 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token handling
- Password hashing using bcryptjs with salt rounds
- Role-based access control
- Session management with secure cookies

### Input Validation & Sanitization
- Server-side validation using express-validator
- Input sanitization to prevent XSS attacks
- File upload validation and size limits
- SQL injection prevention through Mongoose ODM

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security

### Rate Limiting
- General API rate limiting (100 requests per 15 minutes)
- Stricter limits for authentication endpoints (5 requests per 15 minutes)
- Protection against brute force attacks

## 🚀 Deployment

### Production Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Environment configuration
- Database setup
- SSL certificate configuration
- Nginx configuration
- Docker deployment
- Security checklist

### Security Considerations
See [SECURITY.md](./SECURITY.md) for comprehensive security information including:
- Security features implemented
- Vulnerability management
- Security best practices
- Reporting security issues

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Clothing Management
- `GET /api/clothing` - Get clothing items
- `POST /api/clothing` - Create clothing item
- `GET /api/clothing/:id` - Get specific clothing item
- `PUT /api/clothing/:id` - Update clothing item
- `DELETE /api/clothing/:id` - Delete clothing item
- `GET /api/clothing/search` - Search clothing items
- `GET /api/clothing/stats` - Get clothing statistics

### Outfit Management
- `GET /api/outfit` - Get outfits
- `POST /api/outfit` - Create outfit
- `GET /api/outfit/:id` - Get specific outfit
- `PUT /api/outfit/:id` - Update outfit
- `DELETE /api/outfit/:id` - Delete outfit
- `GET /api/outfit/search` - Search outfits
- `GET /api/outfit/generate` - Generate AI outfit
- `GET /api/outfit/stats` - Get outfit statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/dashboard` - Get dashboard statistics
- `DELETE /api/user/account` - Delete user account

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test

# Run security audit
npm audit
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow security best practices
- Use conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the [SECURITY.md](./SECURITY.md) for security-related questions
- Review the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues

## 🔄 Changelog

### v1.0.0
- Initial release with core wardrobe management features
- AI-powered outfit generation
- Secure authentication system
- Comprehensive security implementation
- Modern React frontend with Material-UI
- Robust Node.js/Express backend
- MongoDB integration with Mongoose
- Complete API documentation
- Production deployment guide 