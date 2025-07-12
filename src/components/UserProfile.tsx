import React, { useState } from 'react';
import { User } from '../types';
import { Save, Plus, X, MapPin, Clock, Eye, EyeOff } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onSave: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');

  const handleSave = () => {
    onSave(editedUser);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setEditedUser({
        ...editedUser,
        skillsOffered: [...editedUser.skillsOffered, newSkillOffered.trim()]
      });
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setEditedUser({
        ...editedUser,
        skillsWanted: [...editedUser.skillsWanted, newSkillWanted.trim()]
      });
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsOffered: editedUser.skillsOffered.filter((_, i) => i !== index)
    });
  };

  const removeSkillWanted = (index: number) => {
    setEditedUser({
      ...editedUser,
      skillsWanted: editedUser.skillsWanted.filter((_, i) => i !== index)
    });
  };

  const toggleAvailability = (availability: string) => {
    const current = editedUser.availability;
    if (current.includes(availability)) {
      setEditedUser({
        ...editedUser,
        availability: current.filter(a => a !== availability)
      });
    } else {
      setEditedUser({
        ...editedUser,
        availability: [...current, availability]
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="opacity-90">Manage your skills and preferences</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={editedUser.location || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {editedUser.isPublic ? (
                  <Eye className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <EyeOff className="w-5 h-5 text-gray-500 mr-3" />
                )}
                <div>
                  <h3 className="font-medium text-gray-800">Profile Visibility</h3>
                  <p className="text-sm text-gray-600">
                    {editedUser.isPublic ? 'Your profile is public' : 'Your profile is private'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditedUser({ ...editedUser, isPublic: !editedUser.isPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  editedUser.isPublic ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    editedUser.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Skills Offered */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Skills I Can Offer</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillOffered}
                onChange={(e) => setNewSkillOffered(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a skill you can teach"
              />
              <button
                onClick={addSkillOffered}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editedUser.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkillOffered(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Skills I Want to Learn</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillWanted}
                onChange={(e) => setNewSkillWanted(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Add a skill you want to learn"
              />
              <button
                onClick={addSkillWanted}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {editedUser.skillsWanted.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkillWanted(index)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              <Clock className="inline w-6 h-6 mr-2" />
              Availability
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {['Weekends', 'Evenings', 'Weekdays', 'Mornings'].map((time) => (
                <button
                  key={time}
                  onClick={() => toggleAvailability(time)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    editedUser.availability.includes(time)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};