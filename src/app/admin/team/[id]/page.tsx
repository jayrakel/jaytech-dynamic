"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ─── Canvas Crop Modal ──────────────────────────────────────────────────────
function CropModal({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const imgRef      = useRef<HTMLImageElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [aspect, setAspect] = useState<"square" | "portrait" | "free">("square");

  // crop coords as % of the displayed image
  const [crop, setCrop] = useState({ x: 15, y: 10, w: 70, h: 70 });
  const dragRef = useRef<{ type: "move" | "resize"; mx: number; my: number; cx: number; cy: number; cw: number; ch: number } | null>(null);

  // Keep crop square when aspect = square
  const enforcedCrop = useCallback((raw: typeof crop) => {
    if (aspect === "square")   return { ...raw, h: raw.w };
    if (aspect === "portrait") return { ...raw, h: raw.w * 1.35 };
    return raw;
  }, [aspect]);

  // Draw overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    const img    = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const W = img.offsetWidth;
    const H = img.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d")!;
    const c = enforcedCrop(crop);
    const px = (c.x / 100) * W;
    const py = (c.y / 100) * H;
    const pw = (c.w / 100) * W;
    const ph = (c.h / 100) * H;

    ctx.clearRect(0, 0, W, H);

    // Dark vignette outside crop
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, W, H);

    // Show image through a circular clip (for square crops) or rectangular
    ctx.save();
    if (aspect === "square") {
      const r = pw / 2;
      ctx.beginPath();
      ctx.arc(px + r, py + r, r, 0, Math.PI * 2);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
    }
    ctx.clearRect(0, 0, W, H);
    ctx.restore();

    // Border
    if (aspect === "square") {
      const r = pw / 2;
      ctx.strokeStyle = "#14B8A6";
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(px + r, py + r, r, 0, Math.PI * 2);
      ctx.stroke();
      // Dashed inner circle
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(20,184,166,0.4)";
      ctx.beginPath();
      ctx.arc(px + r, py + r, r * 0.66, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = "#14B8A6";
      ctx.lineWidth   = 2;
      ctx.strokeRect(px, py, pw, ph);
      // Rule of thirds
      ctx.strokeStyle = "rgba(20,184,166,0.3)";
      ctx.lineWidth   = 0.5;
      for (let i = 1; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(px + (pw/3)*i, py); ctx.lineTo(px + (pw/3)*i, py+ph); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, py + (ph/3)*i); ctx.lineTo(px+pw, py + (ph/3)*i); ctx.stroke();
      }
    }

    // Corner handles
    const hs = 8;
    ctx.fillStyle = "#14B8A6";
    [[px, py],[px+pw-hs, py],[px, py+ph-hs],[px+pw-hs, py+ph-hs]].forEach(([hx,hy]) => ctx.fillRect(hx, hy, hs, hs));

  }, [crop, imgLoaded, aspect, enforcedCrop]);

  // Re-enforce aspect when it changes
  useEffect(() => {
    setCrop(c => enforcedCrop(c));
  }, [aspect, enforcedCrop]);

  const pct = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current!.getBoundingClientRect();
    return {
      px: Math.max(0, Math.min(100, ((e.clientX - r.left)  / r.width)  * 100)),
      py: Math.max(0, Math.min(100, ((e.clientY - r.top)   / r.height) * 100)),
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const { px, py } = pct(e);
    const c = enforcedCrop(crop);
    const inResize = px > c.x + c.w - 10 && py > c.y + c.h - 10;
    const inMove   = px > c.x && px < c.x + c.w && py > c.y && py < c.y + c.h;
    if (inResize) {
      dragRef.current = { type: "resize", mx: px, my: py, cx: c.x, cy: c.y, cw: c.w, ch: c.h };
    } else if (inMove) {
      dragRef.current = { type: "move",   mx: px, my: py, cx: c.x, cy: c.y, cw: c.w, ch: c.h };
    } else {
      // Draw new crop from scratch
      setCrop({ x: px, y: py, w: 0, h: 0 });
      dragRef.current = { type: "resize", mx: px, my: py, cx: px, cy: py, cw: 0, ch: 0 };
    }
  }, [crop, pct, enforcedCrop]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const { px, py } = pct(e);
    const d = dragRef.current;
    const dx = px - d.mx;
    const dy = py - d.my;
    if (d.type === "move") {
      setCrop(c => enforcedCrop({
        ...c,
        x: Math.max(0, Math.min(100 - c.w, d.cx + dx)),
        y: Math.max(0, Math.min(100 - c.h, d.cy + dy)),
      }));
    } else {
      let nw = Math.max(10, d.cw + dx);
      let nh = aspect === "square" ? nw : aspect === "portrait" ? nw * 1.35 : Math.max(10, d.ch + dy);
      nw = Math.min(nw, 100 - d.cx);
      nh = Math.min(nh, 100 - d.cy);
      setCrop(enforcedCrop({ x: d.cx, y: d.cy, w: nw, h: nh }));
    }
  }, [pct, aspect, enforcedCrop]);

  const onMouseUp = () => { dragRef.current = null; };

  const confirm = () => {
    const img = imgRef.current!;
    const c   = enforcedCrop(crop);
    const W   = img.offsetWidth;
    const H   = img.offsetHeight;
    const sx  = img.naturalWidth  / W;
    const sy  = img.naturalHeight / H;
    const px  = (c.x / 100) * W * sx;
    const py  = (c.y / 100) * H * sy;
    const pw  = (c.w / 100) * W * sx;
    const ph  = (c.h / 100) * H * sy;

    // Output at a consistent 400×400 (square) or 400×540 (portrait)
    const outW = 400;
    const outH = aspect === "portrait" ? 540 : 400;
    const out  = document.createElement("canvas");
    out.width  = outW;
    out.height = outH;
    const ctx  = out.getContext("2d")!;

    if (aspect === "square") {
      // Circular clip for output too
      ctx.beginPath();
      ctx.arc(outW / 2, outH / 2, outW / 2, 0, Math.PI * 2);
      ctx.clip();
    }
    ctx.drawImage(img, px, py, pw, ph, 0, 0, outW, outH);
    out.toBlob(blob => { if (blob) onConfirm(blob); }, "image/png", 0.95);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-white">Crop Photo</h3>
            <p className="text-slate-500 text-xs mt-0.5">Drag to position · Corner to resize</p>
          </div>
          <div className="flex items-center gap-1.5">
            {(["square","portrait","free"] as const).map(a => (
              <button
                key={a}
                onClick={() => setAspect(a)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${aspect === a ? "text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}
                style={aspect === a ? { background: "linear-gradient(135deg,#14B8A6,#3B82F6)" } : {}}
              >
                {a === "square" ? "⭕ Square" : a === "portrait" ? "🪪 Portrait" : "✂️ Free"}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas area */}
        <div
          ref={containerRef}
          className="relative select-none bg-black mx-4 my-4 rounded-xl overflow-hidden"
          style={{ cursor: "crosshair" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* crossOrigin="anonymous" fixes the tainted canvas SecurityError */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt="Crop preview"
            crossOrigin="anonymous"
            className="w-full max-h-[400px] object-contain block pointer-events-none"
            onLoad={() => setImgLoaded(true)}
            draggable={false}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Preview + actions */}
        <div className="px-6 pb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-slate-600 text-xs">Preview:</p>
            {/* Tiny live preview */}
            <div className={`w-12 h-12 bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 ${aspect === "square" ? "rounded-full" : "rounded-lg"}`}>
              {imgLoaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  crossOrigin="anonymous"
                  className="pointer-events-none"
                  style={{
                    width:      `${10000 / crop.w}%`,
                    height:     `${10000 / (aspect === "portrait" ? crop.w * 1.35 : crop.w)}%`,
                    marginLeft: `-${(crop.x / crop.w) * 100}%`,
                    marginTop:  `-${(crop.y / (aspect === "portrait" ? crop.w * 1.35 : crop.w)) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:text-white transition-all">
              Cancel
            </button>
            <button
              onClick={confirm}
              className="px-6 py-2.5 rounded-xl text-white font-heading font-bold text-sm hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(135deg,#14B8A6,#3B82F6)" }}
            >
              Apply & Upload →
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
  const [cropSrc,   setCropSrc]   = useState<string | null>(null);
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

  const onFileSelected = (file: File) => {
    setPendingFile(file);
    const reader = new FileReader();
    reader.onload = e => setCropSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onCropConfirmed = async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    const file = new File([blob], pendingFile?.name || "photo.png", { type: "image/png" });
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
    if (res.ok) { toast.success("Saved!"); if (isNew) router.push("/admin/team"); }
    else toast.error("Save failed.");
    setSaving(false);
  };

  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";

  return (
    <>
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

        <div className="space-y-5">

          {/* Photo */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-4">Profile Photo</label>
            <div className="flex items-center gap-5">
              {/* Circular preview — matches how the site displays it */}
              <div className="w-24 h-24 rounded-full border-2 border-slate-700 overflow-hidden flex-shrink-0 bg-slate-800 flex items-center justify-center">
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover object-center" />
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
                    onClick={() => { setCropSrc(form.image); setPendingFile(new File([], "existing.jpg")); }}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    ✂️ Re-crop current photo
                  </button>
                )}
                <p className="text-slate-600 text-xs">Use ⭕ Square mode for circular profile photos.</p>
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
            <textarea className={inp} rows={3} value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Short bio..." />
          </div>

          {/* Social */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">Email</label>
              <input type="email" className={inp} value={form.email} onChange={e => set("email", e.target.value)} />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">LinkedIn URL</label>
              <input className={inp} value={form.linkedin} onChange={e => set("linkedin", e.target.value)} />
            </div>
            <div>
              <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">X / Twitter</label>
              <input className={inp} value={form.twitter} onChange={e => set("twitter", e.target.value)} />
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
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form.active ? "bg-teal-500" : "bg-slate-700"}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.active ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-300">{form.active ? "Visible on site" : "Hidden"}</span>
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