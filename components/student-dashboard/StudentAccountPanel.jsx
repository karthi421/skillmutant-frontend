import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../lib/api";
export default function StudentAccountPanel({ open, onClose }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [bio, setBio] = useState("");
  const [profileFile, setProfileFile] = useState(null);
 

  /* ================= FETCH ACCOUNT ================= */
useEffect(() => {
  if (!open) return;

  const token = localStorage.getItem("token");

  if (!token) {
    setError("Not authenticated");
    setLoading(false);
    return;
  }

  setLoading(true);
  setError("");

  apiFetch("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(data => {
      setUser(data);
      setName(data.name || "");
      setCollege(data.college || "");
      setBio(data.bio || "");
      setLoading(false);
    })
    .catch(() => {
      setError("Unable to load account data");
      setLoading(false);
    });

}, [open]);

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    if (!token) return alert("Not authenticated");

    setSaving(true);

    const fd = new FormData();
    fd.append("name", name);
    fd.append("college", college);
    fd.append("bio", bio);
    if (profileFile) fd.append("profile_pic", profileFile);

    try {
      const res = await apiFetch(
          "/api/auth/update-profile",

        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser(data);
      alert("Profile updated successfully");
    } catch {
      alert("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!confirm("Delete account permanently?")) return;

    await apiFetch("api/auth/delete-account", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
         
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            className="fixed right-0 top-0 h-screen w-[420px] bg-black z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">Account</h2>
              <button onClick={onClose}>✕</button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {user && (
              <div className="space-y-4">
          
                {/* PROFILE PIC */}
                
                 <div className="text-center">
                 <img
  src={
    user.profile_pic
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user.profile_pic}?t=${Date.now()}`
      : "/default-profile.png"
  }
  className="w-32 h-32 rounded-full object-cover border border-cyan-400/40"
/>

                 <label className="relative cursor-pointer">
  <span className="
    px-3 py-1 text-xs rounded-full
    bg-cyan-500 text-black font-medium
    hover:scale-105 transition
  ">
    Change Photo
  </span>

  <input
    type="file"
    accept="image/*"
    hidden
     onChange={e => setProfileFile(e.target.files[0])}
  />
</label>

                </div>

                {/* READ ONLY     */}
                <Read label="Username" value={user.username} />
                <Read label="Email" value={user.email} />
                <Read label="Password" value="********" />

                {/* EDITABLE */}
                <div className="space-y-4 pt-2">
                
                <input  value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="input-modern" />
                
                <input value={college} onChange={e => setCollege(e.target.value)} placeholder="College" className="input-modern" />
                <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" className="textarea-modern" />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="
                  w-full py-3 rounded-xl font-semibold
                  bg-gradient-to-r from-cyan-400 to-emerald-400
                  text-black shadow-xl
                  hover:scale-[1.02] transition
                "
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleDelete}
                  className="
                  w-full py-2.5 rounded-xl
                  border border-red-500/40
                  text-red-400 hover:bg-red-500/10 transition
                "
              
                >
                  Delete Account
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Read({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <div className="bg-black/40 p-2 rounded">{value}</div>
    </div>
  );
}
