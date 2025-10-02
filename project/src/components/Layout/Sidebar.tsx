import React from 'react';
import { 
  Home, 
  Building, 
  Users, 
  Calendar, 
  MessageSquare, 
  Network, 
  FileText, 
  Megaphone,
  PlusCircle,
  BarChart3,
  Settings,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentSection, onSectionChange }) => {
  const { user } = useAuth();

  const brokerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'properties', label: 'Properties', icon: Building },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'whatsapp', label: 'WhatsApp Marketing', icon: MessageSquare },
    { id: 'network', label: 'Broker Network', icon: Network },
    { id: 'projects', label: 'New Projects', icon: Briefcase },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'business-posts', label: 'Business Posts', icon: PlusCircle },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const channelPartnerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'brokers', label: 'Broker Network', icon: Network },
    { id: 'leads', label: 'Leads Management', icon: Users },
    { id: 'whatsapp', label: 'WhatsApp Marketing', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'marketing', label: 'Marketing', icon: Megaphone }
  ];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'User Management', icon: UserCheck },
    { id: 'properties', label: 'All Properties', icon: Building },
    { id: 'projects', label: 'All Projects', icon: Briefcase },
    { id: 'whatsapp-control', label: 'WhatsApp Control', icon: MessageSquare },
    { id: 'analytics', label: 'Platform Analytics', icon: BarChart3 },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'broker':
        return brokerMenuItems;
      case 'channel_partner':
        return channelPartnerMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return brokerMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {}}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-full border-r border-gray-200 z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-56
      `} style={{ backgroundColor: '#03045E' }}>
        <div className="h-full overflow-y-auto py-4">
          <nav className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-colors duration-200
                    ${currentSection === item.id
                      ? 'bg-white text-gray-900 border-r-2 border-white'
                      : 'text-gray-200 hover:bg-blue-600 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    currentSection === item.id ? 'text-gray-900' : 'text-gray-300'
                  }`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;