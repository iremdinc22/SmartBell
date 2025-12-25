import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with actual backend authentication
      console.log('Admin login attempt:', formData);
      
      // Temporary mock authentication
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // Store auth token (replace with actual JWT from backend)
        localStorage.setItem('adminToken', 'mock-admin-token');
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 md:p-12 m-4 bg-white border border-black">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 
            className="text-5xl font-bold text-black tracking-wider"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Zenith Suites
          </h1>
          <p className="text-gray-600 mt-2 tracking-widest text-sm">
            ADMINISTRATOR ACCESS
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-6">
            <label 
              className="block mb-2 text-xs font-bold text-black tracking-widest" 
              htmlFor="username"
            >
              USERNAME
            </label>
            <input
              className="w-full border border-black bg-transparent px-4 py-3 text-base text-black transition-all duration-300 focus:outline-none focus:border-black focus:shadow-[0_0_0_2px_rgba(0,0,0,0.2)] placeholder:text-gray-400"
              id="username"
              name="username"
              placeholder="e.g., admin"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label 
              className="block mb-2 text-xs font-bold text-black tracking-widest" 
              htmlFor="password"
            >
              PASSWORD
            </label>
            <input
              className="w-full border border-black bg-transparent px-4 py-3 text-base text-black transition-all duration-300 focus:outline-none focus:border-black focus:shadow-[0_0_0_2px_rgba(0,0,0,0.2)] placeholder:text-gray-400"
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-black text-white py-[14px] px-5 font-bold tracking-[0.5px] border border-black transition-all duration-300 hover:bg-white hover:text-black disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <a 
              className="text-sm text-gray-600 hover:text-black transition-colors duration-300" 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement forgot password functionality
                alert('Forgot password functionality will be implemented');
              }}
            >
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
