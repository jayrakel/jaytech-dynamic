"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d) setProfile({ name: d.name || "", email: d.email || "" }); });
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, email: profile.email }),
      credentials: "include",
    });
    const d = await res.json();
    if (res.ok) toast.success("Profile updated!");
    else toast.error(d.error || "Failed to update.");
    setSaving(false);
  };

  const changePassword = async () => {
    if (!passwords.current) return toast.error("Enter your current password.");
    if (passwords.next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (passwords.next !== passwords.confirm) return toast.error("New passwords do not match.");
    setChanging(true);
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
      credentials: "include",
    });
    const d = await res.json();
    if (res.ok) {
      toast.success("Password changed successfully!");
      setPasswords({ current: "", next: "", confirm: "" });
    } else {
      toast.error(d.error || "Failed to change password.");
    }
    setChanging(false);
  };

  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="font-heading font-black text-2xl mb-1">My Profile</h1>
      <p className="text-slate-500 text-sm mb-8">Update your name, email, and password.</p>

      {/* Profile Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="font-heading font-bold text-lg mb-5">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Full Name</label>
            <input
              className={inp}
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Email Address</label>
            <input
              type="email"
              className={inp}
              value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="text-white font-heading font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
          >
            {saving ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-heading font-bold text-lg mb-5">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Current Password</label>
            <input
              type="password"
              className={inp}
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">New Password</label>
            <input
              type="password"
              className={inp}
              value={passwords.next}
              onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
              placeholder="Min. 8 characters"
            />
          </div>
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Confirm New Password</label>
            <input
              type="password"
              className={inp}
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={changePassword}
            disabled={changing}
            className="text-white font-heading font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm"
            style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
          >
            {changing ? "Changing…" : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
}