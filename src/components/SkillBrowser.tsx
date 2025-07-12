import React, { useState } from 'react';
import { User, SwapRequest } from '../types';
import { Search, MapPin, Star, Send, Clock, X, MessageSquare, ArrowRightLeft } from 'lucide-react';

interface SkillBrowserProps {
  users: User[];
  currentUser: User;
  onSendRequest: (request: Omit<SwapRequest, 'id' | 'createdAt'>) => void;
}

export const SkillBrowser: React.FC<SkillBrowserProps> = ({ users, currentUser, onSendRequest }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [requestForm, setRequestForm] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter(user => 
    user.id !== currentUser.id &&
    user.isPublic &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleSendRequest = async () => {
    if (selectedUser && requestForm.skillOffered && requestForm.skillWanted && requestForm.message) {
      setIsSubmitting(true);
      try {
        await onSendRequest({
          fromUserId: currentUser.id,
          toUserId: selectedUser.id,
          skillOffered: requestForm.skillOffered,
          skillWanted: requestForm.skillWanted,
          message: requestForm.message,
          status: 'pending'
        });
        setSelectedUser(null);
        setRequestForm({ skillOffered: '', skillWanted: '', message: '' });
      } catch (error) {
        console.error('Error sending request:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setRequestForm({ skillOffered: '', skillWanted: '', message: '' });
  };

  const getMatchingSkills = () => {
    if (!selectedUser) return { canOffer: [], canLearn: [] };
    
    const canOffer = currentUser.skillsOffered.filter(skill => 
      selectedUser.skillsWanted.includes(skill)
    );
    
    const canLearn = selectedUser.skillsOffered.filter(skill => 
      currentUser.skillsWanted.includes(skill)
    );
    
    return { canOffer, canLearn };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Perfect Skill Swap</h1>
          <p className="text-gray-600 text-lg">Connect with talented people and exchange knowledge</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for skills or people..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-800">{filteredUsers.length}</span> 
          {filteredUsers.length === 1 ? ' person' : ' people'} available for skill swaps
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear search
          </button>
        )}
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm ? 'No matches found' : 'No users available'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? `Try searching for different skills or check back later.`
                : 'Be the first to create a public profile and start skill swapping!'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Show All Users
              </button>
            )}
          </div>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">{user.rating}</span>
                </div>
              </div>

              {user.location && (
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Offers:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{user.skillsOffered.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Wants to learn:</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{user.skillsWanted.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-xs">{user.availability.join(', ')}</span>
                </div>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                >
                  <Send className="w-3 h-3" />
                  Request Swap
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Enhanced Request Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Send Swap Request</h2>
                    <p className="opacity-90">to {selectedUser.name}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Skill Matching Preview */}
              {(() => {
                const { canOffer, canLearn } = getMatchingSkills();
                return (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4" />
                      Skill Match Opportunities
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-blue-700 mb-1">You can offer:</p>
                        {canOffer.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {canOffer.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-xs">No matching skills</p>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-purple-700 mb-1">You can learn:</p>
                        {canLearn.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {canLearn.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-xs">No matching skills</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill you'll offer:
                  </label>
                  <select
                    value={requestForm.skillOffered}
                    onChange={(e) => setRequestForm({ ...requestForm, skillOffered: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a skill</option>
                    {(() => {
                      const { canOffer } = getMatchingSkills();
                      return canOffer.length > 0 ? (
                        <>
                          <optgroup label="Perfect Matches">
                            {canOffer.map(skill => (
                              <option key={skill} value={skill}>{skill} ⭐</option>
                            ))}
                          </optgroup>
                          <optgroup label="Other Skills">
                            {currentUser.skillsOffered.filter(skill => !canOffer.includes(skill)).map(skill => (
                              <option key={skill} value={skill}>{skill}</option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        currentUser.skillsOffered.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))
                      );
                    })()}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill you want to learn:
                  </label>
                  <select
                    value={requestForm.skillWanted}
                    onChange={(e) => setRequestForm({ ...requestForm, skillWanted: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select a skill</option>
                    {(() => {
                      const { canLearn } = getMatchingSkills();
                      return canLearn.length > 0 ? (
                        <>
                          <optgroup label="Perfect Matches">
                            {canLearn.map(skill => (
                              <option key={skill} value={skill}>{skill} ⭐</option>
                            ))}
                          </optgroup>
                          <optgroup label="Other Skills">
                            {selectedUser.skillsOffered.filter(skill => !canLearn.includes(skill)).map(skill => (
                              <option key={skill} value={skill}>{skill}</option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        selectedUser.skillsOffered.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))
                      );
                    })()}
                  </select>
                </div>

                {/* Request Preview */}
                {requestForm.skillOffered && requestForm.skillWanted && (
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Request Preview
                    </h4>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        {requestForm.skillOffered}
                      </span>
                      <ArrowRightLeft className="w-4 h-4 text-gray-400" />
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                        {requestForm.skillWanted}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal message:
                  </label>
                  <textarea
                    value={requestForm.message}
                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                    rows={4}
                    maxLength={500}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Hi! I'd love to learn [skill] from you. I can teach you [skill] in return. I'm available [when] and we could meet [where/how]. Looking forward to hearing from you!"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      Tell them why you'd like to swap and suggest how to get started
                    </p>
                    <span className="text-xs text-gray-400">
                      {requestForm.message.length}/500
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={!requestForm.skillOffered || !requestForm.skillWanted || !requestForm.message || isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};