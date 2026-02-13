# Frontend Documentation - Appointment Booking System

## Overview

A modern, responsive React application for booking consultations with Chartered Accountants. Features a public booking interface with Google Meet integration and a comprehensive admin panel for managing appointments, CAs, and system settings.

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
│   │   ├── Confirmation.jsx      # Booking confirmation with Meet link
│   │   └── admin/
│   │       ├── Dashboard.jsx     # Admin dashboard
│   │       ├── Appointments.jsx  # Appointment management
│   │       ├── CA.jsx            # CA management
│   │       └── Settings.jsx      # System settings
│   ├── components/
│   │   ├── AppointmentForm.jsx   # User info form
│   │   ├── DatePicker.jsx        # Calendar picker
│   │   ├── TimeSlotPicker.jsx    # Time slot selector
│   │   ├── CASelector.jsx        # CA selection (optional)
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
└── .env
```

## Installation

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Razorpay Configuration  
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# Business ID (matches Firestore)
VITE_BUSINESS_ID=nab-consultancy

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
   - Email (validated format)
   - Phone (10 digits)
   - Consultation notes (optional, textarea)

2. **Select CA (Optional)**
   - View available CAs with experience
   - See CA specialization
   - Optional selection (auto-assign if not selected)
   - Visual cards with CA details

3. **Select Duration**
   - Choose from available durations (30min/₹500, 60min/₹1000)
   - Price displayed prominently
   - Radio button selection
   - Dynamic pricing updates

4. **Select Date**
   - Interactive calendar
   - Shows next 15-30 days (configurable)
   - Past dates disabled
   - Off days marked and disabled
   - Weekly schedule respected

5. **Select Time Slot**
   - Available slots shown based on:
     - Working hours
     - CA availability
     - Existing bookings
   - Booked slots disabled and grayed out
   - CA unavailable slots marked
   - 30-minute intervals

6. **Payment & Confirmation**
   - Booking summary displayed:
     - Customer details
     - Selected CA (if any)
     - Date, time, duration
     - Total amount
   - Razorpay checkout modal
   - Secure payment processing
   - Automatic redirect on success

### Confirmation Page (`/confirmation/:bookingId`)

Shows:
- ✅ Success message
- 📋 Reference ID (NAB_YYYY_0001)
- 📅 Date and time
- 👤 Customer information
- 🧑‍💼 Assigned CA details
- 🎥 **Google Meet Link** (clickable button)
- 💰 Payment confirmation
- 📧 Email notification sent
- 📌 Important reminders:
  - Email reminders at 12hr, 1hr, 1min
  - Join 5 minutes early
  - Check spam folder
- 🖨️ Print option

**Meet Link Display:**
```jsx
{meetLink && (
  <a 
    href={meetLink}
    className="btn-primary"
    target="_blank"
  >
    🎥 Join Google Meet
  </a>
)}
```

## Admin Panel

Access at `/admin` (requires admin secret in `.env`)

### Dashboard (`/admin`)

**Statistics Cards:**
- Total Appointments (all time)
- Today's Appointments
- Pending Appointments  
- Total Revenue (₹)

**Recent Appointments Table:**
- Last 10 bookings
- Shows: Reference ID, Customer, Date, Time, CA, Status
- Quick status view
- Click to view details
- Link to full appointments list

**Quick Actions:**
- View all appointments
- Manage CAs
- Update settings

### Appointments Management (`/admin/appointments`)

**Features:**
- View all appointments in table
- Columns:
  - Reference ID
  - Customer name
  - Email
  - Phone
  - Date
  - Time
  - CA assigned
  - Status badge
  - Actions

**Filters:**
- Status (all, pending, confirmed, completed, cancelled)
- Date range picker
- CA filter (all CAs + unassigned)
- Search by:
  - Reference ID
  - Customer name
  - Email
  - Phone

**Actions:**
- View full details
- Update status
- Assign/change CA
- View Google Meet link
- Send reminder (manual)

**Appointment Details Modal:**
```
Customer Information:
- Name, Email, Phone
- Consultation notes

Appointment Details:
- Reference ID
- Date & Time
- Duration
- Status with badge
- Assigned CA

Payment Information:
- Amount paid
- Payment ID
- Order ID
- Payment status

Meeting Information:
- Google Meet Link (clickable)
- Event ID

