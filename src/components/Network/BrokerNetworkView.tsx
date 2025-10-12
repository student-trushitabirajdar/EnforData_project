import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Building2,
  Filter,
  UserPlus,
  MessageCircle,
  Star,
  Briefcase,
  ChevronDown,
  Users,
  BarChart3,
  X
} from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  company: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  profileImage?: string;
  specialization: string[];
  experience: number;
  propertiesListed: number;
  rating: number;
  isVerified: boolean;
  dealsClosed: number;
}

const BrokerNetworkView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mockBrokers: Broker[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      company: 'Prime Real Estate',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 98765 43210',
      email: 'rajesh@primerealestate.com',
      specialization: ['Residential', 'Commercial'],
      experience: 8,
      propertiesListed: 45,
      rating: 4.8,
      isVerified: true,
      dealsClosed: 127
    },
    {
      id: '2',
      name: 'Priya Sharma',
      company: 'Elite Properties',
      city: 'Delhi',
      state: 'Delhi',
      phone: '+91 98765 43211',
      email: 'priya@eliteproperties.com',
      specialization: ['Luxury', 'Residential'],
      experience: 6,
      propertiesListed: 32,
      rating: 4.6,
      isVerified: true,
      dealsClosed: 89
    },
    {
      id: '3',
      name: 'Amit Patel',
      company: 'Urban Spaces',
      city: 'Bangalore',
      state: 'Karnataka',
      phone: '+91 98765 43212',
      email: 'amit@urbanspaces.com',
      specialization: ['Commercial', 'Industrial'],
      experience: 10,
      propertiesListed: 58,
      rating: 4.9,
      isVerified: true,
      dealsClosed: 156
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      company: 'Golden Key Realty',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 98765 43213',
      email: 'sneha@goldenkey.com',
      specialization: ['Residential', 'Plots'],
      experience: 5,
      propertiesListed: 28,
      rating: 4.5,
      isVerified: true,
      dealsClosed: 67
    },
    {
      id: '5',
      name: 'Vikram Singh',
      company: 'Metro Properties',
      city: 'Pune',
      state: 'Maharashtra',
      phone: '+91 98765 43214',
      email: 'vikram@metroproperties.com',
      specialization: ['Residential', 'Commercial'],
      experience: 7,
      propertiesListed: 41,
      rating: 4.7,
      isVerified: true,
      dealsClosed: 103
    },
    {
      id: '6',
      name: 'Anjali Menon',
      company: 'Heritage Realty',
      city: 'Kochi',
      state: 'Kerala',
      phone: '+91 98765 43215',
      email: 'anjali@heritagerealty.com',
      specialization: ['Luxury', 'Residential'],
      experience: 9,
      propertiesListed: 36,
      rating: 4.8,
      isVerified: true,
      dealsClosed: 112
    },
    {
      id: '7',
      name: 'Rahul Verma',
      company: 'Skyline Properties',
      city: 'Chennai',
      state: 'Tamil Nadu',
      phone: '+91 98765 43216',
      email: 'rahul@skylineproperties.com',
      specialization: ['Commercial', 'Residential'],
      experience: 12,
      propertiesListed: 62,
      rating: 4.9,
      isVerified: true,
      dealsClosed: 178
    },
    {
      id: '8',
      name: 'Kavita Joshi',
      company: 'Dream Home Realty',
      city: 'Jaipur',
      state: 'Rajasthan',
      phone: '+91 98765 43217',
      email: 'kavita@dreamhome.com',
      specialization: ['Residential', 'Plots'],
      experience: 4,
      propertiesListed: 24,
      rating: 4.4,
      isVerified: true,
      dealsClosed: 54
    }
  ];

  const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kochi', 'Jaipur'];
  const specializations = ['All Specializations', 'Residential', 'Commercial', 'Luxury', 'Plots', 'Industrial'];

  const filteredBrokers = mockBrokers.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         broker.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         broker.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = selectedCity === 'all' || broker.city === selectedCity;
    const matchesSpecialization = selectedSpecialization === 'all' ||
                                  broker.specialization.some(s => s === selectedSpecialization);

    return matchesSearch && matchesCity && matchesSpecialization;
  });

  const BrokerCard = ({ broker }: { broker: Broker }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                {broker.name.split(' ').map(n => n[0]).join('')}
              </div>
              {broker.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {broker.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                {broker.company}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="ml-1 text-sm font-semibold text-amber-700">{broker.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
          {broker.city}, {broker.state}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {broker.specialization.map((spec) => (
            <span
              key={spec}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{broker.experience}+</div>
            <div className="text-xs text-gray-500">Years Exp.</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-lg font-semibold text-gray-900">{broker.propertiesListed}</div>
            <div className="text-xs text-gray-500">Properties</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{broker.dealsClosed}</div>
            <div className="text-xs text-gray-500">Deals</div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md">
            <UserPlus className="h-4 w-4" />
            <span className="font-medium text-sm">Connect</span>
          </button>
          <button className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center">
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BrokerListItem = ({ broker }: { broker: Broker }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 p-6 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
              {broker.name.split(' ').map(n => n[0]).join('')}
            </div>
            {broker.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {broker.name}
                </h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Building2 className="h-4 w-4 mr-1.5" />
                  <span className="font-medium">{broker.company}</span>
                </div>
              </div>

              <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-lg">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="ml-1.5 font-semibold text-amber-700">{broker.rating}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
              {broker.city}, {broker.state}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {broker.specialization.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {spec}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{broker.experience}+ Years</div>
                  <div className="text-xs text-gray-500">Experience</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{broker.propertiesListed}</div>
                  <div className="text-xs text-gray-500">Properties</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{broker.dealsClosed}</div>
                  <div className="text-xs text-gray-500">Deals Closed</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-900">{broker.phone}</div>
                  <div className="text-xs text-gray-500">Contact</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                <UserPlus className="h-4 w-4" />
                <span className="font-medium text-sm">Connect</span>
              </button>
              <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium text-sm">Message</span>
              </button>
              <button className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="font-medium text-sm">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Broker Network</h1>
            <p className="text-gray-600 mt-1">Connect with verified real estate brokers across India</p>
          </div>

          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredBrokers.length}</span> Brokers Available
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, city, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 lg:w-auto"
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

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city === 'All Cities' ? 'all' : city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {specializations.map((spec) => (
                      <option key={spec} value={spec === 'All Specializations' ? 'all' : spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(selectedCity !== 'all' || selectedSpecialization !== 'all' || searchQuery) && (
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedCity !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      City: {selectedCity}
                      <button
                        onClick={() => setSelectedCity('all')}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSpecialization !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      Specialization: {selectedSpecialization}
                      <button
                        onClick={() => setSelectedSpecialization('all')}
                        className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedCity('all');
                    setSelectedSpecialization('all');
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

      {filteredBrokers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No brokers found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find brokers</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBrokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBrokers.map((broker) => (
                <BrokerListItem key={broker.id} broker={broker} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrokerNetworkView;
