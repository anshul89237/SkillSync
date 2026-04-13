import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/axios';
import logo from '../../assets/skillsync-logo-new.svg';

interface SidebarProps {
  role: 'ROLE_LEARNER' | 'ROLE_MENTOR' | 'ROLE_ADMIN';
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
}

const Sidebar = ({ role, isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const learnerNav = [
    { name: 'Dashboard', icon: 'grid_view', path: '/learner' },
    { name: 'Mentor Search', icon: 'person_search', path: '/mentors' },
    { name: 'My Sessions', icon: 'event_upcoming', path: '/sessions' },
    { name: 'Groups', icon: 'groups', path: '/groups' },
  ];

  const mentorNav = [
    { name: 'Dashboard', icon: 'grid_view', path: '/mentor' },
    { name: 'My Sessions', icon: 'event_upcoming', path: '/sessions' },
    { name: 'Group', icon: 'groups', path: '/groups' },
    { name: 'My Availability', icon: 'event_available', path: '/mentor/availability' },
    { name: 'My Profile', icon: 'account_circle', path: '/profile' },
    { name: 'Earnings', icon: 'payments', path: '/mentor/earnings' },
  ];

  const adminNav = [
    { name: 'Dashboard', icon: 'grid_view', path: '/admin' },
    { name: 'Manage Users', icon: 'group', path: '/admin/users' },
    { name: 'Approve Mentors', icon: 'how_to_reg', path: '/admin/mentor-approvals' },
    { name: 'Manage Skills', icon: 'psychology', path: '/admin/skills' },
    { name: 'Manage Groups', icon: 'groups', path: '/admin/groups' },
  ];

  const activeNav = role === 'ROLE_MENTOR' ? mentorNav : role === 'ROLE_ADMIN' ? adminNav : learnerNav;

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout request failed cleanly', e);
    } finally {
      dispatch(logout());
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between z-40 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.05)] ${isCollapsed ? 'w-20' : 'w-20 lg:w-64'}`}>
      
      {/* Collapse Toggle Button - Always visible on desktop */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 border border-outline-variant/30 bg-surface text-on-surface items-center justify-center rounded-full shadow-sm hover:bg-surface-container hover:text-primary z-50 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">{isCollapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>

      <div className="flex flex-col flex-1 overflow-y-auto w-full scrollbar-hide">
        {/* Brand */}
        <div className={`flex items-center justify-center ${isCollapsed ? '' : 'lg:justify-start lg:px-6'} h-20 shrink-0 border-b border-outline-variant/20`}>
          <img src={logo} alt="SkillSync logo" className="w-10 h-10 object-contain rounded-lg shadow-sm" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/40'; }} />
          <div className={`flex-col ml-3 hidden ${isCollapsed ? '' : 'lg:flex'}`}>
            <span className="text-lg font-black text-on-surface tracking-tight leading-tight">SkillSync</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.18em]">
              {role.replace('ROLE_', '')}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 w-full px-2 lg:px-3 py-6 space-y-1">
          {activeNav.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-center ${isCollapsed ? '' : 'lg:justify-start'} px-3 ${isCollapsed ? 'px-3' : 'lg:px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-primary/10 text-primary font-extrabold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-primary rounded-r-full" />
                )}
                <span className={`material-symbols-outlined text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className={`ml-3 text-sm whitespace-nowrap hidden ${isCollapsed ? '' : 'lg:inline'}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className={`w-full shrink-0 p-2 ${isCollapsed ? 'p-2' : 'lg:p-3'} border-t border-outline-variant/20 flex flex-col gap-1.5`}>
        {role === 'ROLE_LEARNER' && (
          <button
            onClick={() => navigate('/mentors')}
            className={`w-full flex items-center justify-center h-11 gradient-btn text-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`}
            title={isCollapsed ? 'Find a Mentor' : undefined}
          >
            <span className="material-symbols-outlined text-xl">search</span>
            <span className={`ml-2 text-sm font-bold whitespace-nowrap hidden ${isCollapsed ? '' : 'lg:inline'}`}>Find a Mentor</span>
          </button>
        )}

        <Link to="/help" className={`w-full flex items-center justify-center ${isCollapsed ? '' : 'lg:justify-start lg:px-4'} px-3 h-11 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all duration-200 group`} title={isCollapsed ? 'Help Center' : undefined}>
          <span className="material-symbols-outlined text-xl group-hover:scale-105 transition-transform">help</span>
          <span className={`ml-3 text-sm font-medium whitespace-nowrap hidden ${isCollapsed ? '' : 'lg:inline'}`}>Help Center</span>
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center ${isCollapsed ? '' : 'lg:justify-start lg:px-4'} px-3 h-11 rounded-xl text-error hover:bg-error/10 transition-all duration-200 group`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-105 transition-transform">logout</span>
          <span className={`ml-3 text-sm font-medium whitespace-nowrap hidden ${isCollapsed ? '' : 'lg:inline'}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
