import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import userService from '../../services/userService';
import PageLayout from '../../components/layout/PageLayout';
import { useToast } from '../../components/ui/Toast';
import type { RootState } from '../../store';
import { updateUserName } from '../../store/slices/authSlice';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const role = useSelector((state: RootState) => state.auth.role);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
  });
  const [canSaveEdits, setCanSaveEdits] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getMyProfile(),
  });

  useEffect(() => {
    if (!profile) return;

    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      bio: profile.bio || '',
      phone: profile.phone || '',
      location: profile.location || '',
    });
  }, [profile]);

  useEffect(() => {
    if (!isEditing) {
      setCanSaveEdits(false);
      return;
    }

    // Prevent accidental immediate submit when switching from Edit button to Save button.
    const timer = window.setTimeout(() => setCanSaveEdits(true), 600);
    return () => window.clearTimeout(timer);
  }, [isEditing]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: () => {
      const cleanedPayload = {
        firstName: formData.firstName.trim().length >= 2 ? formData.firstName.trim() : undefined,
        lastName: formData.lastName.trim().length >= 2 ? formData.lastName.trim() : undefined,
        bio: formData.bio.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        location: formData.location.trim() || undefined,
      };

      return userService.updateProfile(cleanedPayload);
    },
    onSuccess: () => {
      showToast({ message: 'Profile updated successfully', type: 'success' });
      setIsEditing(false);
      dispatch(updateUserName({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      }));
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Failed to update profile';
      showToast({ message: msg, type: 'error' });
    },
  });


  const handleSubmit = () => {
    if (!isEditing || !canSaveEdits) {
      return;
    }

    if (formData.firstName.trim() && formData.firstName.trim().length < 2) {
      showToast({ message: 'First name must be at least 2 characters.', type: 'error' });
      return;
    }

    if (formData.lastName.trim() && formData.lastName.trim().length < 2) {
      showToast({ message: 'Last name must be at least 2 characters.', type: 'error' });
      return;
    }

    updateProfileMutation.mutate();
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-sm font-medium text-gray-500">Loading profile...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || 'Your Profile';
  const initials = (profile?.firstName?.[0] || '') + (profile?.lastName?.[0] || '') || 'U';
  const completionPct = profile?.profileCompletePct ?? 0;

  const inputBaseClass =
    'w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2';
  const inputActiveClass = `${inputBaseClass} border-gray-300 bg-white text-gray-900 focus:ring-indigo-500 focus:border-indigo-500`;
  const inputDisabledClass = `${inputBaseClass} border-gray-200 bg-gray-50 text-gray-700 cursor-default`;

  return (
    <PageLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-white rounded-full translate-y-1/2" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 p-8 md:p-10">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-black shadow-lg border-2 border-white/30">
                {initials}
              </div>
              {completionPct > 0 && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-indigo-700 text-xs font-bold shadow-md">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  {completionPct}%
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{displayName}</h1>
              {profile?.email && (
                <p className="text-indigo-200 text-sm mt-1 font-medium">{profile.email}</p>
              )}
              <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold tracking-wide">
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                  {(role || 'ROLE_LEARNER').replace('ROLE_', '')}
                </span>
              </div>
            </div>

            {/* Edit Toggle */}
            <div className="shrink-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-md"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={updateProfileMutation.isPending || !canSaveEdits}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors shadow-md disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-sm hover:bg-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-xl">person</span>
              Personal Information
            </h2>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? inputActiveClass : inputDisabledClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? inputActiveClass : inputDisabledClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={isEditing ? inputActiveClass : inputDisabledClass}
                placeholder={isEditing ? 'Write a short bio...' : '—'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">call</span>
                    Phone
                  </span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? inputActiveClass : inputDisabledClass}
                  placeholder={isEditing ? '+91 ...' : '—'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    Location
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className={isEditing ? inputActiveClass : inputDisabledClass}
                  placeholder={isEditing ? 'City, Country' : '—'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-xl">settings</span>
              Account Settings
            </h2>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={() => navigate('/settings/password')}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-sm">Change Password</p>
                <p className="text-xs text-gray-500 mt-0.5">Update your password regularly for account security</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 group-hover:text-indigo-500 transition-colors">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserProfilePage;
