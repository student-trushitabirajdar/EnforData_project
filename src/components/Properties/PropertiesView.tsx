import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, CreditCard as Edit, Trash2, MapPin, Bed, Bath, Square, IndianRupee, Building } from 'lucide-react';
import { Property } from '../../types';
import { apiClient, CreatePropertyRequest } from '../../services/api';

const PropertiesView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Real properties state
  const [realProperties, setRealProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for adding new property
  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment' as 'apartment' | 'house' | 'commercial' | 'plot',
    listingType: 'sale' as 'sale' | 'rent',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    address: '',
    city: '',
    state: '',
    description: '',
    amenities: [] as string[],
    images: [] as File[]
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi'
  ];

  const commonAmenities = [
    'Swimming Pool', 'Gym', 'Security', 'Parking', '24/7 Water',
    'Power Backup', 'Elevator', 'Garden', 'Playground', 'Club House',
    'CCTV', 'Intercom', 'Fire Safety', 'Waste Management', 'Wi-Fi',
    'Air Conditioning', 'Balcony', 'Furnished', 'Semi-Furnished'
  ];

  // Mock data for properties (kept for development/fallback)
  const [mockProperties] = useState<Property[]>([
    {
      id: '1',
      title: 'Luxury 3BHK Apartment in Bandra',
      type: 'apartment',
      listing_type: 'sale',
      price: 25000000,
      area: 1200,
      bedrooms: 3,
      bathrooms: 3,
      location: 'Bandra West, Mumbai',
      address: '123 Linking Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Premium apartment with modern amenities and sea view',
      amenities: ['Swimming Pool', 'Gym', 'Security', 'Parking'],
      images: ['https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'],
      status: 'available',
      owner_id: '1',
      broker_id: '1',
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      title: '2BHK Flat for Rent in Andheri',
      type: 'apartment',
      listing_type: 'rent',
      price: 45000,
      area: 850,
      bedrooms: 2,
      bathrooms: 2,
      location: 'Andheri East, Mumbai',
      address: '456 DN Nagar, Andheri East, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Well-maintained flat near metro station',
      amenities: ['Parking', 'Security', '24/7 Water'],
      images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
      status: 'rented',
      owner_id: '2',
      broker_id: '1',
      created_at: '2024-01-16T08:00:00Z',
      updated_at: '2024-01-16T08:00:00Z'
    },
    {
      id: '3',
      title: 'Commercial Office Space in BKC',
      type: 'commercial',
      listing_type: 'rent',
      price: 150000,
      area: 2000,
      location: 'Bandra Kurla Complex, Mumbai',
      address: 'Tower A, BKC, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      description: 'Premium office space with modern infrastructure',
      amenities: ['Central AC', 'High Speed Internet', 'Conference Room', 'Cafeteria'],
      images: ['https://images.pexels.com/photos/221540/pexels-photo-221540.jpeg'],
      status: 'under_negotiation',
      owner_id: '3',
      broker_id: '1',
      created_at: '2024-01-17T08:00:00Z',
      updated_at: '2024-01-17T08:00:00Z'
    }
  ]);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.getProperties();
      // Transform API properties to match frontend Property type
      const transformedProperties = (response.data || []).map(prop => ({
        ...prop,
        images: [], // Backend doesn't return images yet
        owner_id: prop.broker_id // Use broker_id as owner_id for now
      }));
      setRealProperties(transformedProperties);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch properties';
      setError(errorMessage);
      console.error('Error fetching properties:', err);
      // Fallback to mock data on error is handled in display logic
    } finally {
      setLoading(false);
    }
  };

  // Combine real and mock data for display
  const properties = [...realProperties, ...mockProperties];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesType = filterType === 'all' || property.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'rented':
        return 'bg-orange-100 text-orange-800';
      case 'under_negotiation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number, listingType: string) => {
    const formattedPrice = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
    
    return listingType === 'rent' ? `${formattedPrice}/month` : formattedPrice;
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Title validation (5-255 characters)
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 255) {
      errors.title = 'Title must not exceed 255 characters';
    }

    // Price validation (positive number)
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    // Area validation (positive number)
    if (!formData.area) {
      errors.area = 'Area is required';
    } else if (parseFloat(formData.area) <= 0) {
      errors.area = 'Area must be greater than 0';
    }

    // Bedrooms/Bathrooms validation for apartment/house
    if (formData.type === 'apartment' || formData.type === 'house') {
      if (!formData.bedrooms) {
        errors.bedrooms = 'Bedrooms are required for apartments and houses';
      } else if (parseInt(formData.bedrooms) < 0) {
        errors.bedrooms = 'Bedrooms must be a positive number';
      }

      if (!formData.bathrooms) {
        errors.bathrooms = 'Bathrooms are required for apartments and houses';
      } else if (parseInt(formData.bathrooms) < 0) {
        errors.bathrooms = 'Bathrooms must be a positive number';
      }
    }

    // Location validation (2-255 characters)
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (formData.location.length > 255) {
      errors.location = 'Location must not exceed 255 characters';
    }

    // Address validation (minimum 10 characters)
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      errors.address = 'Address must be at least 10 characters';
    }

    // City validation (2-100 characters)
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
    } else if (formData.city.length > 100) {
      errors.city = 'City must not exceed 100 characters';
    }

    // State validation
    if (!formData.state) {
      errors.state = 'State is required';
    }

    // Description validation (minimum 20 characters)
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      errors.description = 'Description must be at least 20 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError(null);
    setValidationErrors({});
    
    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the validation errors before submitting');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Transform form data to match API request format
      const propertyData: CreatePropertyRequest = {
        title: formData.title.trim(),
        type: formData.type,
        listing_type: formData.listingType,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        location: formData.location.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        description: formData.description.trim(),
        amenities: selectedAmenities,
      };

      // Add bedrooms and bathrooms only if they have values
      if (formData.bedrooms) {
        propertyData.bedrooms = parseInt(formData.bedrooms);
      }
      if (formData.bathrooms) {
        propertyData.bathrooms = parseInt(formData.bathrooms);
      }

      // Call API to create property
      const response = await apiClient.createProperty(propertyData);
      
      // Add new property to the beginning of the list with transformed data
      if (response.data) {
        const newProperty: Property = {
          ...response.data,
          images: [], // Backend doesn't return images yet
          owner_id: response.data.broker_id // Use broker_id as owner_id for now
        };
        setRealProperties([newProperty, ...realProperties]);
      }
      
      // Show success message
      setSuccessMessage('Property added successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Reset form and close modal
      setFormData({
        title: '',
        type: 'apartment',
        listingType: 'sale',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        location: '',
        address: '',
        city: '',
        state: '',
        description: '',
        amenities: [],
        images: []
      });
      setSelectedAmenities([]);
      setValidationErrors({});
      setShowAddModal(false);
    } catch (err) {
      // Handle different types of errors
      let errorMessage = 'Failed to create property';
      
      if (err instanceof Error) {
        // Check for network errors
        if (err.message.toLowerCase().includes('network') || 
            err.message.toLowerCase().includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (err.message.toLowerCase().includes('unauthorized') || 
                   err.message.toLowerCase().includes('401')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (err.message.toLowerCase().includes('validation')) {
          errorMessage = 'Validation error: ' + err.message;
        } else {
          errorMessage = err.message;
        }
      }
      
      setFormError(errorMessage);
      console.error('Error creating property:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Helper function to get input class with error styling
  const getInputClass = (fieldName: string, baseClass: string) => {
    const hasError = validationErrors[fieldName];
    return hasError 
      ? `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
      : baseClass;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your property listings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="under_negotiation">Under Negotiation</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
              <option value="plot">Plot</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading properties</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={fetchProperties}
                className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={property.images?.[0] || 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                  {property.listing_type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    <span>{property.bedrooms} BHK</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    <span>{property.bathrooms} Bath</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.area} sq ft</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-gray-900">
                  <span>{formatPrice(property.price, property.listing_type)}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>
                <button className="flex-1 bg-gray-50 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button className="bg-red-50 text-red-700 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first property'
            }
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Property
          </button>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError(null);
                    setValidationErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Property Type and Listing Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Property Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'apartment', label: 'Apartment' },
                        { value: 'house', label: 'House' },
                        { value: 'commercial', label: 'Commercial' },
                        { value: 'plot', label: 'Plot' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, type: type.value as any });
                            // Clear bedrooms/bathrooms validation errors when type changes
                            if (validationErrors.bedrooms || validationErrors.bathrooms) {
                              const newErrors = { ...validationErrors };
                              delete newErrors.bedrooms;
                              delete newErrors.bathrooms;
                              setValidationErrors(newErrors);
                            }
                          }}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            formData.type === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Listing Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'sale', label: 'For Sale' },
                        { value: 'rent', label: 'For Rent' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, listingType: type.value as any })}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            formData.listingType === type.value
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Property Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={getInputClass('title', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                    placeholder="e.g., Luxury 3BHK Apartment in Bandra"
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                  )}
                </div>

                {/* Price and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className={getInputClass('price', 'w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                        placeholder={formData.listingType === 'rent' ? '45000' : '2500000'}
                        min="0"
                        step="1"
                      />
                    </div>
                    {validationErrors.price ? (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.listingType === 'rent' ? 'Monthly rent amount' : 'Total sale price'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                      Area (sq ft) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className={getInputClass('area', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      placeholder="1200"
                      min="0"
                      step="0.01"
                    />
                    {validationErrors.area && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.area}</p>
                    )}
                  </div>
                </div>

                {/* Bedrooms and Bathrooms - Only for residential properties */}
                {(formData.type === 'apartment' || formData.type === 'house') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className={getInputClass('bedrooms', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      >
                        <option value="">Select Bedrooms</option>
                        <option value="1">1 BHK</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                        <option value="4">4 BHK</option>
                        <option value="5">5 BHK</option>
                        <option value="6">6+ BHK</option>
                      </select>
                      {validationErrors.bedrooms && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.bedrooms}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                        Bathrooms <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className={getInputClass('bathrooms', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      >
                        <option value="">Select Bathrooms</option>
                        <option value="1">1 Bathroom</option>
                        <option value="2">2 Bathrooms</option>
                        <option value="3">3 Bathrooms</option>
                        <option value="4">4 Bathrooms</option>
                        <option value="5">5+ Bathrooms</option>
                      </select>
                      {validationErrors.bathrooms && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.bathrooms}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Location Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Location Details</h3>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={getInputClass('location', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      placeholder="e.g., Bandra West, Mumbai"
                    />
                    {validationErrors.location && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.location}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Complete Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={getInputClass('address', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      placeholder="Enter complete address with landmarks"
                    />
                    {validationErrors.address && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={getInputClass('city', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                        placeholder="Mumbai"
                      />
                      {validationErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
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
                        onChange={handleInputChange}
                        className={getInputClass('state', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                      >
                        <option value="">Select State</option>
                        {indianStates.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {validationErrors.state && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={getInputClass('description', 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent')}
                    placeholder="Describe the property features, nearby amenities, and unique selling points..."
                  />
                  {validationErrors.description ? (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/20 characters minimum
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {commonAmenities.map((amenity) => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedAmenities.length} amenities selected
                  </p>
                </div>

                {/* Form Error Message */}
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error creating property</h3>
                        <p className="mt-1 text-sm text-red-700">{formError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormError(null);
                      setValidationErrors({});
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Add Property'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default PropertiesView;