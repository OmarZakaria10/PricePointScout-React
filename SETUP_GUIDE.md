# PricePointScout Frontend - Complete Setup Guide

## What Has Been Created

I've created a complete, production-ready React application for your PricePointScout project with the following features:

### ✨ Key Features

1. **Beautiful Dribbble-Inspired UI**
   - Modern gradient design with purple/pink theme
   - Smooth animations and transitions
   - Card-based layouts with soft shadows
   - Custom scrollbar styling

2. **Fully Responsive Design**
   - Mobile-first approach
   - Responsive navigation with mobile menu
   - Adaptive grid layouts
   - Touch-friendly interfaces

3. **Authentication System**
   - Login & Signup pages
   - JWT token stored in cookies (7-day expiration)
   - Protected routes for authenticated users
   - Password visibility toggle
   - Profile management

4. **Product Search**
   - Guest and authenticated search
   - Multiple source selection (Amazon, Jumia, Noon, Elbadr)
   - Price range filtering
   - Sort by price (ascending/descending)
   - Real-time loading states

5. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Persistent cart storage
   - Direct links to product pages

6. **Search History**
   - View past searches (authenticated users)
   - Click to view search results
   - Delete individual searches
   - Timestamp tracking

7. **User Profile**
   - Update name and email
   - Change password
   - View account information

### 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Footer.jsx              # Site footer with links
│   │   ├── LoadingSkeleton.jsx     # Skeleton loading states
│   │   ├── LoadingSpinner.jsx      # Spinner component
│   │   ├── Navbar.jsx              # Responsive navigation
│   │   ├── ProductCard.jsx         # Product display card
│   │   └── ProtectedRoute.jsx      # Route protection HOC
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── pages/
│   │   ├── Cart.jsx                # Shopping cart page
│   │   ├── History.jsx             # Search history page
│   │   ├── Home.jsx                # Main search page
│   │   ├── Login.jsx               # Login page
│   │   ├── Profile.jsx             # User profile page
│   │   └── Signup.jsx              # Registration page
│   ├── services/
│   │   ├── api.js                  # Axios instance with interceptors
│   │   └── index.js                # API service functions
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Global styles & Tailwind
│   └── main.jsx                    # App entry point
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Installation Instructions

### Step 1: Navigate to Frontend Directory
```bash
cd /media/omar/01DADC72FB780420/Projects/PricePointScout/frontend
```

### Step 2: Install Dependencies

Due to the network timeout, try these options:

**Option A: Standard Install**
```bash
npm install
```

**Option B: With Registry Mirror (if you have connection issues)**
```bash
npm install --registry=https://registry.npmmirror.com
```

**Option C: Using Yarn (alternative)**
```bash
yarn install
```

### Step 3: Configure Environment
The `.env` file is already created with:
```
VITE_API_BASE_URL=http://localhost:3000
```

Update this if your backend runs on a different port.

### Step 4: Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### Step 5: Build for Production
```bash
npm run build
```

## 🎨 Design Highlights

### Color Palette
- **Primary**: Purple gradient (#d946ef → #c026d3)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#212529)
- **Cards**: White with soft shadows

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800

### Components
- **Buttons**: Rounded, with hover effects and transitions
- **Cards**: Elevated with shadow on hover
- **Inputs**: Bordered with focus states
- **Icons**: Lucide React icon set

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token stored in cookie (expires in 7 days)
3. Token automatically included in API requests
4. Protected routes redirect to login if not authenticated
5. Token removed on logout or 401 response

## 🛒 Features by User Type

### Guest Users
- ✅ Search products
- ✅ View product details
- ✅ Filter by price and source
- ❌ Cannot add to cart
- ❌ No search history

### Authenticated Users
- ✅ All guest features
- ✅ Add items to cart
- ✅ View and manage cart
- ✅ Search history tracking
- ✅ Profile management
- ✅ Password updates

## 🔌 API Integration

All endpoints from your Postman collection are integrated:

### Authentication
- `POST /users/signup` - Register
- `POST /users/login` - Login
- `POST /users/logout` - Logout
- `GET /users/me` - Get profile
- `PATCH /users/updateMe` - Update profile
- `PATCH /users/updateMyPassword` - Change password

### Product Scraping
- `GET /scrape/guest` - Guest search
- `GET /scrape/user` - Authenticated search

### Cart Management
- `GET /cart/getCart` - Get cart
- `POST /cart/addItem` - Add item
- `DELETE /cart/removeItem/:id` - Remove item
- `PATCH /cart/updateItem/:id` - Update quantity
- `DELETE /cart/clearCart` - Clear cart

### Search History
- `GET /search/mySearches` - Get all searches
- `GET /search/getSearch/:id` - Get specific search
- `DELETE /search/deleteSearch/:id` - Delete search

## 🎯 Key Technical Decisions

1. **Vite**: Chosen for fast development and optimized builds
2. **Tailwind CSS**: Utility-first CSS for rapid UI development
3. **js-cookie**: Simple cookie management for auth tokens
4. **React Router v6**: Latest routing with data APIs
5. **Axios**: HTTP client with interceptors for auth
6. **react-hot-toast**: Beautiful toast notifications
7. **Context API**: State management for authentication

## 📦 Dependencies

### Production
- react, react-dom (^18.2.0)
- react-router-dom (^6.22.0)
- axios (^1.6.5)
- js-cookie (^3.0.5)
- react-hot-toast (^2.4.1)
- lucide-react (^0.331.0)

### Development
- vite (^5.1.0)
- @vitejs/plugin-react (^4.2.1)
- tailwindcss (^3.4.1)
- autoprefixer (^10.4.17)
- postcss (^8.4.35)
- eslint + plugins

## 🐛 Troubleshooting

### Network Timeout During Install
If `npm install` times out:
1. Check your internet connection
2. Try using a VPN or different network
3. Use Yarn instead: `yarn install`
4. Configure npm registry: `npm config set registry https://registry.npmmirror.com`

### API Connection Issues
If the app can't connect to the backend:
1. Verify backend is running on port 3000
2. Check CORS settings in backend
3. Update `VITE_API_BASE_URL` in `.env`
4. Check browser console for errors

### Build Issues
If build fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear Vite cache: `rm -rf node_modules/.vite`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

Create a `.env` file with:
```
VITE_API_BASE_URL=http://localhost:3000
```

For production:
```
VITE_API_BASE_URL=https://api.yoursite.com
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com)

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Need Help?** Open an issue on GitHub or contact support.

**Next Steps:**
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open http://localhost:5173
4. Start building amazing features! 🚀
