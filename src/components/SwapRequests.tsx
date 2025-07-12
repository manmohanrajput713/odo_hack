import React, { useState } from 'react';
import { SwapRequest, User, Rating } from '../types';
import { Check, X, Star, MessageCircle, Trash2, Clock, CheckCircle } from 'lucide-react';

interface SwapRequestsProps {
  requests: SwapRequest[];
  users: User[];
  currentUser: User;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onDeleteRequest: (requestId: string) => void;
  onCompleteRequest: (requestId: string) => void;
  onRateSwap: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
}

export const SwapRequests: React.FC<SwapRequestsProps> = ({
  requests,
  users,
  currentUser,
  onAcceptRequest,
  onRejectRequest,
  onDeleteRequest,
  onCompleteRequest,
  onRateSwap
}) => {
  const [selectedTab, setSelectedTab] = useState<'received' | 'sent'>('received');
  const [ratingModal, setRatingModal] = useState<{
    request: SwapRequest;
    rating: number;
    comment: string;
  } | null>(null);

  const getUserById = (id: string) => users.find(u => u.id === id);

  const receivedRequests = requests.filter(req => 
    req.toUserId === currentUser.id && req.status !== 'rejected'
  );
  
  const sentRequests = requests.filter(req => 
    req.fromUserId === currentUser.id
  );

  const handleRateSwap = () => {
    if (ratingModal) {
      onRateSwap({
        swapRequestId: ratingModal.request.id,
        fromUserId: currentUser.id,
        toUserId: ratingModal.request.fromUserId === currentUser.id 
          ? ratingModal.request.toUserId 
          : ratingModal.request.fromUserId,
        rating: ratingModal.rating,
        comment: ratingModal.comment
      });
      setRatingModal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const RequestCard: React.FC<{ request: SwapRequest; isReceived: boolean }> = ({ request, isReceived }) => {
    const otherUser = getUserById(isReceived ? request.fromUserId : request.toUserId);
    if (!otherUser) return null;

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
              {otherUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{otherUser.name}</h3>
              <p className="text-sm text-gray-600">{otherUser.location}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {isReceived ? request.skillOffered : request.skillWanted}
            </span>
            <span className="text-gray-400">↔</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
              {isReceived ? request.skillWanted : request.skillOffered}
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">{request.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{request.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isReceived && request.status === 'pending' && (
            <>
              <button
                onClick={() => onAcceptRequest(request.id)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => onRejectRequest(request.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </>
          )}

          {!isReceived && request.status === 'pending' && (
            <button
              onClick={() => onDeleteRequest(request.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Request
            </button>
          )}

          {request.status === 'accepted' && (
            <>
              <button
                onClick={() => onCompleteRequest(request.id)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </button>
            </>
          )}

          {request.status === 'completed' && (
            <button
              onClick={() => setRatingModal({
                request,
                rating: 5,
                comment: ''
              })}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4" />
              Rate & Review
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Swap Requests</h1>
        
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('received')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'received'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Received ({receivedRequests.length})
          </button>
          <button
            onClick={() => setSelectedTab('sent')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'sent'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {selectedTab === 'received' && (
          <>
            {receivedRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No received requests yet</p>
              </div>
            ) : (
              receivedRequests.map(request => (
                <RequestCard key={request.id} request={request} isReceived={true} />
              ))
            )}
          </>
        )}

        {selectedTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sent requests yet</p>
              </div>
            ) : (
              sentRequests.map(request => (
                <RequestCard key={request.id} request={request} isReceived={false} />
              ))
            )}
          </>
        )}
      </div>

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Rate This Swap</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating:
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatingModal({ ...ratingModal, rating: star })}
                      className={`w-8 h-8 ${
                        star <= ratingModal.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment:
                </label>
                <textarea
                  value={ratingModal.comment}
                  onChange={(e) => setRatingModal({ ...ratingModal, comment: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setRatingModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRateSwap}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};