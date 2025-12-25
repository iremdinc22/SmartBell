/**
 * Validates booking form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} Object containing validation errors
 */
export const validateBookingForm = (formData) => {
  const errors = {};
  const today = new Date().toISOString().split('T')[0];

  // Check-in date validation
  if (!formData.checkIn) {
    errors.checkIn = 'Check-in date is required';
  } else if (formData.checkIn < today) {
    errors.checkIn = 'Check-in date cannot be in the past';
  }

  // Check-out date validation
  if (!formData.checkOut) {
    errors.checkOut = 'Check-out date is required';
  } else if (formData.checkOut <= formData.checkIn) {
    errors.checkOut = 'Check-out date must be after check-in date';
  }

  // Guest count validation
  const totalGuests = parseInt(formData.adults) + parseInt(formData.children);
  if (totalGuests > 5) {
    errors.adults = 'Maximum 5 guests per room';
  } else if (totalGuests < 1) {
    errors.adults = 'At least 1 guest required';
  }

  return errors;
};

/**
 * Calculates the number of nights between check-in and check-out
 * @param {string} checkIn - Check-in date
 * @param {string} checkOut - Check-out date
 * @returns {number} Number of nights
 */
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, nights);
};