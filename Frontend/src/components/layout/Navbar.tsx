import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../services/axios';
import notificationService from '../../services/notificationService';
import type { RootState } from '../../store';
import ThemeToggleButton from '../ui/ThemeToggleButton';

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const unsubscribe = notificationService.subscribeToNotifications(() => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
    });

    return unsubscribe;
  }, [queryClient, user?.id]);

  const { data: notificationData } = useQuery({
    queryKey: ['unread-notifications', user?.id || 'unknown'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/notifications/unread/count', { _skipErrorRedirect: true } as any);
        return response.data;
      } catch (e) {
        return { count: 0 };
      }
    },
    enabled: !!user?.id,
    refetchInterval: 30000,
  });

  const unreadCount = notificationData?.count || 0;

  const initial1 = user?.firstName?.[0]?.toUpperCase() || 'U';
  const initial2 = user?.lastName?.[0]?.toUpperCase() || '';
  const initials = `${initial1}${initial2}`;

  const colors = ['bg-[#6366f1]', 'bg-[#7c3aed]', 'bg-[#0891b2]', 'bg-[#4f46e5]', 'bg-[#9333ea]'];
  const colorIndex = initial1.charCodeAt(0) % colors.length;
  const avatarClass = colors[colorIndex] || 'bg-primary';

  return (
    <header className="h-16 w-full glass-nav bg-surface-container-lowest/85 border-b border-outline-variant/25 flex items-center justify-between px-4 lg:px-8 z-30 sticky top-0 shadow-[0_8px_20px_rgba(99,102,241,0.06)]">
      <div className="flex-1 flex items-center">
        <p className="hidden md:block text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
          Workspace
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <ThemeToggleButton className="px-2.5 py-1.5" showLabel={false} />

        <Link to="/notifications" className="relative p-2 rounded-full flex hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all duration-200">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <Link to="/profile" className="flex items-center pl-3 border-l border-outline-variant/35 hover:opacity-90 transition-opacity">
          <div className="hidden md:flex flex-col items-end mr-3">
            <span className="text-sm font-bold text-on-surface leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-[11px] text-on-surface-variant font-semibold">Welcome back</span>
          </div>
          <div className={`w-9 h-9 rounded-full ${avatarClass} text-white flex items-center justify-center font-bold shadow-md shrink-0`}>
            {initials}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
