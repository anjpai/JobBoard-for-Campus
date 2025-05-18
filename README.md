# Campus Recruitment System

A web-based platform that facilitates campus recruitment by connecting students, companies, and administrators.

## Current Features

### Student Features
- Register and login as a student
- Create and edit basic profile with:
  - Personal information (name, email, phone)
- View all available job postings
- Apply for jobs
- View company profiles

### Company Features
- Register and login as a company
- Create and edit company profile with:
  - Company name
  - Contact information
- Post new job opportunities with:
  - Job title and description
- View student profiles
- Track posted jobs

### Admin Features
- Secure admin login (admin@campus.com / Admin123)
- User management:
  - View all users (students and companies)
  - Delete users
- View job postings

## Quick Start

1. Visit `http://localhost:3000`
2. Choose your role (Student/Company/Admin)
3. Login credentials for testing:
   - Admin: admin@campus.com / Admin123
   - Student: Create new account
   - Company: Create new account

## Author

Built and maintained by Anjali R Pai.

## Technology Stack

### Frontend
- React.js
- Redux for state management
- React Bootstrap for UI
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/campus-recruitment-system.git
cd campus-recruitment-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory with:
```
MONGO_DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start both frontend and backend
npm start

# Start backend only
npm run server

# Start frontend only
npm run client
```

## Usage

1. Visit `http://localhost:3000` in your browser
2. Create an account as either a student or company
3. Complete your profile
4. Start connecting!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Bootstrap for the UI components
- MongoDB Atlas for database hosting
- All contributors who have helped improve this project
