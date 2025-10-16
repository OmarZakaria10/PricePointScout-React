import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Lock, Save } from "lucide-react";
import { authService } from "../services";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    passwordCurrent: "",
    password: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authService.updateProfile(profileData);
      updateUser(data.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.passwordConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword(passwordData);
      setPasswordData({
        passwordCurrent: "",
        password: "",
        passwordConfirm: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <UserIcon className="text-primary-600" size={36} />
          My Profile
        </h1>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="input-field pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Password Update */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="passwordCurrent"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="passwordCurrent"
                    type="password"
                    value={passwordData.passwordCurrent}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        passwordCurrent: e.target.value,
                      })
                    }
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={passwordData.password}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        password: e.target.value,
                      })
                    }
                    className="input-field pl-10"
                    placeholder="••••••••"
                    minLength={8}
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="passwordConfirm"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                  <input
                    id="passwordConfirm"
                    type="password"
                    value={passwordData.passwordConfirm}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        passwordConfirm: e.target.value,
                      })
                    }
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={18} />
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Account Information */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type</span>
                <span className="font-semibold">{user?.role || "User"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-semibold">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
