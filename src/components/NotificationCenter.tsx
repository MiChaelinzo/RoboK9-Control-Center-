import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Heart, Shield, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'health' | 'security';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onDismiss,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'health' | 'security'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-400" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'error': return <AlertTriangle className="text-red-400" size={16} />;
      case 'health': return <Heart className="text-red-400" size={16} />;
      case 'security': return <Shield className="text-blue-400" size={16} />;
      default: return <Info className="text-blue-400" size={16} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error': return 'border-red-500/30 bg-red-500/10';
      case 'health': return 'border-red-500/30 bg-red-500/10';
      case 'security': return 'border-blue-500/30 bg-blue-500/10';
      default: return 'border-slate-500/30 bg-slate-500/10';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'health') return notification.type === 'health';
    if (filter === 'security') return notification.type === 'security';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl z-50">
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: 'Unread' },
                { id: 'health', label: 'Health' },
                { id: 'security', label: 'Security' }
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id as any)}
                  className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${
                    filter === id
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="p-2">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border mb-2 ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'border-l-4 border-l-cyan-400' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm">
                            {notification.title}
                          </div>
                          <div className="text-slate-300 text-xs mt-1">
                            {notification.message}
                          </div>
                          <div className="text-slate-500 text-xs mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </div>
                          
                          {notification.actionable && notification.action && (
                            <button
                              onClick={notification.action}
                              className="mt-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30 transition-colors"
                            >
                              {notification.actionLabel || 'Take Action'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                            title="Mark as Read"
                          >
                            <CheckCircle size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="p-1 text-slate-400 hover:text-white transition-colors"
                          title="Dismiss"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <Bell className="mx-auto mb-2 text-slate-400" size={32} />
                <p className="text-slate-400">No notifications</p>
              </div>
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-slate-700/50">
              <button
                onClick={onClearAll}
                className="w-full p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;