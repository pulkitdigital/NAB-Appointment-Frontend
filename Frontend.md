# Frontend Documentation - Appointment Booking System

## Overview

A modern, responsive React application for booking consultations with Chartered Accountants. Features a public booking interface and a comprehensive admin panel for managing appointments, CAs, and system settings.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **React Hot Toast** - Toast notifications
- **Razorpay** - Payment integration

## Project Structure

```
Frontend/
├── src/
│   ├── pages/
│   │   ├── Book.jsx              # Main booking page
│   │   ├── Confirmation.jsx      # Booking confirmation
│   │   └── admin/
│   │       ├── Dashboard.jsx     # Admin dashboard
│   │       ├── Appointments.jsx  # Appointment management
│   │       ├── CA.jsx            # CA management
│   │       └── Settings.jsx      # System settings
│   ├── components/
│   │   ├── AppointmentForm.jsx   # User info form
│   │   ├── DatePicker.jsx        # Calendar picker
│   │   ├── TimeSlotPicker.jsx    # Time slot selector
│   │   ├── PayButton.jsx         # Payment button
│   │   └── AdminLayout.jsx       # Admin navigation
│   ├── services/
│   │   ├── api.js                # API client
│   │   └── payment.js            # Razorpay service
│   ├── styles/
│   │   └── index.css             # Global styles
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── .env.example
```

## Installation

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Update variables:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay Configuration  
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Admin Configuration
VITE_ADMIN_SECRET=your_strong_admin_secret_key_here
```

### 3. Start Development Server

```bash
npm run dev
```

Application runs at `http://localhost:3000`

## User Interface

### Booking Flow (`/book`)

1. **Personal Information**
   - Name (required)
   - Email (validated)
   - Mobile (10 digits)
   - Consultation notes (optional)

2. **Select Duration**
   - Choose from available durations (e.g., 30min/₹500, 60min/₹1000)
   - Price displayed for each option
   - Only one duration selectable at a time

3. **Select Date**
   - Interactive calendar
   - Next 15-30 days displayed (configurable)
   - Past dates disabled
   - Off days marked and disabled

4. **Select Time Slot**
   - Available slots shown based on working hours
   - Booked slots are disabled and marked
   - Slots generated in 30-minute intervals

5. **Payment & Confirmation**
   - Booking summary displayed
   - Razorpay checkout modal
   - Payment verification
   - Redirect to confirmation page

### Confirmation Page (`/confirmation/:bookingId`)

Shows:
- Reference ID
- Date and time
- Contact information
- Payment status
- Next steps
- Print option

## Admin Panel

Access at `/admin` (requires admin secret in `.env`)

### Dashboard (`/admin`)

**Statistics Cards:**
- Total Appointments
- Today's Appointments
- Pending Appointments  
- Total Revenue

**Recent Appointments Table:**
- Last 5 bookings
- Quick status overview
- Link to full appointments list

### Appointments Management (`/admin/appointments`)

**Features:**
- View all appointments in table
- Filter by status (pending, confirmed, completed, cancelled)
- Filter by date
- Search by name, email, mobile, or reference ID
- View detailed appointment information
- Update appointment status
- Assign CAs to appointments

**Appointment Details Modal:**
- Client information
- Appointment date/time
- Payment details
- Consultation notes
- Assigned CA

### CA Management (`/admin/ca`)

**Features:**
- View all CAs in card grid
- Add new CA with form:
  - Name
  - Email
  - Mobile
  - Specialization
  - Years of experience
  - Status (active/inactive)
- Edit CA details
- Delete CA (with confirmation)
- Visual status indicators

### Settings (`/admin/settings`)

**Booking Configuration:**
- Advance booking days (how far ahead users can book)
- Slot durations and prices:
  - Multiple duration options
  - Custom pricing for each
  - Add/remove durations

**Working Hours:**
- Start time
- End time
- Slots auto-generated based on hours

**Off Days Management:**
- Add specific dates as off days
- View list of scheduled off days
- Remove off days
- Dates displayed with full formatting

**Automation:**
- Auto-assign CA toggle
- Reminder hours before appointment

**Notifications:**
- Email notifications toggle
- SMS notifications toggle (requires additional setup)

## Components

### AppointmentForm
Collects user information with validation.

**Props:**
- `formData` - Current form state
- `onChange` - Update handler
- `errors` - Validation errors

**Validation:**
- Name: Required
- Email: Valid format
- Mobile: Exactly 10 digits
- Notes: Optional

### DatePicker
Interactive calendar for date selection.

**Props:**
- `selectedDate` - Currently selected date
- `onDateChange` - Selection handler

**Features:**
- Shows next 30 days
- Disables past dates
- Visual selection feedback
- Responsive grid layout

### TimeSlotPicker
Time slot selection interface.

**Props:**
- `selectedDate` - Selected appointment date
- `selectedSlot` - Currently selected slot
- `onSlotChange` - Selection handler
- `bookedSlots` - Array of unavailable slots

**Features:**
- Generates slots from working hours
- Marks booked slots as disabled
- Shows loading state
- Responsive grid

### PayButton
Payment initiation button.

**Props:**
- `onClick` - Click handler
- `disabled` - Disabled state
- `loading` - Processing state
- `amount` - Amount to display

**Features:**
- Loading spinner
- Disabled styling
- Hover/tap animations
- Clear pricing display

### AdminLayout
Navigation wrapper for admin pages.

**Features:**
- Sidebar navigation
- Mobile hamburger menu
- Active route highlighting
- Logout functionality
- Responsive design

## API Integration

### Service Layer (`services/api.js`)

**Public APIs:**
```javascript
// Get available slots for a date
getAvailableSlots(date)

// Create booking order
createBooking(bookingData)

// Verify payment
verifyPayment(paymentData)

// Get booking details
getBookingById(bookingId)
```

