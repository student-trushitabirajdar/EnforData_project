import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Tag,
  Clock,
  Eye,
  Heart,
  Share2,
  MoreVertical,
  Pencil,
  Trash2,
  CheckCircle,
  X,
  Building2,
  Sofa,
  Users,
  TrendingUp,
  ChevronDown,
  Image as ImageIcon
} from 'lucide-react';
import { BusinessPost } from '../../types';
import CreatePostModal from './CreatePostModal';

const BusinessPostsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'property' | 'furniture' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<'all' | 'sale' | 'rent' | 'requirement'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const mockPosts: BusinessPost[] = [
    {
      id: '1',
      title: '3 BHK Luxury Apartment in Prime Location',
      category: 'property',
      subcategory: 'sale',
      description: 'Spacious 3 BHK apartment with modern amenities, modular kitchen, and parking. Located in the heart of the city with excellent connectivity.',
      price: 8500000,
      images: ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'],
      location: 'Koramangala, Bangalore',
      contact_info: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh@example.com'
      },
      user_id: '1',
      status: 'active',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Premium Office Furniture Set - Complete Setup',
      category: 'furniture',
      subcategory: 'sale',
      description: 'Complete office furniture set including executive desk, ergonomic chairs, filing cabinets, and conference table. Excellent condition, barely used.',
      price: 125000,
      images: ['https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg'],
      location: 'Whitefield, Bangalore',
      contact_info: {
        name: 'Priya Sharma',
        phone: '+91 98765 43211'
      },
      user_id: '2',
      status: 'active',
      created_at: '2024-01-14T15:20:00Z',
      updated_at: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      title: 'Experienced Real Estate Sales Manager Required',
      category: 'staff',
      subcategory: 'requirement',
      description: 'Looking for an experienced sales manager with 5+ years in real estate. Must have proven track record and excellent communication skills.',
      price: 50000,
      images: [],
      location: 'Mumbai, Maharashtra',
      contact_info: {
        name: 'Amit Patel',
        phone: '+91 98765 43212',
        email: 'amit@realty.com'
      },
      user_id: '3',
      status: 'active',
      created_at: '2024-01-13T09:45:00Z',
      updated_at: '2024-01-13T09:45:00Z'
    },
    {
      id: '4',
      title: 'Commercial Space for Rent - Prime Business District',
      category: 'property',
      subcategory: 'rent',
      description: '2500 sq ft commercial space ideal for offices or retail. High footfall area with ample parking.',
      price: 85000,
      images: ['https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg'],
      location: 'Connaught Place, Delhi',
      contact_info: {
        name: 'Sneha Reddy',
        phone: '+91 98765 43213'
      },
      user_id: '4',
      status: 'active',
      created_at: '2024-01-12T11:15:00Z',
      updated_at: '2024-01-12T11:15:00Z'
    },
    {
      id: '5',
      title: 'Looking for 2 BHK Apartment in South Delhi',
      category: 'property',
      subcategory: 'requirement',
      description: 'Urgently looking for a well-maintained 2 BHK apartment in South Delhi. Budget up to 25000/month.',
      price: 25000,
      images: [],
      location: 'South Delhi, Delhi',
      contact_info: {
        name: 'Vikram Singh',
        phone: '+91 98765 43214'
      },
      user_id: '5',
      status: 'active',
      created_at: '2024-01-11T16:30:00Z',
      updated_at: '2024-01-11T16:30:00Z'
    },
    {
      id: '6',
      title: 'Modular Kitchen and Home Furniture for Sale',
      category: 'furniture',
      subcategory: 'sale',
      description: 'Complete modular kitchen setup with chimney and hob. Also includes bedroom furniture and dining set.',
      price: 175000,
      images: ['https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'],
      location: 'Pune, Maharashtra',
      contact_info: {
        name: 'Anjali Menon',
        phone: '+91 98765 43215',
        email: 'anjali@example.com'
      },
      user_id: '6',
      status: 'active',
      created_at: '2024-01-10T14:00:00Z',
      updated_at: '2024-01-10T14:00:00Z'
    },
    {
      id: '7',
      title: 'Property Documentation Specialist Needed',
      category: 'staff',
      subcategory: 'requirement',
      description: 'Seeking experienced documentation specialist for real estate transactions. Knowledge of legal procedures essential.',
      price: 35000,
      images: [],
      location: 'Chennai, Tamil Nadu',
      contact_info: {
        name: 'Rahul Verma',
        phone: '+91 98765 43216'
      },
      user_id: '7',
      status: 'active',
      created_at: '2024-01-09T10:20:00Z',
      updated_at: '2024-01-09T10:20:00Z'
    },
    {
      id: '8',
      title: 'Luxury Villa with Swimming Pool',
      category: 'property',
      subcategory: 'sale',
      description: 'Beautiful 4 BHK villa with private swimming pool, landscaped garden, and modern amenities. Perfect for families.',
      price: 18500000,
      images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'],
      location: 'Hiranandani, Mumbai',
      contact_info: {
        name: 'Kavita Joshi',
        phone: '+91 98765 43217',
        email: 'kavita@homes.com'
      },
      user_id: '8',
      status: 'active',
      created_at: '2024-01-08T13:45:00Z',
      updated_at: '2024-01-08T13:45:00Z'
    }
  ];

  const filteredPosts = mockPosts.filter(post => {
    const matchesTab = activeTab === 'all' || post.category === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubcategory = selectedSubcategory === 'all' || post.subcategory === selectedSubcategory;

    return matchesTab && matchesSearch && matchesSubcategory;
  });

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'property':
        return Building2;
      case 'furniture':
        return Sofa;
      case 'staff':
        return Users;
      default:
        return Tag;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'property':
        return 'from-blue-500 to-cyan-500';
      case 'furniture':
        return 'from-green-500 to-emerald-500';
      case 'staff':
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getSubcategoryBadgeColor = (subcategory: string) => {
    switch (subcategory) {
      case 'sale':
        return 'bg-green-100 text-green-700';
      case 'rent':
        return 'bg-blue-100 text-blue-700';
      case 'requirement':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const PostCard = ({ post }: { post: BusinessPost }) => {
    const CategoryIcon = getCategoryIcon(post.category);
    const hasImage = post.images.length > 0;

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
        {hasImage ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 ${getSubcategoryBadgeColor(post.subcategory)} rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                <Heart className="h-4 w-4 text-gray-700" />
              </button>
              <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                <Share2 className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`relative h-48 bg-gradient-to-br ${getCategoryColor(post.category)} flex items-center justify-center`}>
            <CategoryIcon className="h-20 w-20 text-white opacity-40" />
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 ${getSubcategoryBadgeColor(post.subcategory)} rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex space-x-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Heart className="h-4 w-4 text-white" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Share2 className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 bg-gradient-to-br ${getCategoryColor(post.category)} rounded-lg`}>
                <CategoryIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-500 capitalize">{post.category}</span>
            </div>
            {post.status === 'active' && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                Active
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {post.description}
          </p>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
            <span className="line-clamp-1">{post.location}</span>
          </div>

          {post.price && (
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{post.price.toLocaleString('en-IN')}
                </span>
                {post.subcategory === 'rent' && (
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                )}
                {post.subcategory === 'requirement' && post.category === 'staff' && (
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5 mr-1" />
              {getTimeAgo(post.created_at)}
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm font-medium flex items-center space-x-2 shadow-sm hover:shadow-md">
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PostListItem = ({ post }: { post: BusinessPost }) => {
    const CategoryIcon = getCategoryIcon(post.category);
    const hasImage = post.images.length > 0;

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden group">
        <div className="flex flex-col md:flex-row">
          {hasImage ? (
            <div className="relative w-full md:w-80 h-56 flex-shrink-0 overflow-hidden">
              <img
                src={post.images[0]}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 ${getSubcategoryBadgeColor(post.subcategory)} rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                  {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
                </span>
              </div>
            </div>
          ) : (
            <div className={`relative w-full md:w-80 h-56 flex-shrink-0 bg-gradient-to-br ${getCategoryColor(post.category)} flex items-center justify-center`}>
              <CategoryIcon className="h-24 w-24 text-white opacity-40" />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 ${getSubcategoryBadgeColor(post.subcategory)} rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                  {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 bg-gradient-to-br ${getCategoryColor(post.category)} rounded-lg`}>
                  <CategoryIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="capitalize">{post.category}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {getTimeAgo(post.created_at)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {post.status === 'active' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Active
                  </span>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
              <span>{post.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                {post.price && (
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{post.price.toLocaleString('en-IN')}
                    </span>
                    {post.subcategory === 'rent' && (
                      <span className="text-sm text-gray-500 ml-1">/month</span>
                    )}
                    {post.subcategory === 'requirement' && post.category === 'staff' && (
                      <span className="text-sm text-gray-500 ml-1">/month</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-sm hover:shadow-md">
                  <Phone className="h-5 w-5" />
                  <span>Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    total: mockPosts.length,
    property: mockPosts.filter(p => p.category === 'property').length,
    furniture: mockPosts.filter(p => p.category === 'furniture').length,
    staff: mockPosts.filter(p => p.category === 'staff').length
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Posts</h1>
            <p className="text-gray-600">Share and discover business opportunities in real estate</p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create Post</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <div className="text-blue-100 text-sm font-medium">Total Posts</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.property}</span>
            </div>
            <div className="text-gray-600 text-sm font-medium">Properties</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Sofa className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.furniture}</span>
            </div>
            <div className="text-gray-600 text-sm font-medium">Furniture</div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.staff}</span>
            </div>
            <div className="text-gray-600 text-sm font-medium">Staff Posts</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-gray-200">
          {(['all', 'property', 'furniture', 'staff'] as const).map((tab) => {
            const Icon = tab === 'all' ? TrendingUp : getCategoryIcon(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="capitalize">{tab === 'all' ? 'All Posts' : tab}</span>
                {tab !== 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab ? 'bg-white/20' : 'bg-white'
                  }`}>
                    {tab === 'property' ? stats.property : tab === 'furniture' ? stats.furniture : stats.staff}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} transition-colors`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="requirement">Requirement</option>
                </select>
              </div>
            </div>

            {(selectedSubcategory !== 'all' || searchQuery) && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedSubcategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Type: {selectedSubcategory}
                      <button
                        onClick={() => setSelectedSubcategory('all')}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedSubcategory('all');
                    setSearchQuery('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filters to find posts</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create Your First Post</span>
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default BusinessPostsView;
