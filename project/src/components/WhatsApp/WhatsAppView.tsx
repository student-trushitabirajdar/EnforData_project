import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
  Calendar,
  Filter
} from 'lucide-react';
import StatsCard from '../Dashboard/StatsCard';

const WhatsAppView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [messageText, setMessageText] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  // Mock data
  const whatsappStats = {
    messagesSent: 1250,
    messagesRemaining: 750,
    deliveryRate: 98,
    responseRate: 45,
    campaignsSent: 15,
    activeClients: 320
  };

  const recentMessages = [
    {
      id: '1',
      recipient: 'John Doe',
      message: 'New property available in Bandra...',
      type: 'marketing',
      status: 'delivered',
      sentAt: '2 hours ago'
    },
    {
      id: '2',
      recipient: 'Bulk Campaign',
      message: 'Festival greetings and special offers...',
      type: 'bulk',
      status: 'sent',
      sentAt: '4 hours ago',
      recipientCount: 150
    },
    {
      id: '3',
      recipient: 'Sarah Wilson',
      message: 'Appointment confirmed for tomorrow...',
      type: 'appointment',
      status: 'read',
      sentAt: '6 hours ago'
    }
  ];

  const messageTemplates = [
    {
      id: '1',
      name: 'New Property Alert',
      category: 'marketing',
      template: 'Hi {name}, we have a new {propertyType} property available in {location} within your budget of ₹{budget}. Would you like to schedule a viewing?'
    },
    {
      id: '2',
      name: 'Appointment Reminder',
      category: 'appointment',
      template: 'Hi {name}, this is a reminder for your property viewing appointment tomorrow at {time}. Location: {address}. Contact me if you need to reschedule.'
    },
    {
      id: '3',
      name: 'Thank You Message',
      category: 'acknowledgment',
      template: 'Thank you {name} for visiting the property today. I hope you liked it. Please let me know if you have any questions or would like to proceed.'
    }
  ];

  const clients = [
    { id: '1', name: 'John Doe', phone: '+91 9876543210', type: 'buyer' },
    { id: '2', name: 'Sarah Wilson', phone: '+91 9876543211', type: 'seller' },
    { id: '3', name: 'Mike Johnson', phone: '+91 9876543212', type: 'tenant' },
    { id: '4', name: 'Emma Davis', phone: '+91 9876543213', type: 'owner' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'marketing':
        return 'bg-blue-100 text-blue-800';
      case 'appointment':
        return 'bg-green-100 text-green-800';
      case 'acknowledgment':
        return 'bg-purple-100 text-purple-800';
      case 'bulk':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    // Mock sending message
    console.log('Sending message:', { messageText, selectedClients });
    setMessageText('');
    setSelectedClients([]);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Messages Sent"
          value={whatsappStats.messagesSent}
          icon={MessageSquare}
          color="blue"
          subtitle="This month"
        />
        <StatsCard
          title="Messages Remaining"
          value={whatsappStats.messagesRemaining}
          icon={Clock}
          color="orange"
          subtitle="Available credits"
        />
        <StatsCard
          title="Delivery Rate"
          value={`${whatsappStats.deliveryRate}%`}
          icon={CheckCircle}
          color="green"
          subtitle="Successful deliveries"
        />
        <StatsCard
          title="Response Rate"
          value={`${whatsappStats.responseRate}%`}
          icon={BarChart3}
          color="purple"
          subtitle="Client responses"
        />
        <StatsCard
          title="Campaigns Sent"
          value={whatsappStats.campaignsSent}
          icon={Send}
          color="teal"
          subtitle="This month"
        />
        <StatsCard
          title="Active Clients"
          value={whatsappStats.activeClients}
          icon={Users}
          color="blue"
          subtitle="Receiving messages"
        />
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
        <div className="space-y-4">
          {recentMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {message.recipient}
                    {message.recipientCount && (
                      <span className="text-gray-500 ml-1">
                        ({message.recipientCount} recipients)
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(message.type)}`}>
                      {message.type}
                    </span>
                    {getStatusIcon(message.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                <p className="text-xs text-gray-500">{message.sentAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSendMessage = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Send WhatsApp Message</h3>
      
      <div className="space-y-6">
        {/* Message Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="individual">Individual Message</option>
            <option value="bulk">Bulk Message</option>
            <option value="segment">Segment-based</option>
          </select>
        </div>

        {/* Recipients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Recipients
          </label>
          <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {clients.map((client) => (
                <label key={client.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClients([...selectedClients, client.id]);
                      } else {
                        setSelectedClients(selectedClients.filter(id => id !== client.id));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-900">
                    {client.name} ({client.type})
                  </span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {selectedClients.length} clients selected
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            {messageText.length}/1000 characters
          </p>
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSendMessage}
            disabled={!messageText || selectedClients.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Message Templates</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </button>
      </div>

      <div className="space-y-4">
        {messageTemplates.map((template) => (
          <div key={template.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(template.category)}`}>
                {template.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{template.template}</p>
            <div className="flex space-x-2">
              <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs hover:bg-blue-100 transition-colors">
                Use Template
              </button>
              <button className="bg-gray-50 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-100 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'send', label: 'Send Message', icon: Send },
    { id: 'templates', label: 'Templates', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Marketing</h1>
        <p className="text-gray-600 mt-1">Manage your WhatsApp campaigns and client communication</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'send' && renderSendMessage()}
          {activeTab === 'templates' && renderTemplates()}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Detailed analytics and reporting features coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppView;