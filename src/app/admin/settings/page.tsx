"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string,string>>({});
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState<string|null>(null);
  const [tab, setTab] = useState("brand");
  useEffect(()=>{ fetch("/api/admin/settings",{credentials:"include"}).then(r=>r.json()).then(setSettings); },[]);
  const set = (k:string, v:string) => setSettings(s=>({...s,[k]:v}));
  const upload = async (file:File, key:string, folder:string) => {
    setUploading(key);
    const fd = new FormData(); fd.append("file",file); fd.append("folder",`jaytech/${folder}`);
    const res = await fetch("/api/admin/upload",{method:"POST",body:fd,credentials:"include"});
    const d   = await res.json();
    if(d.url){ set(key,d.url); toast.success("Uploaded! Save settings to apply."); }
    setUploading(null);
  };
  const save = async (keys:string[]) => {
    setSaving(true);
    const patch: Record<string,string> = {};
    keys.forEach(k=>{ patch[k]=settings[k]||""; });
    const res = await fetch("/api/admin/settings",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch),credentials:"include"});
    if(res.ok) toast.success("Settings saved!"); else toast.error("Save failed.");
    setSaving(false);
  };
  const inp = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 transition-all";
  const tabs = [{id:"brand",label:"🏷️ Brand"},{id:"contact",label:"📞 Contact"},{id:"social",label:"🌐 Social"},{id:"hero",label:"🦸 Hero"},{id:"about",label:"ℹ️ About"},{id:"theme",label:"🎨 Theme"},{id:"stats",label:"📊 Stats"},{id:"notifications",label:"🔔 Alerts"}];
  const groups: Record<string,{key:string,label:string,type?:string,opts?:string[]}[]> = {
    brand: [{key:"site_name",label:"Site Name"},{key:"site_tagline",label:"Tagline"},{key:"site_description",label:"Description"},{key:"logo_url",label:"Logo URL (upload below)"},{key:"services_pdf_url",label:"Services PDF URL (upload below)"}],
    contact:[{key:"contact_email",label:"Email",type:"email"},{key:"contact_phone_1",label:"Phone 1"},{key:"contact_phone_2",label:"Phone 2"},{key:"contact_address",label:"Address"},{key:"business_hours",label:"Business Hours"}],
    social:[{key:"social_facebook",label:"Facebook URL"},{key:"social_instagram",label:"Instagram URL"},{key:"social_linkedin",label:"LinkedIn URL"},{key:"social_twitter",label:"X / Twitter URL"},{key:"social_youtube",label:"YouTube URL"}],
    hero:[{key:"hero_title",label:"Hero Title"},{key:"hero_subtitle",label:"Hero Subtitle"},{key:"hero_cta_primary",label:"Primary CTA Text"},{key:"hero_cta_secondary",label:"Secondary CTA Text"},{key:"hero_image",label:"Hero Image URL (upload below)"}],
    theme:[{key:"theme_mode",label:"Default Mode",type:"select",opts:["dark","light"]},{key:"theme_accent_teal",label:"Primary Color",type:"color"},{key:"theme_accent_blue",label:"Accent Color",type:"color"},{key:"theme_bg_dark",label:"Dark Background",type:"color"},{key:"theme_bg_light",label:"Light Background",type:"color"}],
    stats:[{key:"stat_projects",label:"Projects Completed"},{key:"stat_clients",label:"Happy Clients"},{key:"stat_years",label:"Years Experience"},{key:"stat_satisfaction",label:"Client Satisfaction"}],
    about:[
      {key:"about_story",label:"Company Story (Paragraph 1)"},
      {key:"about_story2",label:"Company Story (Paragraph 2)"},
      {key:"about_highlight_1",label:"Highlight 1"},
      {key:"about_highlight_2",label:"Highlight 2"},
      {key:"about_highlight_3",label:"Highlight 3"},
      {key:"about_highlight_4",label:"Highlight 4"},
      {key:"about_value_1_icon",label:"Value 1 Icon (emoji)"},
      {key:"about_value_1_title",label:"Value 1 Title"},
      {key:"about_value_1_desc",label:"Value 1 Description"},
      {key:"about_value_2_icon",label:"Value 2 Icon (emoji)"},
      {key:"about_value_2_title",label:"Value 2 Title"},
      {key:"about_value_2_desc",label:"Value 2 Description"},
      {key:"about_value_3_icon",label:"Value 3 Icon (emoji)"},
      {key:"about_value_3_title",label:"Value 3 Title"},
      {key:"about_value_3_desc",label:"Value 3 Description"},
    ],
    notifications:[{key:"notify_email",label:"Notification Email",type:"email"},{key:"notify_new_message",label:"Alert on New Message",type:"select",opts:["true","false"]},{key:"notify_new_subscriber",label:"Alert on New Subscriber",type:"select",opts:["true","false"]}],
  };
  const currentGroup = groups[tab] || [];
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-heading font-black text-2xl mb-1">Site Settings</h1>
      <p className="text-slate-500 text-sm mb-6">All changes here update the live site immediately after saving.</p>
      <div className="flex gap-1 flex-wrap mb-8 border-b border-slate-800 pb-4">
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab===t.id?"text-white":"text-slate-400 hover:text-white hover:bg-slate-800"}`} style={tab===t.id?{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}:{}}>{t.label}</button>)}
      </div>
      <div className="space-y-4 mb-6">
        {currentGroup.map(f=>(
          <div key={f.key}>
            <label className="text-slate-500 text-xs uppercase tracking-widest block mb-2">{f.label}</label>
            {f.type==="color"
              ? <div className="flex items-center gap-3"><input type="color" className="w-12 h-10 rounded-lg border border-slate-700 bg-slate-900 cursor-pointer" value={settings[f.key]||"#14B8A6"} onChange={e=>set(f.key,e.target.value)}/><input className={inp} style={{flex:1}} value={settings[f.key]||""} onChange={e=>set(f.key,e.target.value)}/></div>
              : f.type==="select" && f.opts
              ? <select className={inp} value={settings[f.key]||""} onChange={e=>set(f.key,e.target.value)}>{f.opts.map(o=><option key={o}>{o}</option>)}</select>
              : f.key.includes("subtitle")||f.key.includes("description")
              ? <textarea className={inp} rows={3} value={settings[f.key]||""} onChange={e=>set(f.key,e.target.value)}/>
              : <input type={f.type||"text"} className={inp} value={settings[f.key]||""} onChange={e=>set(f.key,e.target.value)}/>
            }
          </div>
        ))}
      </div>
      {/* Upload helpers */}
      {tab==="brand"&&(
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 space-y-4">
          <h3 className="font-heading font-bold text-sm">Upload Files</h3>
          <div>
            <p className="text-slate-500 text-xs mb-2">Logo Image</p>
            <input type="file" accept="image/*" className="hidden" id="logo-up" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],"logo_url","logos")}/>
            <label htmlFor="logo-up" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 cursor-pointer transition-all ${uploading==="logo_url"?"opacity-50":""}`}>{uploading==="logo_url"?"Uploading…":"📤 Upload Logo"}</label>
            {settings.logo_url&&<img src={settings.logo_url} alt="Logo" className="h-10 mt-3 object-contain"/>}
          </div>
          {/* Extract Colors from Logo */}
          {settings.logo_url && (
            <div className="pt-2 border-t border-slate-800">
              <p className="text-slate-500 text-xs mb-2">Generate light theme colors from your logo</p>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const res = await fetch('/api/admin/extract-colors', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ logoUrl: settings.logo_url }),
                      credentials: 'include',
                    });
                    const d = await res.json();
                    if (res.ok) {
                      toast.success('Light theme palette generated from logo! Reload to see changes.');
                      // Refresh settings
                      const s = await fetch('/api/admin/settings', { credentials: 'include' }).then(r => r.json());
                      setSettings(s);
                    } else {
                      toast.error(d.error || 'Extraction failed');
                    }
                  } catch { toast.error('Failed to extract colors'); }
                  finally { setSaving(false); }
                }}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all text-white"
                style={{ background: 'linear-gradient(135deg,#14B8A6,#3B82F6)' }}
              >
                {saving ? '⏳ Extracting…' : '🎨 Extract Colors from Logo'}
              </button>
              {settings.light_primary_color && (
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-5 h-5 rounded-full border border-slate-700" style={{ background: settings.light_primary_color }}></div>
                  <span className="text-xs text-slate-500">Current extracted color: <span className="text-teal-400 font-mono">{settings.light_primary_color}</span></span>
                </div>
              )}
            </div>
          )}
          <div>
            <p className="text-slate-500 text-xs mb-2">Services PDF</p>
            <input type="file" accept="application/pdf" className="hidden" id="pdf-up" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],"services_pdf_url","pdfs")}/>
            <label htmlFor="pdf-up" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 cursor-pointer transition-all ${uploading==="services_pdf_url"?"opacity-50":""}`}>{uploading==="services_pdf_url"?"Uploading…":"📄 Upload PDF"}</label>
            {settings.services_pdf_url&&<a href={settings.services_pdf_url} target="_blank" rel="noopener" className="block mt-2 text-teal-400 text-xs hover:underline">📄 View current PDF</a>}
          </div>
        </div>
      )}
      {tab==="hero"&&(
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <p className="text-slate-500 text-xs mb-3">Hero Image Upload</p>
          <input type="file" accept="image/*" className="hidden" id="hero-up" onChange={e=>e.target.files?.[0]&&upload(e.target.files[0],"hero_image","hero")}/>
          <label htmlFor="hero-up" className={`inline-flex items-center gap-2 px-4 py-2 border border-dashed border-slate-700 rounded-xl text-sm text-slate-400 hover:border-teal-400/50 hover:text-teal-400 cursor-pointer transition-all ${uploading==="hero_image"?"opacity-50":""}`}>{uploading==="hero_image"?"Uploading…":"📷 Upload Hero Image"}</label>
          {settings.hero_image&&<img src={settings.hero_image} alt="Hero" className="w-full h-32 object-cover rounded-xl mt-3"/>}
        </div>
      )}
      <button onClick={()=>save(currentGroup.map(f=>f.key))} disabled={saving} className="text-white font-heading font-bold px-8 py-3.5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all" style={{background:"linear-gradient(135deg,#14B8A6,#3B82F6)"}}>
        {saving?"Saving…":"Save Settings"}
      </button>
    </div>
  );
}