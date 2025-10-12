import React, { useState } from 'react';
import {
  X,
  Building2,
  Sofa,
  Users,
  Upload,
  MapPin,
  IndianRupee,
  FileText,
  Phone,
  Mail,
  User,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  category: 'property' | 'furniture' | 'staff' | '';
  subcategory: 'sale' | 'rent' | 'requirement' | '';
  description: string;
  price: string;
  location: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  images: File[];
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    images: []
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files].slice(0, 5);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.subcategory) newErrors.subcategory = 'Please select a type';
    } else if (step === 2) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';

      if (formData.subcategory !== 'requirement') {
        if (!formData.price.trim()) {
          newErrors.price = 'Price is required';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
          newErrors.price = 'Please enter a valid price';
        }
      }
    } else if (step === 3) {
      if (!formData.contactName.trim()) newErrors.contactName = 'Name is required';
      if (!formData.contactPhone.trim()) {
        newErrors.contactPhone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.contactPhone.replace(/[^\d]/g, ''))) {
        newErrors.contactPhone = 'Please enter a valid phone number';
      }
      if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  const getCategoryInfo = () => {
    switch (formData.category) {
      case 'property':
        return {
          icon: Building2,
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'furniture':
        return {
          icon: Sofa,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'staff':
        return {
          icon: Users,
          color: 'from-orange-500 to-amber-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: FileText,
          color: 'from-gray-500 to-slate-500',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  const categoryInfo = getCategoryInfo();
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Business Post</h2>
            <p className="text-sm text-gray-600 mt-1">Share your business opportunity with the network</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      currentStep > step
                        ? 'bg-green-500 text-white'
                        : currentStep === step
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:inline ${
                      currentStep >= step ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step === 1 ? 'Category' : step === 2 ? 'Details' : 'Contact'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-3 rounded-full transition-all duration-300 ${
                      currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'property', label: 'Property', icon: Building2, color: 'from-blue-500 to-cyan-500' },
                    { value: 'furniture', label: 'Furniture', icon: Sofa, color: 'from-green-500 to-emerald-500' },
                    { value: 'staff', label: 'Staff', icon: Users, color: 'from-orange-500 to-amber-500' }
                  ].map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleInputChange('category', cat.value)}
                        className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                          formData.category === cat.value
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div
                          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3`}
                        >
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{cat.label}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {cat.value === 'property' && 'Real estate listings'}
                            {cat.value === 'furniture' && 'Furniture & equipment'}
                            {cat.value === 'staff' && 'Job opportunities'}
                          </div>
                        </div>
                        {formData.category === cat.value && (
                          <div className="mt-3">
                            <CheckCircle className="h-6 w-6 text-blue-600 mx-auto" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.category && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.category}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'sale', label: 'For Sale', desc: 'Selling items or property' },
                    { value: 'rent', label: 'For Rent', desc: 'Renting out items or property' },
                    { value: 'requirement', label: 'Requirement', desc: 'Looking for something' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('subcategory', type.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        formData.subcategory === type.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{type.label}</span>
                        {formData.subcategory === type.value && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{type.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.subcategory && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.subcategory}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl ${categoryInfo.bgColor} border ${categoryInfo.borderColor}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-br ${categoryInfo.color} rounded-lg`}>
                    <CategoryIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Creating post for</div>
                    <div className="font-semibold text-gray-900 capitalize">
                      {formData.category} - {formData.subcategory}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter a catchy title for your post"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.title ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.title && (
                  <div className="mt-1 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.title}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide detailed information about your post"
                  rows={5}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors.description && (
                  <div className="mt-1 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-500">
                  {formData.description.length} / 1000 characters
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {formData.subcategory === 'requirement' ? 'Budget (Optional)' : 'Price'}
                    {formData.subcategory !== 'requirement' && <span className="text-red-500"> *</span>}
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value.replace(/[^\d]/g, ''))}
                      placeholder={formData.subcategory === 'rent' ? 'Monthly rent' : 'Enter amount'}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.price ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </div>
                  )}
                  {formData.price && !errors.price && (
                    <div className="mt-1 text-sm text-gray-600">
                      ₹{Number(formData.price).toLocaleString('en-IN')}
                      {formData.subcategory === 'rent' && '/month'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                        errors.location ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.location}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images (Optional) - Max 5
                </label>
                <div className="space-y-4">
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {imagePreviews.length < 5 && (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <div className="text-sm font-medium text-gray-700 mb-1">
                          Click to upload images
                        </div>
                        <div className="text-xs text-gray-500">
                          PNG, JPG up to 5MB ({5 - imagePreviews.length} remaining)
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl ${categoryInfo.bgColor} border ${categoryInfo.borderColor}`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-br ${categoryInfo.color} rounded-lg`}>
                    <CategoryIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{formData.title}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {formData.category} - {formData.subcategory}
                    </div>
                  </div>
                  {formData.price && (
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{Number(formData.price).toLocaleString('en-IN')}</div>
                      {formData.subcategory === 'rent' && (
                        <div className="text-xs text-gray-600">/month</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Provide your contact details so interested parties can reach you
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange('contactName', e.target.value)}
                        placeholder="Full name"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.contactName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.contactName && (
                      <div className="mt-1 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactName}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.contactPhone ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.contactPhone && (
                      <div className="mt-1 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactPhone}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="your.email@example.com"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.contactEmail ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.contactEmail && (
                      <div className="mt-1 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.contactEmail}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <div className="font-semibold mb-1">Privacy Notice</div>
                    <div>Your contact information will be visible to all users viewing this post. Please ensure you're comfortable sharing these details publicly.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>

            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Publish Post</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
