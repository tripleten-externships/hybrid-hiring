import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import { NotificationsCollection } from '/imports/api/notifications/collection';
import type { Notification } from '/imports/api/notifications/collection';
import './NotificationBell.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';

function BellIcon() {
  return (
    <FontAwesomeIcon icon={faBell} color='white' style={{ fontSize: '1.5rem' }} />
  );
}

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { notifications, unreadCount } = useTracker(() => {
    const sub = Meteor.subscribe('notifications.mine');
    if (!sub.ready()) return { notifications: [], unreadCount: 0 };
    const all = NotificationsCollection.find({}, { sort: { createdAt: -1 } }).fetch();
    return {
      notifications: all,
      unreadCount: all.filter((n) => !n.read).length,
    };
  }, []);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleToggle = () => setOpen((o) => !o);

  const handleMarkAllRead = () => {
    Meteor.callAsync('notifications.markAllRead');
  };

  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      Meteor.callAsync('notifications.markRead', n._id!);
    }
    setOpen(false);
    if (n.jobId) {
      navigate(`/jobs/${n.jobId}`);
    }
  };

  return (
    <div className="notif-bell" ref={panelRef}>
      <button
        className="site-header__icon-btn notif-bell__trigger"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        onClick={handleToggle}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notif-bell__badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-bell__panel" role="region" aria-label="Notifications">
          <div className="notif-bell__panel-header">
            <span className="notif-bell__panel-title">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notif-bell__mark-all"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notif-bell__empty">
              <p>You're all caught up!</p>
            </div>
          ) : (
            <ul className="notif-bell__list" role="list">
              {notifications.map((n) => (
                <li key={n._id}>
                  <button
                    type="button"
                    className={`notif-bell__item${n.read ? '' : ' notif-bell__item--unread'}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <span className="notif-bell__item-dot" aria-hidden="true" />
                    <span className="notif-bell__item-content">
                      <span className="notif-bell__item-title">{n.title}</span>
                      <span className="notif-bell__item-body">{n.body}</span>
                      <span className="notif-bell__item-time">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
