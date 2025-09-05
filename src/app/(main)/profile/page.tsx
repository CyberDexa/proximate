'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProfileData {
  id: string;
  email: string;
  name: string;
  isAgeVerified: boolean;
  profile: {
    lookingFor: string[];
    interestedIn: string[];
    kinks: string[];
    boundaries: string[];
    dealBreakers: string[];
    discreetMode: boolean;
    preferredMeetupTime: string[];
    availability: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  intentions: {
    type: string;
    expiresAt: string | null;
    createdAt: string;
  }[];
  photos: {
    id: string;
    url: string;
    isPrimary: boolean;
    isVerified: boolean;
  }[];
  privatePhotos: {
    id: string;
    url: string;
    isVerified: boolean;
  }[];
  safetyProfile: {
    emergencyContacts: any[];
    safeWord: string;
    consentPreferences: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (data.success) {
        setProfileData(data.profile);
      } else {
        setError(data.error || 'Failed to load profile');
        // If no profile found, redirect to profile setup
        if (response.status === 404) {
          router.push('/profile-setup');
        }
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error Loading Profile</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/profile-setup')}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-lg transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">No Profile Found</h1>
          <p className="mb-4">You haven&apos;t set up your profile yet.</p>
          <button
            onClick={() => router.push('/profile-setup')}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-lg transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/profile-setup')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => router.push('/discover')}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg transition-colors"
              >
                Go to Discover
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {profileData.name}
              </div>
              <div>
                <strong>Email:</strong> {profileData.email}
              </div>
              <div>
                <strong>Age Verified:</strong> {profileData.isAgeVerified ? '✅ Yes' : '❌ No'}
              </div>
              <div>
                <strong>Profile Created:</strong> {new Date(profileData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Current Intentions */}
          {profileData.intentions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Active Intentions</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.intentions.map((intention, index) => (
                  <span key={index} className="bg-pink-600 px-3 py-1 rounded-full text-sm">
                    {intention.type}
                    {intention.expiresAt && (
                      <span className="ml-1 text-xs">
                        (expires: {new Date(intention.expiresAt).toLocaleDateString()})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Profile Details */}
          {profileData.profile && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Looking For */}
                {profileData.profile.lookingFor.length > 0 && (
                  <div>
                    <strong>Looking For:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.lookingFor.map((item, index) => (
                        <span key={index} className="bg-purple-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interested In */}
                {profileData.profile.interestedIn.length > 0 && (
                  <div>
                    <strong>Interested In:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.interestedIn.map((item, index) => (
                        <span key={index} className="bg-indigo-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kinks */}
                {profileData.profile.kinks.length > 0 && (
                  <div>
                    <strong>Kinks:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.kinks.map((item, index) => (
                        <span key={index} className="bg-red-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boundaries */}
                {profileData.profile.boundaries.length > 0 && (
                  <div>
                    <strong>Boundaries:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.boundaries.map((item, index) => (
                        <span key={index} className="bg-orange-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                {profileData.profile.availability.length > 0 && (
                  <div>
                    <strong>Availability:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.availability.map((item, index) => (
                        <span key={index} className="bg-green-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preferred Meetup Time */}
                {profileData.profile.preferredMeetupTime.length > 0 && (
                  <div>
                    <strong>Preferred Meetup Time:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.profile.preferredMeetupTime.map((item, index) => (
                        <span key={index} className="bg-blue-600 px-2 py-1 rounded text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="mt-4">
                <strong>Privacy Settings:</strong>
                <p className="mt-1">
                  Discreet Mode: {profileData.profile.discreetMode ? '🔒 Enabled' : '🔓 Disabled'}
                </p>
              </div>
            </div>
          )}

          {/* Photos */}
          {profileData.photos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Public Photos ({profileData.photos.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileData.photos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt="Profile"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {photo.isPrimary && (
                      <span className="absolute top-1 left-1 bg-gold text-black px-1 text-xs rounded">
                        Primary
                      </span>
                    )}
                    {photo.isVerified && (
                      <span className="absolute top-1 right-1 text-green-400">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Private Photos */}
          {profileData.privatePhotos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Private Photos ({profileData.privatePhotos.length})</h2>
              <p className="text-sm text-gray-300 mb-3">
                These photos are only visible to matched users with consent.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileData.privatePhotos.map((photo) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt="Private"
                      className="w-full h-32 object-cover rounded-lg border-2 border-pink-500"
                    />
                    {photo.isVerified && (
                      <span className="absolute top-1 right-1 text-green-400">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety Profile */}
          {profileData.safetyProfile && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Safety Profile</h2>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong>Emergency Contacts:</strong>
                    <p className="mt-1">
                      {profileData.safetyProfile.emergencyContacts.length > 0
                        ? `${profileData.safetyProfile.emergencyContacts.length} contact(s) configured`
                        : 'None configured'
                      }
                    </p>
                  </div>
                  <div>
                    <strong>Safe Word:</strong>
                    <p className="mt-1">
                      {profileData.safetyProfile.safeWord ? '✅ Configured' : '❌ Not set'}
                    </p>
                  </div>
                  <div>
                    <strong>Consent Preferences:</strong>
                    <p className="mt-1">
                      {profileData.safetyProfile.consentPreferences.length > 0
                        ? `${profileData.safetyProfile.consentPreferences.length} preference(s) set`
                        : 'None set'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-sm text-gray-300 text-center">
            Profile last updated: {new Date(profileData.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
