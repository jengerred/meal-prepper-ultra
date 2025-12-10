'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { ArrowLeft, Save, User, Mail, MapPin, Bell, Lock, LogOut, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  
  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      alert('Please enter your password to confirm account deletion');
      return;
    }
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual account deletion with password verification
      console.log('Deleting account with password...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful deletion
      alert('Your account has been successfully deleted.');
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };
  const [formData, setFormData] = useState({
    username: session?.user?.name || '',
    email: session?.user?.email || '',
    location: 'Grand Rapids, MI',
    preferredCurrency: 'USD',
    preferredStores: ['Walmart', 'Meijer', 'Costco'],
    notifications: true,
    marketingEmails: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [newStore, setNewStore] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  
  // Update session data when form data changes
  const updateSessionData = (newData: Partial<typeof formData>) => {
    if (typeof window !== 'undefined') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      localStorage.setItem('userData', JSON.stringify({ ...userData, ...newData }));
    }
  };
  
  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          username: parsedData.username || prev.username,
          location: parsedData.location || prev.location,
          preferredCurrency: parsedData.preferredCurrency || prev.preferredCurrency,
          preferredStores: parsedData.preferredStores || prev.preferredStores,
          notifications: parsedData.notifications ?? prev.notifications,
          marketingEmails: parsedData.marketingEmails ?? prev.marketingEmails
        }));
      }
    }
  }, []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: newValue,
      };
      
      // Update session data in localStorage
      updateSessionData({ [name]: newValue });
      
      return newData;
    });
    
    // Clear any previous errors when user starts typing
    if (saveError) setSaveError('');
  };
  
  const handleAddStore = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (newStore.trim() && !formData.preferredStores.includes(newStore.trim())) {
      const updatedStores = [...formData.preferredStores, newStore.trim()];
      setFormData(prev => ({
        ...prev,
        preferredStores: updatedStores
      }));
      updateSessionData({ preferredStores: updatedStores });
      setNewStore('');
    }
  };
  
  const handleRemoveStore = (storeToRemove: string) => {
    const updatedStores = formData.preferredStores.filter(store => store !== storeToRemove);
    setFormData(prev => ({
      ...prev,
      preferredStores: updatedStores
    }));
    updateSessionData({ preferredStores: updatedStores });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    
    // Validate password fields if any password is being changed
    if (formData.newPassword || formData.confirmPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setSaveError('New passwords do not match');
        return;
      }
      if (formData.newPassword.length < 8) {
        setSaveError('Password must be at least 8 characters long');
        return;
      }
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update session data in localStorage
      updateSessionData({
        username: formData.username,
        location: formData.location,
        notifications: formData.notifications,
        marketingEmails: formData.marketingEmails
      });
      
      setSaveSuccess(true);
      
      // Update the session data in the UI
      if (session?.user) {
        session.user.name = formData.username;
      }
      
      // Clear password fields after successful save
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Show success message
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings. Please try again.';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <a 
            href="/dashboard"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Success/Error Messages */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
              Your settings have been saved successfully!
            </div>
          )}
          {saveError && (
            <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
              {saveError}
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            {/* Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-600" />
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      readOnly
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-100"
                      disabled
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Contact support to change your email address</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    {isEditingLocation ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingLocation(false)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingLocation(true)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditingLocation}
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        isEditingLocation 
                          ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' 
                          : 'border-transparent bg-gray-50'
                      } rounded-md shadow-sm`}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="preferredCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Currency
                  </label>
                  <div className="relative">
                    <select
                      id="preferredCurrency"
                      name="preferredCurrency"
                      value={formData.preferredCurrency}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="JPY">Japanese Yen (¥)</option>
                      <option value="CAD">Canadian Dollar (C$)</option>
                      <option value="AUD">Australian Dollar (A$)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Stores
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.preferredStores.map((store) => (
                      <span 
                        key={store}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {store}
                        <button
                          type="button"
                          onClick={() => handleRemoveStore(store)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove {store}</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newStore}
                      onChange={(e) => setNewStore(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddStore(e)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="Add a store"
                    />
                    <button
                      type="button"
                      onClick={handleAddStore}
                      disabled={!newStore.trim()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifications"
                      name="notifications"
                      type="checkbox"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifications" className="font-medium text-gray-700">
                      Enable notifications
                    </label>
                    <p className="text-gray-500">Get notified about important updates and reminders</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="marketingEmails"
                      name="marketingEmails"
                      type="checkbox"
                      checked={formData.marketingEmails}
                      onChange={handleChange}
                      className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="marketingEmails" className="font-medium text-gray-700">
                      Marketing emails
                    </label>
                    <p className="text-gray-500">Receive tips, recipes, and special offers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Lock className="h-5 w-5 mr-2 text-purple-600" />
                Change Password
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-6 border-t border-red-200 bg-red-50">
              <h2 className="text-lg font-medium text-red-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Danger Zone
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-red-100 pb-4">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-sm font-medium text-red-800">Logout</h3>
                    <p className="text-xs text-red-600">Sign out of your account on this device</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Logout
                  </button>
                </div>
                
                <div className="w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                      <p className="text-xs text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <div className="space-x-2">
                      {!showDeleteConfirm ? (
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Delete Account
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {showDeleteConfirm && (
                    <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-100">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Confirm Account Deletion</h4>
                      <p className="text-xs text-red-600 mb-3">This action cannot be undone. All your data will be permanently deleted.</p>
                      
                      <div className="mb-3">
                        <label htmlFor="deletePassword" className="block text-xs font-medium text-red-700 mb-1">
                          Enter your password to confirm
                        </label>
                        <input
                          type="password"
                          id="deletePassword"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="block w-full px-3 py-2 border border-red-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                          placeholder="Your password"
                          autoComplete="current-password"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting || !deletePassword.trim()}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                          isDeleting || !deletePassword.trim() 
                            ? 'bg-red-400' 
                            : 'bg-red-600 hover:bg-red-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                      >
                        {isDeleting ? 'Deleting...' : 'Permanently Delete My Account'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                // Reset form to original values
                setFormData(prev => ({
                  ...prev,
                  location: 'Grand Rapids, MI',
                  notifications: true,
                  marketingEmails: false,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                }));
                setSaveError('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isSaving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
