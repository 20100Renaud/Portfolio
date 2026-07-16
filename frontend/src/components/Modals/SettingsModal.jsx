import Modal from "../Modal";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../CustomButton";
import { useState, useEffect } from "react";
import { apiFetch } from "../../api";
import ConfirmModal from "../ConfirmModal";
import { useNavigate } from "react-router-dom";

export default function SettingsModal({ open, onClose }) {
  const { user, login, logout } = useAuth();
  const [editProfile, setEditProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  // Initialize city, username and email
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setCity(user.City_User || "");
    }
  }, [user]);

  // Update City and Username (profile)
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await apiFetch("/auth/update", {
        method: "PUT",
        body: JSON.stringify({
          username,
          ...(email !== user.email && { email }),
          city_user: city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Update failed");
        return;
      }

      await login();

      setEditProfile(false);
      setMessage("Profile updated");
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    } finally {
      setSaving(false);
    }
  };

  // Update Password
  const handleChangePassword = async () => {
    try {
      setPasswordSaving(true);
      setPasswordMessage("");

      const response = await apiFetch("/auth/changePassword", {
        method: "PUT",
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordMessage(data.message || data.error || "Failed");
        return;
      }

      setPasswordMessage("Password updated");

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordForm(false);
    } catch (err) {
      console.error(err);
      setPasswordMessage("Server error");
    } finally {
      setPasswordSaving(false);
    }
  };

  // Delete User account
  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);

      const response = await apiFetch("/auth/delete", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to delete account");
        return;
      }

      await logout();

      onClose();

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <div className="text-green-900 space-y-6">
          <h2 className="text-2xl font-bold text-center">Settings</h2>

          {!user && <p className="text-center">Loading...</p>}

          {user && (
            <>
              {/* ---------------- Profile ---------------- */}
              <section className="space-y-4 border border-green-200 rounded-2xl p-4 bg-green-50">
                <h3 className="font-bold text-lg">Profile</h3>

                <div>
                  <label className="text-sm">Username</label>
                  <input
                    value={username}
                    disabled={!editProfile}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border rounded-xl p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="text-sm hidden">Email</label>
                  <input
                    value={email}
                    disabled={!editProfile}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-xl p-2 bg-white hidden"
                  />
                </div>

                <div>
                  <label className="text-sm">City</label>
                  <input
                    value={city}
                    disabled={!editProfile}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border rounded-xl p-2 bg-white"
                  />
                </div>

                {!editProfile ? (
                  <CustomButton
                    variant="big_white"
                    className="w-full"
                    onClick={() => setEditProfile(true)}
                  >
                    Edit profile
                  </CustomButton>
                ) : (
                  <div className="flex gap-2">
                    <CustomButton
                      variant="big_white"
                      className="flex-1"
                      onClick={() => {
                        setEditProfile(false);
                        setUsername(user.username);
                        setEmail(user.email);
                        setCity(user.City_User);
                      }}
                    >
                      Cancel
                    </CustomButton>

                    <CustomButton
                      variant="big_green"
                      className="flex-1"
                      disabled={saving}
                      onClick={handleUpdateProfile}
                    >
                      {saving ? "Saving..." : "Save"}
                    </CustomButton>
                  </div>
                )}
                {message && <p className="text-sm text-center">{message}</p>}
              </section>

              {/* ---------------- Security ---------------- */}
              <section className="space-y-4 border border-green-200 rounded-2xl p-4 bg-green-50 ">
                <h3 className="font-bold text-lg">Security</h3>

                {!showPasswordForm ? (
                  <CustomButton
                    variant="big_white"
                    className="w-full"
                    onClick={() => {
                      setPasswordMessage("");
                      setShowPasswordForm(true);
                    }}
                  >
                    Change password
                  </CustomButton>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full border rounded-xl p-2"
                    />

                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border rounded-xl p-2"
                    />

                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border rounded-xl p-2"
                    />

                    <div className="flex gap-2">
                      <CustomButton
                        variant="big_white"
                        className="flex-1"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setPasswordMessage("");
                        }}
                      >
                        Cancel
                      </CustomButton>

                      <CustomButton
                        variant="big_green"
                        className="flex-1"
                        disabled={passwordSaving}
                        onClick={handleChangePassword}
                      >
                        {passwordSaving ? "Saving..." : "Save"}
                      </CustomButton>
                    </div>
                  </div>
                )}

                {passwordMessage && (
                  <p className="text-sm text-center">{passwordMessage}</p>
                )}
              </section>

              {/* ---------------- Danger Zone ---------------- */}
              {user.role !== "ADMIN" && (
                <section className=" space-y-4 border border-red-200 rounded-2xl p-4 bg-red-50">
                  <h3 className="font-bold text-lg text-red-700">
                    Danger zone
                  </h3>

                  <p className="text-sm text-red-700">
                    Deleting your account is permanent. Your deposits will be
                    removed and your answers will be reassigned.
                  </p>

                  <CustomButton
                    variant="big_white"
                    className="w-full border-red-400 text-red-700"
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete account
                  </CustomButton>
                </section>
              )}
            </>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        title="Delete account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmLabel={deleteLoading ? "Deleting..." : "Delete"}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
