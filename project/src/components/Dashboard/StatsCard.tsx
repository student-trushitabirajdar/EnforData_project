import React from 'react';
import { Video as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle,
  trend 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    teal: 'text-teal-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-8 hover:shadow-md transition-shadow duration-200 min-h-[120px]">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm lg:text-base font-medium text-gray-600">{title}</h3>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
            </div>
          </div>
          <div className="flex items-baseline">
            <p className="text-3xl lg:text-4xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`ml-3 text-sm lg:text-base font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm lg:text-base text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;