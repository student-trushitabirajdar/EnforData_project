import React, { useState } from 'react';
import {
  Megaphone,
  TrendingUp,
  Users,
  MessageSquare,
  Mail,
  Share2,
  BarChart3,
  Target,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Calendar,
  Eye,
  Heart,
  MousePointer,
  Building2,
  Send,
  Plus,
  Download,
  Filter,
  Search,
  ChevronDown,
  CheckCircle,
  Clock,
  ArrowRight,
  Zap,
  PieChart,
  TrendingDown
} from 'lucide-react';

const MarketingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'templates' | 'analytics'>('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  const marketingStats = {
    totalCampaigns: 24,
    activeCampaigns: 5,
    totalReach: 15420,
    engagementRate: 68,
    leadsGenerated: 342,
    conversionRate: 12.5,
    whatsappMessages: 1250,
    emailsSent: 890,
    socialShares: 456
  };

  const campaigns = [
    {
      id: '1',
      name: 'Luxury Apartments Launch - Q1 2024',
      type: 'property_launch',
      status: 'active',
      channels: ['whatsapp', 'email', 'social'],
      reach: 2500,
      engagement: 72,
      leads: 45,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      budget: 25000,
      spent: 18500,
      image: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'
    },
    {
      id: '2',
      name: 'Festival Special Offers',
      type: 'promotional',
      status: 'active',
      channels: ['whatsapp', 'social'],
      reach: 3200,
      engagement: 65,
      leads: 78,
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      budget: 15000,
      spent: 12000,
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
    },
    {
      id: '3',
      name: 'Commercial Space Campaign',
      type: 'targeted',
      status: 'scheduled',
      channels: ['email', 'whatsapp'],
      reach: 0,
      engagement: 0,
      leads: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      budget: 30000,
      spent: 0,
      image: 'https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg'
    },
    {
      id: '4',
      name: 'New Year Property Deals',
      type: 'seasonal',
      status: 'completed',
      channels: ['whatsapp', 'email', 'social'],
      reach: 5200,
      engagement: 71,
      leads: 125,
      startDate: '2023-12-20',
      endDate: '2024-01-05',
      budget: 35000,
      spent: 32000,
      image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg'
    }
  ];

  const templates = [
    {
      id: '1',
      name: 'Property Launch Announcement',
      category: 'WhatsApp',
      type: 'property_launch',
      preview: 'New luxury apartments launching in [Location]! 🏠 Premium amenities, modern design...',
      uses: 145,
      engagement: 75
    },
    {
      id: '2',
      name: 'Open House Invitation',
      category: 'Email',
      type: 'event',
      preview: 'You are invited to an exclusive open house event at our latest property...',
      uses: 89,
      engagement: 62
    },
    {
      id: '3',
      name: 'Property Showcase Post',
      category: 'Social Media',
      type: 'showcase',
      preview: 'Discover your dream home! Beautiful 3BHK with panoramic city views...',
      uses: 234,
      engagement: 81
    },
    {
      id: '4',
      name: 'Client Testimonial',
      category: 'Social Media',
      type: 'testimonial',
      preview: 'Hear what our satisfied clients have to say about their property journey...',
      uses: 67,
      engagement: 69
    },
    {
      id: '5',
      name: 'Market Update Newsletter',
      category: 'Email',
      type: 'newsletter',
      preview: 'This month in real estate: Latest market trends, property values, and opportunities...',
      uses: 156,
      engagement: 58
    },
    {
      id: '6',
      name: 'Limited Time Offer',
      category: 'WhatsApp',
      type: 'promotional',
      preview: 'Special discount on booking fees! Limited time offer for selected properties...',
      uses: 198,
      engagement: 78
    }
  ];

  const analyticsData = {
    channelPerformance: [
      { channel: 'WhatsApp', sent: 1250, delivered: 1225, opened: 980, clicked: 650, conversion: 82 },
      { channel: 'Email', sent: 890, delivered: 865, opened: 520, clicked: 280, conversion: 45 },
      { channel: 'Social Media', sent: 456, delivered: 456, opened: 380, clicked: 190, conversion: 28 }
    ],
    topPerformingContent: [
      { title: 'Luxury Apartment Showcase', views: 2500, engagement: 82, leads: 45 },
      { title: 'Investment Opportunity Guide', views: 1800, engagement: 75, leads: 38 },
      { title: 'Virtual Property Tours', views: 2100, engagement: 79, leads: 42 },
      { title: 'Festival Special Offers', views: 3200, engagement: 71, leads: 78 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return MessageSquare;
      case 'email':
        return Mail;
      case 'social':
        return Share2;
      default:
        return Megaphone;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Center</h1>
            <p className="text-gray-600">Manage campaigns, templates, and track your marketing performance</p>
          </div>

          <button
            onClick={() => setShowCreateCampaign(true)}
            className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Create Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-3xl font-bold">{marketingStats.totalCampaigns}</span>
            </div>
            <div className="text-blue-100 text-sm font-medium mb-1">Total Campaigns</div>
            <div className="text-xs text-blue-200">{marketingStats.activeCampaigns} active campaigns</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{marketingStats.totalReach.toLocaleString()}</span>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Total Reach</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{marketingStats.leadsGenerated}</span>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Leads Generated</div>
            <div className="flex items-center text-xs text-orange-600">
              <Sparkles className="h-3 w-3 mr-1" />
              {marketingStats.conversionRate}% conversion rate
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{marketingStats.engagementRate}%</span>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Engagement Rate</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above industry average
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Send WhatsApp Blast</span>
                    </div>
                    <p className="text-sm text-gray-600">Send bulk messages to clients</p>
                  </button>

                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                        <Mail className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Email Campaign</span>
                    </div>
                    <p className="text-sm text-gray-600">Create and send email newsletters</p>
                  </button>

                  <button className="p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group text-left">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                        <Share2 className="h-5 w-5 text-orange-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Social Media Post</span>
                    </div>
                    <p className="text-sm text-gray-600">Share properties on social media</p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-green-700">{marketingStats.whatsappMessages}</span>
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">WhatsApp</div>
                    <div className="text-sm text-gray-600 mb-3">Messages sent this month</div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '82%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">82% delivery rate</div>
                  </div>

                  <div className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-blue-700">{marketingStats.emailsSent}</span>
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">Email</div>
                    <div className="text-sm text-gray-600 mb-3">Emails sent this month</div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">65% open rate</div>
                  </div>

                  <div className="p-5 border border-gray-200 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Share2 className="h-6 w-6 text-orange-600" />
                      </div>
                      <span className="text-sm font-semibold text-orange-700">{marketingStats.socialShares}</span>
                    </div>
                    <div className="font-semibold text-gray-900 mb-1">Social Media</div>
                    <div className="text-sm text-gray-600 mb-3">Posts shared this month</div>
                    <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                      <div className="bg-orange-500 h-full" style={{ width: '71%' }}></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">71% engagement rate</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                  <button
                    onClick={() => setActiveTab('campaigns')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                  >
                    View all
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>

                <div className="space-y-3">
                  {campaigns.slice(0, 3).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={campaign.image}
                          alt={campaign.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {campaign.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(campaign.status)}`}>
                                  {campaign.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(campaign.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Eye className="h-4 w-4 mr-1" />
                              {campaign.reach.toLocaleString()} reach
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Target className="h-4 w-4 mr-1" />
                              {campaign.leads} leads
                            </div>
                            <div className="flex items-center text-gray-600">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {campaign.engagement}% engagement
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={campaign.image}
                        alt={campaign.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {campaign.name}
                      </h3>

                      <div className="flex items-center space-x-2 mb-4">
                        {campaign.channels.map((channel) => {
                          const Icon = getChannelIcon(channel);
                          return (
                            <div
                              key={channel}
                              className="p-1.5 bg-gray-100 rounded-lg"
                              title={channel}
                            >
                              <Icon className="h-4 w-4 text-gray-600" />
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <div className="text-lg font-bold text-gray-900">{campaign.reach.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Reach</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{campaign.engagement}%</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{campaign.leads}</div>
                          <div className="text-xs text-gray-500">Leads</div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Budget</span>
                          <span className="font-semibold text-gray-900">
                            ₹{campaign.spent.toLocaleString()} / ₹{campaign.budget.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full"
                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Categories</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Social Media</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h4>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {template.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {template.preview}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Send className="h-4 w-4 mr-1" />
                          {template.uses}
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {template.engagement}%
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Channel</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Sent</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Delivered</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Opened</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Clicked</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Conversions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.channelPerformance.map((channel) => (
                        <tr key={channel.channel} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              {getChannelIcon(channel.channel.toLowerCase().replace(' ', '')) === MessageSquare && (
                                <MessageSquare className="h-5 w-5 text-green-600" />
                              )}
                              {getChannelIcon(channel.channel.toLowerCase().replace(' ', '')) === Mail && (
                                <Mail className="h-5 w-5 text-blue-600" />
                              )}
                              {getChannelIcon(channel.channel.toLowerCase().replace(' ', '')) === Share2 && (
                                <Share2 className="h-5 w-5 text-orange-600" />
                              )}
                              <span className="font-medium text-gray-900">{channel.channel}</span>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4 text-gray-900">{channel.sent.toLocaleString()}</td>
                          <td className="text-center py-4 px-4 text-gray-900">{channel.delivered.toLocaleString()}</td>
                          <td className="text-center py-4 px-4 text-gray-900">{channel.opened.toLocaleString()}</td>
                          <td className="text-center py-4 px-4 text-gray-900">{channel.clicked.toLocaleString()}</td>
                          <td className="text-center py-4 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              {channel.conversion}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
                <div className="space-y-3">
                  {analyticsData.topPerformingContent.map((content, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Eye className="h-4 w-4 mr-1" />
                              {content.views.toLocaleString()} views
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Heart className="h-4 w-4 mr-1" />
                              {content.engagement}% engagement
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Target className="h-4 w-4 mr-1" />
                              {content.leads} leads
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">#{index + 1}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingView;
