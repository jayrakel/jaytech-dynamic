"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── Canvas-based Image Crop Modal ─────────────────────────────────────────
interface CropState { x: number; y: number; w: number; h: number }

function CropModal({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const imgRef   = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop]     = useState<CropState>({ x: 10, y: 10, w: 80, h: 80 });
  const [dragging, setDragging] = useState<null | "move" | "resize">(null);
  const [start, setStart]   = useState({ mx: 0, my: 0, cx: 0, cy: 0, cw: 0, ch: 0 });
  const [aspect, setAspect] = useState<"free" | "square" | "portrait">("square");
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Draw crop overlay on canvas whenever crop changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width  = img.offsetWidth;
    canvas.height = img.offsetHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Clear the crop area (show image)
    const px = (crop.x / 100) * canvas.width;
    const py = (crop.y / 100) * canvas.height;
    const pw = (crop.w / 100) * canvas.width;
    const ph = (crop.h / 100) * canvas.height;
    ctx.clearRect(px, py, pw, ph);
    // Crop border
    ctx.strokeStyle = "#14B8A6";
    ctx.lineWidth   = 2;
    ctx.strokeRect(px, py, pw, ph);
    // Rule-of-thirds grid
    ctx.strokeStyle = "rgba(20,184,166,0.35)";
    ctx.lineWidth   = 0.5;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(px + (pw / 3) * i, py); ctx.lineTo(px + (pw / 3) * i, py + ph); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py + (ph / 3) * i); ctx.lineTo(px + pw, py + (ph / 3) * i); ctx.stroke();
    }
    // Corner handles
    const hs = 10;
    ctx.fillStyle = "#14B8A6";
    [[px, py],[px+pw-hs, py],[px, py+ph-hs],[px+pw-hs, py+ph-hs]].forEach(([hx, hy]) => {
      ctx.fillRect(hx, hy, hs, hs);
    });
  }, [crop, imgLoaded]);

  const pctFromEvent = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current!;
    const rect = container.getBoundingClientRect();
    return {
      px: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      py: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const { px, py } = pctFromEvent(e);
    const { x, y, w, h } = crop;
    const inResize = px > x + w - 8 && py > y + h - 8;
    const inCrop   = px > x && px < x + w && py > y && py < y + h;
    if (inResize) {
      setDragging("resize");
      setStart({ mx: px, my: py, cx: x, cy: y, cw: w, ch: h });
    } else if (inCrop) {
      setDragging("move");
      setStart({ mx: px, my: py, cx: x, cy: y, cw: w, ch: h });
    } else {
      // Start a fresh crop
      setDragging("resize");
      setCrop({ x: px, y: py, w: 0, h: 0 });
      setStart({ mx: px, my: py, cx: px, cy: py, cw: 0, ch: 0 });
    }
  }, [crop, pctFromEvent]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const { px, py } = pctFromEvent(e);
    const dx = px - start.mx;
    const dy = py - start.my;
    if (dragging === "move") {
      setCrop(c => ({
        ...c,
        x: Math.max(0, Math.min(100 - c.w, start.cx + dx)),
        y: Math.max(0, Math.min(100 - c.h, start.cy + dy)),
      }));
    } else {
      let nw = Math.max(5, start.cw + dx);
      let nh = Math.max(5, start.ch + dy);
      if (aspect === "square")   nh = nw;
      if (aspect === "portrait") nh = nw * 1.33;
      nw = Math.min(nw, 100 - start.cx);
      nh = Math.min(nh, 100 - start.cy);
      setCrop(c => ({ x: start.cx, y: start.cy, w: nw, h: nh }));
    }
  }, [dragging, start, aspect, pctFromEvent]);

  const onMouseUp = () => setDragging(null);

  // Apply crop and produce blob
  const confirm = () => {
    const img = imgRef.current!;
    const out = document.createElement("canvas");
    const scaleX = img.naturalWidth  / img.offsetWidth;
    const scaleY = img.naturalHeight / img.offsetHeight;
    const px = (crop.x / 100) * img.offsetWidth;
    const py = (crop.y / 100) * img.offsetHeight;
    const pw = (crop.w / 100) * img.offsetWidth;
    const ph = (crop.h / 100) * img.offsetHeight;
    out.width  = pw * scaleX;
    out.height = ph * scaleY;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(img, px * scaleX, py * scaleY, pw * scaleX, ph * scaleY, 0, 0, out.width, out.height);
    out.toBlob(blob => { if (blob) onConfirm(blob); }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-white">Crop Photo</h3>
            <p className="text-slate-500 text-xs mt-0.5">Drag to move · Drag corner to resize</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs uppercase tracking-widest">Aspect:</span>
            {(["free", "square", "portrait"] as const).map(a => (
              <button
                key={a}
                onClick={() => setAspect(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${aspect === a ? "text-white" : "text-slate-400 bg-slate-800 hover:text-white"}`}
                style={aspect === a ? { background: "linear-gradient(135deg,#14B8A6,#3B82F6)" } : {}}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas crop area */}
        <div
          ref={containerRef}
          className="relative select-none bg-slate-950 mx-4 my-4 rounded-xl overflow-hidden"
          style={{ cursor: dragging === "move" ? "move" : "crosshair" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
  ref={imgRef}
  src={src}
  alt="Crop"
  crossOrigin="anonymous"
  className="w-full max-h-[420px] object-contain block pointer-events-none"
  onLoad={() => setImgLoaded(true)}
  draggable={false}
/>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        <div className="px-6 pb-5 flex items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            Crop: {crop.w.toFixed(0)}% × {crop.h.toFixed(0)}%
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white hover:border-slate-500 transition-all">
              Cancel
            </button>
            <button
              onClick={confirm}
              className="px-6 py-2.5 rounded-xl text-white font-heading font-bold text-sm hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
            >
              Apply Crop & Upload →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Team Member Editor ─────────────────────────────────────────────────────
export default function TeamMemberEditor() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const isNew   = id === "new";

  const [form, setForm] = useState({
    name: "", role: "", bio: "", image: "",
    linkedin: "", twitter: "", email: "", order: 0, active: true,
  });
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);

  // Crop state
  const [cropSrc,    setCropSrc]    = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/team/${id}`, { credentials: "include" })
        .then(r => r.json())
        .then(d => {
          if (d) setForm({
            name:     d.name     || "",
            role:     d.role     || "",
            bio:      d.bio      || "",
            image:    d.image    || "",
            linkedin: d.linkedin || "",
            twitter:  d.twitter  || "",
            email:    d.email    || "",
            order:    d.order    || 0,
            active:   d.active   !== false,
          });
        });
    }
  }, [id, isNew]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // When file is selected — show crop modal instead of uploading immediately
  const onFileSelected = (file: File) => {
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = e => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // After crop confirmed — upload the cropped blob
  const onCropConfirmed = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    const file = new File([blob], pendingFile?.name || "photo.jpg", { type: "image/jpeg" });
    const fd   = new FormData();
    fd.append("file",   file);
    fd.append("folder", "jaytech/team");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
    const d   = await res.json();
    if (d.url) { set("image", d.url); toast.success("Photo uploaded!"); }
    else toast.error("Upload failed.");
    setUploading(false);
    setPendingFile(null);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name required");
    setSaving(true);
    const url  = isNew ? "/api/admin/team" : `/api/admin/team/${id}`;
    const meth = isNew ? "POST" : "PATCH";
    const res  = await fetch(url, {
      method: meth,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Saved!");
      if (isNew) router.push("/admin/team");
    } else {
      toast.error("Save failed.");
    }
    setSaving(false);
  };

  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";

  return (
    <>
      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={onCropConfirmed}
          onCancel={() => { setCropSrc(null); setPendingFile(null); }}
        />
      )}

      <div className="p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="text-slate-500 hover:text-white text-sm transition-colors">← Back</button>
          <h1 className="font-heading font-black text-2xl">{isNew ? "Add Team Member" : "Edit Member"}</h1>
        </div>

        <div className="space-y-4">
          {/* Photo */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-4">Profile Photo</label>
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-700 flex-shrink-0 bg-slate-800 flex items-center justify-center">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">👤</span>
                )}
              </div>
              <div className="space-y-2 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && onFileSelected(e.target.files[0])}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-slate-600 rounded-xl text-sm text-slate-400 hover:border-teal-400/60 hover:text-teal-400 transition-all disabled:opacity-50"
                >
                  {uploading ? "⏳ Uploading…" : "📷 Choose & Crop Photo"}
                </button>
                {form.image && (
                  <button
                    onClick={() => {
                      // Re-crop existing image
                      setCropSrc(form.image);
                      setPendingFile(new File([], "existing.jpg", { type: "image/jpeg" }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    ✂️ Re-crop current photo
                  </button>
                )}
                <p className="text-slate-600 text-xs">After selecting, you can crop before uploading.</p>
              </div>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Full Name *</label>
              <input className={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Role / Title *</label>
              <input className={inp} value={form.role} onChange={e => set("role", e.target.value)} placeholder="Lead Developer" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Bio</label>
            <textarea className={inp} rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Short bio about this team member..." />
          </div>

          {/* Contact / Social */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Email</label>
              <input type="email" className={inp} value={form.email} onChange={e => set("email", e.target.value)} placeholder="jane@jaytech.co.ke" />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">LinkedIn URL</label>
              <input className={inp} value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">X / Twitter URL</label>
              <input className={inp} value={form.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://x.com/..." />
            </div>
          </div>

          {/* Order & Active */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Display Order</label>
              <input type="number" className={inp} value={form.order} onChange={e => set("order", +e.target.value)} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("active", !form.active)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? "bg-teal-500" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-300">{form.active ? "Visible on site" : "Hidden from site"}</span>
              </label>
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full text-white font-heading font-bold py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
          >
            {saving ? "Saving…" : "Save Member"}
          </button>
        </div>
      </div>
    </>
  );
}