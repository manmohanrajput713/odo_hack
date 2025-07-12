import React, { useState } from 'react';
import { ViewType } from './types';
import { useAuth } from './hooks/useAuth';
import { useProfile } from './hooks/useProfile';
import { useSwapRequests } from './hooks/useSwapRequests';
import { useUsers } from './hooks/useUsers';
import { useRatings } from './hooks/useRatings';
import { Auth } from './components/Auth';
import { UserProfile } from './components/UserProfile';
import { SkillBrowser } from './components/SkillBrowser';
import { SwapRequests } from './components/SwapRequests';
import { Dashboard } from './components/Dashboard';
import { Home, User as UserIcon, Search, MessageSquare, RefreshCw, LogOut, MessageSquare as MessageSquareIcon } from 'lucide-react';
import { signOut } from './lib/supabase';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile(user);
  const { requests, sendRequest, updateRequestStatus, deleteRequest } = useSwapRequests(user);
  const { users } = useUsers();
  const { addRating } = useRatings(user);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Auth />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAcceptRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'accepted');
  };

  const handleRejectRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'rejected');
  };

  const handleCompleteRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'completed');
  };

  const NavigationButton: React.FC<{
    view: ViewType;
    icon: React.ReactNode;
    label: string;
    badge?: number;
  }> = ({ view, icon, label, badge }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
        currentView === view
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
          : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-800 hover:shadow-md'
      }`}
    >
      {icon}
      <div className="flex-1 text-left">
        <span className="font-medium block">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );

  const pendingRequestsCount = requests.filter(
    req => req.toUserId === profile.id && req.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SkillSwap</h1>
                <p className="text-sm text-gray-600">Connect. Learn. Grow.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="font-medium text-gray-800">{profile.name}</p>
                <p className="text-sm text-gray-600">{profile.location}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {profile.name.charAt(0)}
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white/80 backdrop-blur-md shadow-lg h-screen sticky top-16 border-r border-gray-200">
          <div className="p-6 space-y-3">
            <NavigationButton
              view="dashboard"
              icon={<Home className="w-5 h-5" />}
              label="Dashboard"
            />
            <NavigationButton
              view="profile"
              icon={<UserIcon className="w-5 h-5" />}
              label="My Profile"
            />
            <NavigationButton
              view="browse"
              icon={<Search className="w-5 h-5" />}
              label="Find Skills"
            />
            <NavigationButton
              view="requests"
              icon={<MessageSquare className="w-5 h-5" />}
              label="Swap Requests"
              badge={pendingRequestsCount}
            />
            
            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('browse')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Find Someone to Swap With
                </button>
                {pendingRequestsCount > 0 && (
                  <button
                    onClick={() => setCurrentView('requests')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {pendingRequestsCount} Pending Request{pendingRequestsCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              user={profile}
              requests={requests}
              allUsers={users}
             onNavigate={setCurrentView}
            />
          )}
          {currentView === 'profile' && (
            <UserProfile
              user={profile}
              onSave={updateProfile}
            />
          )}
          {currentView === 'browse' && (
            <SkillBrowser
              users={users}
              currentUser={profile}
              onSendRequest={sendRequest}
            />
          )}
          {currentView === 'requests' && (
            <SwapRequests
              requests={requests}
              users={users}
              currentUser={profile}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onDeleteRequest={deleteRequest}
              onCompleteRequest={handleCompleteRequest}
              onRateSwap={addRating}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;