Action Buttons:
- Update Status dropdown
- Assign CA dropdown
- Close modal
```

### CA Management (`/admin/ca`)

**Features:**
- View all CAs in responsive grid
- Card displays:
  - Name
  - Email
  - Phone
  - Experience (years)
  - Specialization
  - Status badge (Active/Inactive)
  - Intro text (truncated)
  - Action buttons

**Add New CA:**
- Modal form with fields:
  - Name (required)
  - Email (validated)
  - Phone (10 digits)
  - Experience (number)
  - Specialization (text)
  - Intro (textarea)
  - Status (active/inactive toggle)
- Real-time validation
- Success notification

**Edit CA:**
- Pre-populated form
- Update any field
- Save changes
- Instant update in UI

**Delete CA:**
- Confirmation dialog
- Warning about assigned appointments
- Permanent deletion

**Mark Unavailable Slots:**
- Select date
- Select time slots
- Add reason (optional)
- Shows unavailable slots list
- Remove unavailable slots

### Settings (`/admin/settings`)

**Business Information:**
- Business name
- Business address
- Display on booking page
- Used in emails

**Booking Configuration:**
- **Advance Booking Days**
  - Slider: 1-90 days
  - Default: 15 days
  - Controls how far ahead bookings allowed

- **Slot Durations & Pricing**
  - Multiple duration options
  - Each with price
  - Add new duration:
    - Duration (minutes)
    - Price (₹)
  - Edit existing:
    - Update price
    - Update duration
  - Remove duration (with confirmation)
  - At least one duration required

**Weekly Schedule:**
- Configure each day:
  - Monday - Sunday
  - Enable/disable toggle
  - Start time (dropdown)
  - End time (dropdown)
- Visual day cards
- Save all at once
- Validation (end > start)

**Off Days Management:**
- **Add Off Day:**
  - Date picker (future dates only)
  - Optional reason
  - Add button
- **Current Off Days:**
  - List view with dates
  - Formatted display
  - Reason shown (if provided)
  - Remove button
- Automatically blocks bookings
- Shows on calendar

**Automation Settings:**
- **Auto-assign CA:**
  - Toggle on/off
  - When ON: System assigns CA automatically
  - When OFF: Admin must assign manually
  - Uses round-robin logic

- **Reminder Hours:**
  - Number input (1-48)
  - Default: 24 hours
  - Used for email reminders
  - Fixed reminders: 12hr, 1hr, 1min

**Save Button:**
- Validates all settings
- Shows success/error toast
- Updates immediately

## Components

### AppointmentForm
Collects user information with validation.

**Props:**
```typescript
formData: {
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  consult_note: string
}
onChange: (field, value) => void
errors: { [field]: string }
```

**Validation Rules:**
- Name: Required, min 2 chars
- Email: Valid format (regex)
- Phone: Exactly 10 digits
- Notes: Optional, max 500 chars

**Features:**
- Real-time validation
- Error messages below fields
- Red border on invalid
- Disabled submit if errors

### CASelector
CA selection interface (optional).

**Props:**
```typescript
selectedCA: string | null
onCAChange: (caId) => void
cas: Array<CA>
```

**Features:**
- Grid of CA cards
- Shows experience, specialization
- Active status indicator
- "Any Available CA" option
- Visual selection feedback

### DatePicker
Interactive calendar for date selection.

**Props:**
```typescript
selectedDate: string | null
onDateChange: (date) => void
offDays: string[]
advanceDays: number
weeklySchedule: object
```

**Features:**
- Shows next N days (based on settings)
- Disables past dates
- Disables off days
- Respects weekly schedule
- Visual feedback for:
  - Today
  - Selected date
  - Disabled dates
- Responsive grid (7 columns)

### TimeSlotPicker
Time slot selection interface.

**Props:**
```typescript
selectedDate: string
selectedSlot: string | null
onSlotChange: (slot) => void
selectedCA: string | null
duration: number
```

**Features:**
- Generates slots from working hours
- 30-minute intervals
- Shows booked slots (disabled)
- Shows CA unavailable slots (disabled)
- Loading state while fetching
- Responsive grid
- Clear visual states:
  - Available (white, hover effect)
  - Selected (blue background)
  - Booked (gray, disabled)
  - CA Unavailable (gray, disabled)

**Slot Generation:**
```javascript
// Working hours: 09:00 - 18:00
// Generates: 09:00, 09:30, 10:00, ..., 17:30
```

### PayButton
Payment initiation button.

**Props:**
```typescript
onClick: () => void
disabled: boolean
loading: boolean
amount: number
```

**Features:**
- Disabled when:
  - Form incomplete
  - Already processing
  - Invalid data
- Shows loading spinner when processing
- Displays amount prominently
- Responsive sizing
- Hover/tap animations
- Clear call-to-action text

### AdminLayout
Navigation wrapper for admin pages.

**Features:**
- **Sidebar Navigation:**
  - Dashboard
  - Appointments
  - CA Management
  - Settings
  - Logout
- **Mobile Menu:**
  - Hamburger icon
  - Slide-in sidebar
  - Overlay backdrop
- **Active Route Highlighting:**
  - Blue background
  - Bold text
- **Header:**
  - Business name
  - Mobile menu toggle
- **Responsive:**
  - Desktop: Fixed sidebar
  - Mobile: Hidden, toggle to show

## API Integration

### Service Layer (`services/api.js`)

**Public APIs:**
```javascript
// Get system settings
getPublicSettings()

