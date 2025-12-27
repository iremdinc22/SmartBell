import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './components/home/HomePage'
import About from './components/about/About'
import BookingPage from './components/booking/BookingPage'
import RoomsPage from './components/rooms/RoomsPage'
import Features from './components/features/Features'
import Gallery from './components/gallery/Gallery'
import Rules from './components/rules/Rules'
import AccountPage from './components/account/AccountPage'
import ContactPage from './components/contact/ContactPage'
import PaymentPage from './components/payment/PaymentPage'
import AdminLoginPage from './components/admin/AdminLoginPage'
import AdminPanel from './components/admin/AdminPanel'
import RobotsLocation from './components/admin/RobotsLocation'
import GuestServices from './components/guestservices/GuestServices'
import Checkin from './components/guestservices/Checkin'
import Checkout from './components/guestservices/Checkout'
import Recommendations from './components/features/Recommendations'

import ConfirmationPage from './components/confirmation/ConfirmationPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminPanel />} />
        <Route path="/admin/robots-location" element={<RobotsLocation />} />
        
        {/* Guest Services Routes */}
        <Route path="/guest-services" element={<GuestServices />} />
        <Route path="/guest-services/checkin" element={<Checkin />} />
        <Route path="/guest-services/checkout" element={<Checkout />} />

        {/* Main Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="features" element={<Features />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="rules" element={<Rules />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