**Admin APIs (require admin secret):**
```javascript
// Dashboard stats
getDashboardStats()

// Appointment management
getAllAppointments(filters)
updateAppointmentStatus(appointmentId, status)
assignCA(appointmentId, caId)

// CA management
getCAList()
createCA(caData)
updateCA(caId, caData)
deleteCA(caId)

// Settings management
getSettings()
updateSettings(settingsData)
addOffDay(date, reason)
removeOffDay(date)
```

## Payment Integration

### Razorpay Flow

1. **User Submits Booking**
   - Form validation
   - API call to create order
   - Backend creates Razorpay order

2. **Open Payment Modal**
   - Load Razorpay script
   - Pre-fill user details
   - Show checkout modal

3. **Payment Processing**
   - User completes payment
   - Razorpay returns payment credentials

4. **Verification**
   - Send credentials to backend
   - Backend verifies signature
   - Backend re-checks slot availability
   - Create appointment in Firestore

5. **Confirmation**
   - Redirect to confirmation page
   - Display booking details
   - Send email notification

### Test Cards

**Success:**
- `4111 1111 1111 1111`
- Any CVV, future expiry

**Failure:**
- `4000 0000 0000 0002`

## Styling

### Tailwind Configuration

Custom theme extends Tailwind defaults:

**Colors:**
```javascript
primary: {
  50: '#f0f9ff',
  ...
  600: '#0ea5e9', // Main brand color
  ...
  900: '#0c4a6e',
}
```

**Animations:**
```javascript
'fade-in': 'fadeIn 0.5s ease-in',
'slide-up': 'slideUp 0.5s ease-out',
```

### Custom CSS Classes

**Buttons:**
- `.btn-primary` - Primary actions
- `.btn-secondary` - Secondary actions

**Forms:**
- `.input-field` - Text inputs

**Containers:**
- `.card` - White card with shadow

**Time Slots:**
- `.time-slot` - Base slot
- `.time-slot-selected` - Selected
- `.time-slot-disabled` - Unavailable

## Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Sidebar converts to hamburger menu
- Tables become scrollable
- Forms stack vertically
- Grid columns reduce
- Touch-friendly buttons (min 44px)

## State Management

Uses React hooks for local state:

**Common Patterns:**
```javascript
// Form state
const [formData, setFormData] = useState({})

// Loading states
const [loading, setLoading] = useState(false)

// API data
const [appointments, setAppointments] = useState([])

// Filters
const [filters, setFilters] = useState({})
```

## Error Handling

**API Errors:**
- Caught in try-catch blocks
- Displayed via toast notifications
- Logged to console for debugging

**Validation Errors:**
- Inline error messages
- Red border on invalid inputs
- Clear error descriptions

**Loading States:**
- Spinner animations
- Disabled buttons during processing
- Loading overlays where appropriate

## Performance Optimizations

- Code splitting by route
- Lazy loading of admin components
- Debounced search inputs
- Optimized re-renders
- Memoized expensive calculations
- Image optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Workflow

### Running Development Server
```bash
npm run dev
```
- Hot module replacement
- Fast refresh
- Error overlay
- Auto-open browser

### Building for Production
```bash
npm run build
```
- Minification
- Code splitting
- Tree shaking
- Asset optimization

### Preview Production Build
```bash
npm run preview
```
- Test production build locally
- Verify optimizations
- Check bundle size

## Testing

### Manual Testing Checklist

**Booking Flow:**
- [ ] Form validation works
- [ ] Date picker shows correct dates
- [ ] Booked slots are disabled
- [ ] Duration selection works
- [ ] Payment modal opens
- [ ] Payment success redirects
- [ ] Confirmation page displays

**Admin Panel:**
- [ ] Dashboard stats load
- [ ] Appointments table works
- [ ] Filters apply correctly
- [ ] Status updates work
- [ ] CA assignment works
- [ ] CA CRUD operations work
- [ ] Settings save correctly
- [ ] Off days can be added/removed

## Deployment

### Build Configuration

Update `.env` for production:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_ADMIN_SECRET=your_production_secret
```

### Static Hosting

Application can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- Traditional web servers

### Server Configuration

For client-side routing, configure server to serve `index.html` for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Troubleshooting

### Common Issues

**API Connection Failed:**
- Check `VITE_API_URL` in `.env`
- Verify backend is running
- Check CORS configuration
- Inspect Network tab in DevTools

**Payment Not Working:**
- Verify Razorpay key is correct
- Check console for script errors
- Ensure test mode for development
- Verify backend payment routes

**Slots Not Loading:**
- Check date format (YYYY-MM-DD)
- Verify backend slot generation
- Check off days configuration
- Inspect API response

**Admin Panel Not Loading:**
- Verify `VITE_ADMIN_SECRET` matches backend
- Check authentication header
- Verify admin routes in backend

### Debug Mode

Enable verbose logging:
```javascript
// In api.js
api.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});
```

## Future Enhancements

- [ ] Appointment rescheduling
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Calendar view in admin
- [ ] Advanced analytics
- [ ] Export reports (PDF/Excel)
- [ ] Push notifications
- [ ] Mobile app (React Native)

## Best Practices

**Code Organization:**
- One component per file
- Logical folder structure
- Consistent naming
- Clear file purposes

**State Management:**
- Keep state as local as possible
- Lift state when sharing needed
- Use appropriate hooks
- Clean up effects

**Error Handling:**
- Catch all async errors
- Display user-friendly messages
- Log errors for debugging
- Provide recovery options

**Accessibility:**
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation
- Color contrast compliance

**Performance:**
- Minimize re-renders
- Optimize images
- Code split routes
- Lazy load heavy components

---

**Version:** 1.0.0  
**Last Updated:** February 2026