// Get available slots for date and CA
getAvailableSlots(date, caId)

// Create booking order (Razorpay)
createBooking(bookingData)

// Verify payment
verifyPayment(paymentData)

// Get booking details
getBookingById(bookingId)

// Get available CAs
getAvailableCAs()
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
markCAUnavailable(caId, slots)

// Settings management
getSettings()
updateSettings(settingsData)
addOffDay(date, reason)
removeOffDay(date)
```

**API Client Configuration:**
```javascript
// Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add business ID to all requests
api.interceptors.request.use(config => {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      businessId: import.meta.env.VITE_BUSINESS_ID
    };
  } else {
    config.data = {
      ...config.data,
      businessId: import.meta.env.VITE_BUSINESS_ID
    };
  }
  return config;
});

// Admin secret header for admin APIs
const adminHeaders = {
  'x-admin-secret': import.meta.env.VITE_ADMIN_SECRET
};
```

## Payment Integration

### Razorpay Flow

1. **User Submits Booking**
   - Validate form
   - Check slot availability
   - API call to create order
   - Backend creates Razorpay order

2. **Open Payment Modal**
   ```javascript
   const options = {
     key: RAZORPAY_KEY_ID,
     amount: orderData.amount,
     currency: 'INR',
     order_id: orderData.id,
     name: 'NAB Consultancy',
     description: 'Consultation Booking',
     prefill: {
       name: formData.customer_name,
       email: formData.customer_email,
       contact: formData.customer_phone
     },
     handler: async (response) => {
       // Payment successful
       await verifyPayment(response);
     }
   };
   
   const razorpay = new Razorpay(options);
   razorpay.open();
   ```

3. **Payment Processing**
   - User completes payment in Razorpay modal
   - Multiple payment methods available
   - Razorpay returns payment credentials

4. **Verification & Confirmation**
   - Send credentials to backend
   - Backend verifies signature
   - Backend creates Google Meet link
   - Backend sends 3 emails (Customer, CA, Admin)
   - Redirect to confirmation page

5. **Confirmation Page**
   - Show booking details
   - Display Google Meet link
   - Show next steps
   - Print option

### Test Cards

**Success:**
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

**Failure:**
```
Card: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

**OTP Simulation:**
Use any OTP when prompted in test mode.

## Styling

### Tailwind Configuration

**Custom Colors:**
```javascript
colors: {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',  // Main brand
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  }
}
```

**Custom Animations:**
```javascript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in',
  'slide-up': 'slideUp 0.5s ease-out',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
}
```

### Component Classes

**Buttons:**
```css
.btn-primary {
  @apply bg-primary-600 text-white px-6 py-3 rounded-lg
         font-semibold hover:bg-primary-700 transition-colors
         disabled:bg-gray-300 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply border-2 border-primary-600 text-primary-600
         px-6 py-3 rounded-lg font-semibold
         hover:bg-primary-50 transition-colors;
}
```

**Cards:**
```css
.card {
  @apply bg-white rounded-xl shadow-md p-6
         hover:shadow-lg transition-shadow;
}
```

**Status Badges:**
```css
.badge-pending {
  @apply bg-yellow-100 text-yellow-800 px-3 py-1
         rounded-full text-sm font-medium;
}

.badge-confirmed {
  @apply bg-blue-100 text-blue-800 px-3 py-1
         rounded-full text-sm font-medium;
}

.badge-completed {
  @apply bg-green-100 text-green-800 px-3 py-1
         rounded-full text-sm font-medium;
}

.badge-cancelled {
  @apply bg-red-100 text-red-800 px-3 py-1
         rounded-full text-sm font-medium;
}
```

