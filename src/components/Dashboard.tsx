import React from 'react';
import { User, SwapRequest } from '../types';
import { Users, Send, CheckCircle, Star, TrendingUp, ArrowRight, Search, MessageSquare } from 'lucide-react';

interface DashboardProps {
  user: User;
  requests: SwapRequest[];
  allUsers: User[];
  onNavigate: (view: 'browse' | 'requests' | 'profile') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, requests, allUsers, onNavigate }) => {
  const receivedRequests = requests.filter(r => r.toUserId === user.id);
  const sentRequests = requests.filter(r => r.fromUserId === user.id);
  const pendingReceived = receivedRequests.filter(r => r.status === 'pending').length;
  const completedSwaps = requests.filter(r => 
    (r.fromUserId === user.id || r.toUserId === user.id) && r.status === 'completed'
  ).length;

  const recentActivity = requests
    .filter(r => r.fromUserId === user.id || r.toUserId === user.id)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number; color: string }> = 
    ({ icon, title, value, color }) => (
      <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Here's your skill swap activity overview</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('browse')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Find Skills
            </button>
            {pendingReceived > 0 && (
              <button
                onClick={() => onNavigate('requests')}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                {pendingReceived} Pending
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Pending Requests"
          value={pendingReceived}
          color="bg-blue-50"
        />
        <StatCard
          icon={<Send className="w-6 h-6 text-purple-600" />}
          title="Sent Requests"
          value={sentRequests.length}
          color="bg-purple-50"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          title="Completed Swaps"
          value={completedSwaps}
          color="bg-green-50"
        />
        <StatCard
          icon={<Star className="w-6 h-6 text-yellow-600" />}
          title="Your Rating"
          value={user.rating}
          color="bg-yellow-50"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.location}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {user.rating} ({user.totalRatings} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Skills Offered</h3>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Want to Learn</h3>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-2">Availability</h3>
                <div className="flex flex-wrap gap-1">
                  {user.availability.map((time, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            </div>

            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="max-w-sm mx-auto">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Ready to start swapping?</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Browse skills from other users and send your first swap request!
                  </p>
                  <button
                    onClick={() => onNavigate('browse')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    Browse Skills
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((request) => {
                  const otherUser = allUsers.find(u => 
                    u.id === (request.fromUserId === user.id ? request.toUserId : request.fromUserId)
                  );
                  const isFromCurrentUser = request.fromUserId === user.id;

                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {otherUser?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {isFromCurrentUser ? 'You sent a request to' : 'Request from'} {otherUser?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {request.skillOffered} ↔ {request.skillWanted}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {request.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};