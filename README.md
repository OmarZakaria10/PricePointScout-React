# PricePointScout Frontend

A modern, responsive React application for comparing prices across multiple e-commerce platforms.

## Features

- 🔍 **Smart Search**: Search products across Amazon, Jumia, Noon, and Elbadr
- 🎨 **Beautiful UI**: Dribbble-inspired design with smooth animations
- 📱 **Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- 🔐 **Authentication**: Secure login/signup with JWT tokens stored in cookies
- 🛒 **Shopping Cart**: Add products to cart and manage quantities
- 📜 **Search History**: Track your previous searches (authenticated users)
- ⚡ **Fast & Modern**: Built with Vite for lightning-fast development
- 🎭 **Loading States**: Beautiful loading skeletons and spinners

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **js-cookie** - Cookie management
- **react-hot-toast** - Toast notifications
- **lucide-react** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.jsx
│   ├── LoadingSkeleton.jsx
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Cart.jsx
│   ├── History.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   └── Signup.jsx
├── services/           # API service functions
│   ├── api.js
│   └── index.js
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## Features Overview

### Guest Users Can:
- Search for products across multiple platforms
- View product details and prices
- Filter by price range and source
- Sort results by price

### Authenticated Users Can:
- All guest features, plus:
- Save items to shopping cart
- View search history
- Manage profile settings
- Update password

## API Integration

The app integrates with the PricePointScout API and supports:

- `/scrape/guest` - Guest product search
- `/scrape/user` - Authenticated product search
- `/users/signup` - User registration
- `/users/login` - User authentication
- `/users/logout` - User logout
- `/users/me` - Get user profile
- `/users/updateMe` - Update profile
- `/users/updateMyPassword` - Change password
- `/cart/*` - Cart management
- `/search/*` - Search history management

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Color Scheme

Primary colors inspired by Dribbble:
- Primary: Purple/Pink gradient (#d946ef, #c026d3)
- Dark: Gray scale (#212529 - #f8f9fa)
- Accent: Various shades for states

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the repository.