**Time Slots:**
```css
.time-slot {
  @apply border-2 border-gray-200 rounded-lg p-3
         text-center cursor-pointer transition-all
         hover:border-primary-400 hover:bg-primary-50;
}

.time-slot-selected {
  @apply border-primary-600 bg-primary-100
         text-primary-900 font-semibold;
}

.time-slot-disabled {
  @apply border-gray-200 bg-gray-100
         text-gray-400 cursor-not-allowed
         hover:border-gray-200 hover:bg-gray-100;
}
```

## Responsive Design

### Breakpoints
```javascript
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px'   // Large desktop
```

### Mobile Optimizations

**Navigation:**
- Sidebar → Hamburger menu
- Fixed bottom bar for actions
- Swipe gestures

**Tables:**
- Horizontal scroll
- Card view option
- Collapsible rows

**Forms:**
- Stack vertically
- Full-width inputs
- Larger touch targets (min 44px)

**Grids:**
- Time slots: 3 columns → 2 columns → 1 column
- CA cards: 3 cols → 2 cols → 1 col
- Date picker: Always 7 cols (fits on mobile)

## State Management

### Local State (useState)

**Form State:**
```javascript
const [formData, setFormData] = useState({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  consult_note: ''
});
```

**Selection State:**
```javascript
const [selectedCA, setSelectedCA] = useState(null);
const [selectedDate, setSelectedDate] = useState(null);
const [selectedSlot, setSelectedSlot] = useState(null);
const [selectedDuration, setSelectedDuration] = useState(null);
```

**UI State:**
```javascript
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState({});
const [showModal, setShowModal] = useState(false);
```

**Data State:**
```javascript
const [appointments, setAppointments] = useState([]);
const [cas, setCAs] = useState([]);
const [settings, setSettings] = useState({});
const [bookedSlots, setBookedSlots] = useState([]);
```

### useEffect Patterns

**Fetch on Mount:**
```javascript
useEffect(() => {
  fetchSettings();
  fetchCAs();
}, []);
```

**Fetch on Dependency Change:**
```javascript
useEffect(() => {
  if (selectedDate && selectedCA) {
    fetchAvailableSlots(selectedDate, selectedCA);
  }
}, [selectedDate, selectedCA]);
```

