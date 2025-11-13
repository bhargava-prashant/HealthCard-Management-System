import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { patientAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PatientProfile = () => {
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await patientAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      await patientAPI.uploadPhoto(formData);
      toast.success('Photo uploaded successfully');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          <div className="max-w-3xl">
            <div className="card mb-6">
              <div className="flex items-center space-x-6">
                {profile?.profilePhoto ? (
                  <img
                    src={profile.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {profile?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold">{profile?.name}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <label className="mt-2 inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploading}
                      id="photo-upload"
                    />
                    <span className="btn-secondary text-sm py-1 px-2 cursor-pointer inline-block">
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Aadhaar"
                  name="aadhaar"
                  value={formData.aadhaar || ''}
                  onChange={handleChange}
                  disabled
                />
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Sex"
                  name="sex"
                  value={formData.sex || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? <LoadingSpinner size="sm" /> : 'Update Profile'}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfile;

