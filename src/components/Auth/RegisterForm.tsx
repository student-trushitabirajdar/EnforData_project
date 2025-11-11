import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    firmName: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    whatsappNumber: '',
    alternativeNumber: '',
    foreignNumber: '',
    address: '',
    location: '',
    city: '',
    state: '',
    postalCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'broker' as 'broker' | 'channel_partner' | 'admin'
  });
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFieldErrors({});

    // Validation
    const errors: Record<string, string> = {};

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Validate required fields
    const requiredFields: Record<string, string> = {
      firmName: 'Firm Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      whatsappNumber: 'WhatsApp Number',
      address: 'Address',
      location: 'Location',
      city: 'City',
      state: 'State',
      postalCode: 'Postal Code',
      email: 'Email',
      password: 'Password'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        errors[field] = `${label} is required`;
      }
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    if (formData.whatsappNumber && !/^\+?[\d\s-]{10,}$/.test(formData.whatsappNumber)) {
      errors.whatsappNumber = 'Please enter a valid phone number';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fix the errors below');
      setIsLoading(false);
      return;
    }

    try {
      // Create user data for registration matching backend API format
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        date_of_birth: formData.dateOfBirth,
        firm_name: formData.firmName,
        role: formData.role,
        whatsapp_number: formData.whatsappNumber,
        alternative_number: formData.alternativeNumber || undefined,
        foreign_number: formData.foreignNumber || undefined,
        address: formData.address,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postalCode
      };

      await register(userData);
      
      // Registration successful - user is now logged in automatically
      // No need to switch to login form
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Parse backend validation errors
      let errorMessage = err.message || 'Registration failed. Please try again.';
      
      // Try to extract field-specific errors from validation messages
      if (err.message && err.message.includes('Field validation')) {
        // Parse Go validator error format
        const validationMatch = err.message.match(/Field validation for '(\w+)' failed on the '(\w+)' tag/);
        if (validationMatch) {
          const fieldName = validationMatch[1];
          const validationType = validationMatch[2];
          
          // Map backend field names to form field names
          const fieldMap: Record<string, string> = {
            'Email': 'email',
            'Password': 'password',
            'WhatsappNumber': 'whatsappNumber',
            'FirstName': 'firstName',
            'LastName': 'lastName',
            'FirmName': 'firmName',
            'DateOfBirth': 'dateOfBirth',
            'PostalCode': 'postalCode',
            'Address': 'address',
            'Location': 'location',
            'City': 'city',
            'State': 'state',
            'Role': 'role'
          };
          
          const mappedField = fieldMap[fieldName];
          
          // Create user-friendly error messages
          const validationMessages: Record<string, string> = {
            'required': 'This field is required',
            'email': 'Please enter a valid email address',
            'min': 'Value is too short',
            'max': 'Value is too long',
            'oneof': 'Invalid value selected'
          };
          
          const friendlyMessage = validationMessages[validationType] || `Validation failed: ${validationType}`;
          
          if (mappedField) {
            setFieldErrors({ [mappedField]: friendlyMessage });
            errorMessage = `Validation error: ${fieldName} - ${friendlyMessage}`;
          }
        }
      } else if (err.message && err.message.includes(':')) {
        // Handle other error formats
        const parts = err.message.split(':');
        const fieldName = parts[0].trim().toLowerCase().replace(/\s+/g, '_');
        const errorMsg = parts.slice(1).join(':').trim();
        
        const fieldMap: Record<string, string> = {
          'email': 'email',
          'password': 'password',
          'whatsapp_number': 'whatsappNumber',
          'first_name': 'firstName',
          'last_name': 'lastName',
          'firm_name': 'firmName',
          'date_of_birth': 'dateOfBirth',
          'postal_code': 'postalCode'
        };
        
        const mappedField = fieldMap[fieldName];
        if (mappedField) {
          setFieldErrors({ [mappedField]: errorMsg });
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getInputClassName = (fieldName: string, baseClass: string) => {
    return `${baseClass} ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Photo size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }

      setProfilePhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join ENFOR DATA and grow your business</p>
      </div>

      {/* Role Selection Cards */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
          Select Your Role
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setFormData({ ...formData, role: 'broker' })}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.role === 'broker'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                formData.role === 'broker'
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.role === 'broker' && (
                  <div className="w-3 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Real Estate Broker</h4>
            </div>
            <p className="text-sm text-gray-600 ml-8">Manage properties, clients, and grow your business</p>
          </div>
          
          <div
            onClick={() => setFormData({ ...formData, role: 'channel_partner' })}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
              formData.role === 'channel_partner'
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-3">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                formData.role === 'channel_partner'
                  ? 'border-teal-500 bg-teal-500'
                  : 'border-gray-300'
              }`}>
                {formData.role === 'channel_partner' && (
                  <div className="w-3 h-3 bg-white rounded-full mx-auto mt-0.5"></div>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Channel Partner</h4>
            </div>
            <p className="text-sm text-gray-600 ml-8">Showcase projects and connect with brokers</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Firm Name */}
        <div>
          <label htmlFor="firmName" className="block text-sm font-medium text-gray-700 mb-1">
            Firm Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firmName"
            name="firmName"
            value={formData.firmName}
            onChange={handleChange}
            className={getInputClassName('firmName', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
            placeholder="Enter your firm name"
            required
          />
          {fieldErrors.firmName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.firmName}</p>
          )}
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={getInputClassName('firstName', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="First name"
              required
            />
            {fieldErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={getInputClassName('lastName', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="Last name"
              required
            />
            {fieldErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={getInputClassName('dateOfBirth', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
            required
          />
          {fieldErrors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.dateOfBirth}</p>
          )}
        </div>

        {/* Contact Numbers */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          
          <div>
            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              className={getInputClassName('whatsappNumber', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="+91 9876543210"
              required
            />
            {fieldErrors.whatsappNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.whatsappNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="alternativeNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Number
            </label>
            <input
              type="tel"
              id="alternativeNumber"
              name="alternativeNumber"
              value={formData.alternativeNumber}
              onChange={handleChange}
              className={getInputClassName('alternativeNumber', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="+91 9876543211"
            />
            {fieldErrors.alternativeNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.alternativeNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="foreignNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Foreign Number
            </label>
            <input
              type="tel"
              id="foreignNumber"
              name="foreignNumber"
              value={formData.foreignNumber}
              onChange={handleChange}
              className={getInputClassName('foreignNumber', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="+1 234 567 8900"
            />
            {fieldErrors.foreignNumber && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.foreignNumber}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={getInputClassName('address', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="Enter your complete address"
              required
            />
            {fieldErrors.address && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={getInputClassName('location', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
              placeholder="Area/Locality"
              required
            />
            {fieldErrors.location && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={getInputClassName('city', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
                placeholder="City"
                required
              />
              {fieldErrors.city && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={getInputClassName('state', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
                required
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {fieldErrors.state && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={getInputClassName('postalCode', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
                placeholder="400001"
                required
              />
              {fieldErrors.postalCode && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Size Photo
          </label>
          <div className="flex items-center space-x-4">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label
                htmlFor="profilePhoto"
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </label>
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email ID <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={getInputClassName('email', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent')}
            placeholder="your@email.com"
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={getInputClassName('password', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent pr-10')}
                placeholder="Create password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={getInputClassName('confirmPassword', 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent pr-10')}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="rounded border-gray-300 text-blue-600"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;