**Cleanup:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    // Debounced search
    searchAppointments(query);
  }, 500);
  
  return () => clearTimeout(timer);
}, [query]);
```

## Error Handling

### API Errors
```javascript
try {
  const response = await api.createBooking(data);
  toast.success('Booking created!');
} catch (error) {
  const message = error.response?.data?.message 
    || 'Something went wrong';
  toast.error(message);
  console.error('Booking error:', error);
}
```

### Validation Errors
```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formData.customer_name) {
    errors.customer_name = 'Name is required';
  }
  
  if (!isValidEmail(formData.customer_email)) {
    errors.customer_email = 'Invalid email format';
  }
  
  if (!isValidPhone(formData.customer_phone)) {
    errors.customer_phone = 'Phone must be 10 digits';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### Loading States
```javascript
// Button loading
<button disabled={loading}>
  {loading ? (
    <>
      <Spinner className="mr-2" />
      Processing...
    </>
  ) : (
    'Proceed to Payment'
  )}
</button>

// Page loading
{loading ? (
  <div className="flex justify-center py-20">
    <Spinner size="lg" />
  </div>
) : (
  <DataTable data={appointments} />
)}
```

## Performance Optimizations

**Code Splitting:**
```javascript
// Lazy load admin pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Appointments = lazy(() => import('./pages/admin/Appointments'));

// Suspense wrapper
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/admin" element={<Dashboard />} />
  </Routes>
</Suspense>
```

**Memoization:**
```javascript
// Expensive calculations
const sortedAppointments = useMemo(() => {
  return appointments.sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
}, [appointments]);

// Callback functions
const handleSlotClick = useCallback((slot) => {
  setSelectedSlot(slot);
}, []);
```

**Debouncing:**
```javascript
// Search input
const debouncedSearch = useMemo(
  () => debounce((query) => {
    searchAppointments(query);
  }, 500),
  []
);
```

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Features Used:**
- ES6+ (transpiled by Vite)
- CSS Grid & Flexbox
- Fetch API
- LocalStorage
- Modern JavaScript (optional chaining, nullish coalescing)

## Development Workflow

### Running Dev Server
```bash
npm run dev
```
- Hot Module Replacement (HMR)
- Fast Refresh for React
- Error overlay
- Auto-open browser at localhost:3000

### Building for Production
```bash
npm run build
```
Outputs to `/dist`:
- Minified JavaScript
- Optimized CSS
- Code splitting
- Tree shaking
- Source maps (optional)
- Asset optimization

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Test before deployment
- Check bundle size
- Verify optimizations

### Linting
```bash
npm run lint
```
- ESLint configuration
- React best practices
- Code quality checks

## Testing

### Manual Testing Checklist

**Booking Flow:**
- [ ] Form validation works correctly
- [ ] CA selection (optional) works
- [ ] Date picker shows correct dates
- [ ] Off days are disabled
- [ ] Time slots update based on CA
- [ ] Booked slots are disabled
- [ ] Duration selection works
- [ ] Payment modal opens
- [ ] Payment success redirects
- [ ] Confirmation shows Meet link
- [ ] Print functionality works

**Admin Panel:**
- [ ] Dashboard stats display correctly
- [ ] Appointments table loads
- [ ] Filters work (status, date, CA, search)
- [ ] Status updates work
- [ ] CA assignment works
- [ ] CA CRUD operations work
- [ ] Settings save correctly
- [ ] Off days can be added/removed
- [ ] Weekly schedule updates
- [ ] Slot durations can be modified

**Responsive:**
- [ ] Mobile menu works
- [ ] Tables scroll on mobile
- [ ] Forms are usable on mobile
- [ ] Touch targets are adequate
- [ ] No horizontal scroll

## Deployment

### Build Configuration

Update `.env` for production:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
VITE_BUSINESS_ID=nab-consultancy
VITE_ADMIN_SECRET=production_secret_here
```

### Deployment Platforms

**1. Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```
Features:
- Automatic HTTPS
- Git integration
- Preview deployments
- Edge network
- Zero configuration

**2. Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```
Features:
- Drag & drop deploy
- Form handling
- Serverless functions
- Split testing

**3. Firebase Hosting**
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```
Features:
- CDN included
- Fast worldwide
- Free SSL
- Firebase integration

**4. AWS S3 + CloudFront**
- Upload `/dist` to S3 bucket
- Configure CloudFront distribution
- Set up SSL certificate
- Configure routing

### Routing Configuration

For client-side routing, configure server:

**Vercel (`vercel.json`):**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify (`netlify.toml`):**
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Troubleshooting

### Common Issues

**1. API Connection Failed**
```
Error: Network Error / CORS

Solutions:
✓ Check VITE_API_URL in .env
✓ Ensure backend is running
✓ Verify CORS settings in backend
✓ Check browser console for details
✓ Test API with curl/Postman
```

**2. Payment Not Working**
```
Error: Razorpay script not loaded

Solutions:
✓ Check VITE_RAZORPAY_KEY_ID
✓ Verify key matches backend
✓ Ensure internet connection
✓ Check browser console
✓ Use test cards in test mode
```

**3. Slots Not Loading**
```
Problem: No time slots showing

Solutions:
✓ Check date format (YYYY-MM-DD)
✓ Verify working hours configured
✓ Check off days in settings
✓ Inspect API response in Network tab
✓ Verify CA is selected (if required)
```

**4. Meet Link Not Showing**
```
Problem: No Meet link on confirmation

Solutions:
✓ Check backend Google Calendar setup
✓ Verify appointment has meet_link field
✓ Check API response for meet_link
✓ Ensure backend created Meet successfully
```

**5. Admin Panel Won't Load**
```
Error: 401 Unauthorized

Solutions:
✓ Verify VITE_ADMIN_SECRET in .env
✓ Check secret matches backend
✓ Ensure no extra spaces in .env
✓ Restart dev server after .env change
✓ Clear browser cache
```

## Future Enhancements

- [ ] User accounts & login
- [ ] Booking history for users
- [ ] Appointment rescheduling
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Push notifications
- [ ] Calendar view in admin
- [ ] Advanced analytics
- [ ] Export reports (PDF, Excel)
- [ ] WhatsApp integration
- [ ] SMS notifications
- [ ] Progressive Web App (PWA)
- [ ] Mobile app (React Native)

---

**Version:** 2.0.0  
**Last Updated:** February 2026  
**Major Updates:** Google Meet integration, CA selection, Enhanced admin panel