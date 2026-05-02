# E-commerce Backend API

A robust and scalable TypeScript-based backend for e-commerce applications, built with Express.js and MongoDB.
https://ecommarce-backend-dsoe.onrender.com/
(live)

## 🚀 Features

- **User Authentication** - JWT-based authentication system
- **Product Management** - CRUD operations for products
- **Order Processing** - Complete order lifecycle management
- **Payment Integration** - Secure payment processing
- **Shopping Cart** - Persistent cart functionality
- **Reviews & Ratings** - Product review system
- **Blog System** - Content management for blogs
- **FAQ Management** - Dynamic FAQ section
- **Wishlists** - User wishlist functionality
- **Contact System** - User inquiry management

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Payment**: Stripe Integration
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: Zod
- **Scheduling**: Node-cron
- **Real-time**: Socket.IO

## 📦 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (v7 or higher) or yarn

## 🚀 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/parvesmosarof35/ecommarce-backend.git
   cd ecommarce-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

## 🏃‍♂️ Running the Application

### Development

```bash
npm run dev






#  PS C:\New folder\spark-tech\ecommarce-raphm18\ecommarce-backend> cd src
# PS C:\New folder\spark-tech\ecommarce-raphm18\ecommarce-backend\src> tree
# Folder PATH listing
# Volume serial number is 88E7-76FD
# C:.
# ├───app
# │   ├───builder
# │   ├───config
# │   ├───errors
# │   ├───helper
# │   ├───interface
# │   ├───middlewares
# │   ├───modules
# │   │   ├───auth
# │   │   ├───blogs
# │   │   ├───cart
# │   │   ├───collections
# │   │   ├───contact
# │   │   ├───faq
# │   │   ├───order
# │   │   ├───payment
# │   │   ├───products
# │   │   ├───reviews
# │   │   ├───settings
# │   │   ├───user
# │   │   └───wishlists
# │   ├───routes
# │   ├───shared
# │   └───utils
# │       └───emailcontext
# └───public
#     └───images
# PS C:\New folder\spark-tech\ecommarce-raphm18\ecommarce-backend\src>




```

### Production

```bash
npm run build
npm start
```

## 🧪 Running Tests

```bash
npm test
```

## 🧹 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run prettier
```

## 📂 Project Structure

```
src/
├── app/
│   ├── config/         # Configuration files
│   ├── errors/         # Custom error classes
│   ├── helper/         # Helper functions
│   ├── interface/      # TypeScript interfaces
│   ├── middlewares/    # Express middlewares
│   ├── modules/        # Feature modules
│   │   ├── auth/       # Authentication
│   │   ├── products/   # Product management
│   │   ├── order/      # Order processing
│   │   └── ...         # Other modules
│   ├── routes/         # Route definitions
│   └── utils/          # Utility functions
└── server.ts           # Application entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Built with ❤️ using TypeScript and Express
- Special thanks to all contributors
