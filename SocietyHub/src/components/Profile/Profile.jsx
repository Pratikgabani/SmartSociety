import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { toast, Toaster } from "react-hot-toast";
import { HashLoader } from "react-spinners";
import UserContext from "../../context/UserContext";
import {
  User,
  Mail,
  Phone,
  Home,
  Shield,
  Lock,
  Save,
  Eye,
  EyeOff,
  Building2,
  Edit3,
  X,
  Check,
} from "lucide-react";

function Profile() {
  const { rolee } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit contact state
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [phoneNo2, setPhoneNo2] = useState("");
  const [contactSaving, setContactSaving] = useState(false);

  // Change password state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/currentUser`,
          { withCredentials: true }
        );
        setUser(res.data.data);
        setPhoneNo(res.data.data.phoneNo || "");
        setPhoneNo2(res.data.data.phoneNo2 || "");
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleContactSave = async () => {
    if (!phoneNo.trim()) return toast.error("Phone number is required");
    setContactSaving(true);
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/updateAccountDetails`,
        { phoneNo: phoneNo.trim(), phoneNo2: phoneNo2.trim() },
        { withCredentials: true }
      );
      setUser(res.data.data);
      setIsEditingContact(false);
      toast.success("Contact info updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setContactSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All password fields are required");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return toast.error(
        "Password must be 8-16 chars with uppercase, lowercase, number, and special character"
      );
    }

    setPasswordSaving(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_URL_BACKEND}/api/v1/users/changePassword`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <HashLoader size={52} color="#2563eb" loading={loading} />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Could not load profile.</p>
      </div>
    );
  }

  const roleBadge = {
    admin: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", label: "Admin" },
    user: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Resident" },
    security: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Security" },
  };
  const badge = roleBadge[user.role] || roleBadge.user;

  return (
    <div className="max-w-[1200px] mx-auto py-6 px-4 md:py-8 md:px-6 font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Toaster />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 m-0 tracking-[-0.3px]">My Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 mb-0">View and manage your account information</p>
      </div>

      {/* Profile Card — Identity */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 relative">
          <div className="flex items-center gap-5">
            <div className="w-[72px] h-[72px] bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-lg">
              <User size={36} strokeWidth={1.8} />
            </div>
            <div className="text-white min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold m-0 tracking-tight truncate">{user.name}</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 mb-0 font-medium truncate">{user.email}</p>
            </div>
          </div>
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.3px] border shadow-sm bg-white/90 backdrop-blur-sm ${badge.text}`}
            >
              <Shield size={13} strokeWidth={2.5} />
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Address & Society Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Home size={18} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider m-0">Address</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Block</span>
              <span className="text-sm font-semibold text-gray-900">{user.block || "—"}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">House No</span>
              <span className="text-sm font-semibold text-gray-900">{user.houseNo || "—"}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Building2 size={18} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider m-0">Society</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Society ID</span>
              <span className="text-sm font-semibold text-gray-900 font-mono">{user.societyId || "—"}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Member Since</span>
              <span className="text-sm font-semibold text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info — Editable */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-5">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Phone size={18} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider m-0">Contact Info</h3>
          </div>
          {!isEditingContact ? (
            <button
              onClick={() => setIsEditingContact(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 cursor-pointer transition-colors"
            >
              <Edit3 size={13} />
              Edit
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditingContact(false);
                setPhoneNo(user.phoneNo || "");
                setPhoneNo2(user.phoneNo2 || "");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 cursor-pointer transition-colors"
            >
              <X size={13} />
              Cancel
            </button>
          )}
        </div>

        {!isEditingContact ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Primary Phone</span>
              <span className="text-sm font-semibold text-gray-900">{user.phoneNo || "—"}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 font-medium">Alternate Phone</span>
              <span className="text-sm font-semibold text-gray-900">{user.phoneNo2 || "—"}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Primary Phone *
              </label>
              <input
                type="tel"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all box-border"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Alternate Phone
              </label>
              <input
                type="tel"
                value={phoneNo2}
                onChange={(e) => setPhoneNo2(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all box-border"
              />
            </div>
            <button
              onClick={handleContactSave}
              disabled={contactSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl border-none cursor-pointer transition-colors shadow-sm"
            >
              <Save size={15} />
              {contactSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-500">
              <Lock size={18} strokeWidth={2} />
            </div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider m-0">Security</h3>
          </div>
          {!showPasswordSection && (
            <button
              onClick={() => setShowPasswordSection(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 cursor-pointer transition-colors"
            >
              <Lock size={13} />
              Change Password
            </button>
          )}
        </div>

        {!showPasswordSection ? (
          <p className="text-sm text-gray-500 m-0">
            Password was last updated on{" "}
            <span className="font-semibold text-gray-700">
              {user.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </p>
        ) : (
          <div className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
                >
                  {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8-16 chars, uppercase, lowercase, number, special"
                  className="w-full px-4 py-2.5 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all box-border"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all box-border"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handlePasswordChange}
                disabled={passwordSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold rounded-xl border-none cursor-pointer transition-colors shadow-sm"
              >
                <Check size={15} />
                {passwordSaving ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordSection(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
