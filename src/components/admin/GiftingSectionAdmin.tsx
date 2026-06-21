"use client";

import { useState, useEffect } from "react";
import { useSiteStore } from "@/store/siteStore";
import { Save, Gift, Package, MessageSquare, Sparkles, LayoutList, SlidersHorizontal, Eye, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

// ── Reusable toggle switch ────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
        checked ? "bg-brand-brown" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ── Section card wrapper ──────────────────────────────────────────────────────
function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-brown/10 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-brand-brown/8 bg-brand-light/40">
        <Icon className="w-4 h-4 text-brand-gold" />
        <span className="text-sm font-semibold text-brand-brown">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Toggle row ────────────────────────────────────────────────────────────────
function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-brand-brown/6 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-brand-brown leading-tight">{label}</p>
        {description && <p className="text-xs text-brand-text-secondary mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GiftingSectionAdmin() {
  const store = useSiteStore();

  // Content fields
  const [gTitle, setGTitle] = useState(store.giftingTitle);
  const [gDesc, setGDesc] = useState(store.giftingDescription);

  // Feature toggles
  const [enabled, setEnabled] = useState(store.giftingEnabled);
  const [customBox, setCustomBox] = useState(store.giftingCustomBoxEnabled);
  const [personalMsg, setPersonalMsg] = useState(store.giftingPersonalizedMessageEnabled);
  const [greetingCards, setGreetingCards] = useState(store.giftingGreetingCardsEnabled);
  const [wrap, setWrap] = useState(store.giftingWrapEnabled);
  const [premium, setPremium] = useState(store.giftingPremiumPackagingEnabled);

  // Box types
  const [boxTypes, setBoxTypes] = useState<string[]>(store.giftBoxTypes);
  const [newBoxType, setNewBoxType] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingVal, setEditingVal] = useState("");

  // Customer controls
  const [minProducts, setMinProducts] = useState(store.giftingMinProducts);
  const [maxProducts, setMaxProducts] = useState(store.giftingMaxProducts);
  const [maxMsgLen, setMaxMsgLen] = useState(store.giftingMaxMessageLength);
  const [allowMsg, setAllowMsg] = useState(store.giftingAllowCustomMessage);
  const [allowEmoji, setAllowEmoji] = useState(store.giftingAllowEmoji);

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "preview">("settings");

  // Sync from store on mount
  useEffect(() => {
    setGTitle(store.giftingTitle);
    setGDesc(store.giftingDescription);
    setEnabled(store.giftingEnabled);
    setCustomBox(store.giftingCustomBoxEnabled);
    setPersonalMsg(store.giftingPersonalizedMessageEnabled);
    setGreetingCards(store.giftingGreetingCardsEnabled);
    setWrap(store.giftingWrapEnabled);
    setPremium(store.giftingPremiumPackagingEnabled);
    setBoxTypes(store.giftBoxTypes);
    setMinProducts(store.giftingMinProducts);
    setMaxProducts(store.giftingMaxProducts);
    setMaxMsgLen(store.giftingMaxMessageLength);
    setAllowMsg(store.giftingAllowCustomMessage);
    setAllowEmoji(store.giftingAllowEmoji);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!gTitle.trim()) { toast.error("Gifting title is required."); return; }
    if (minProducts < 1) { toast.error("Minimum products must be at least 1."); return; }
    if (maxProducts < minProducts) { toast.error("Maximum products must be ≥ minimum."); return; }
    if (maxMsgLen < 10) { toast.error("Max message length must be at least 10."); return; }

    setSaving(true);
    store.updateGifting(gTitle.trim(), gDesc.trim());
    store.updateGiftingConfig({
      giftingEnabled: enabled,
      giftingCustomBoxEnabled: customBox,
      giftingPersonalizedMessageEnabled: personalMsg,
      giftingGreetingCardsEnabled: greetingCards,
      giftingWrapEnabled: wrap,
      giftingPremiumPackagingEnabled: premium,
      giftBoxTypes: boxTypes,
      giftingMinProducts: minProducts,
      giftingMaxProducts: maxProducts,
      giftingMaxMessageLength: maxMsgLen,
      giftingAllowCustomMessage: allowMsg,
      giftingAllowEmoji: allowEmoji,
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Gifting settings saved.");
    }, 400);
  };

  // Box type management
  const addBoxType = () => {
    const val = newBoxType.trim();
    if (!val || boxTypes.includes(val)) return;
    setBoxTypes([...boxTypes, val]);
    setNewBoxType("");
  };

  const removeBoxType = (idx: number) => setBoxTypes(boxTypes.filter((_, i) => i !== idx));

  const moveBox = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= boxTypes.length) return;
    const arr = [...boxTypes];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    setBoxTypes(arr);
  };

  const commitEdit = (idx: number) => {
    const val = editingVal.trim();
    if (val && !boxTypes.some((b, i) => b === val && i !== idx)) {
      const arr = [...boxTypes];
      arr[idx] = val;
      setBoxTypes(arr);
    }
    setEditingIdx(null);
    setEditingVal("");
  };

  const activeFeatures = [
    customBox && "Custom Gift Boxes",
    personalMsg && "Personalized Messages",
    greetingCards && "Greeting Cards",
    wrap && "Gift Wrapping",
    premium && "Premium Packaging",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-brand-brown/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-brown font-serif">Gifting Section</h2>
          <p className="text-xs text-brand-text-secondary mt-0.5">Control the gifting experience shown to customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-brand-brown/15 overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 transition-colors cursor-pointer ${activeTab === "settings" ? "bg-brand-brown text-white" : "text-brand-text-secondary hover:bg-brand-light"}`}
            >
              <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" />Settings</span>
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 transition-colors cursor-pointer ${activeTab === "preview" ? "bg-brand-brown text-white" : "text-brand-text-secondary hover:bg-brand-light"}`}
            >
              <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Settings tab ── */}
      {activeTab === "settings" && (
        <div className="space-y-4">

          {/* Section content */}
          <Card icon={Gift} title="Section Content">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-1.5">Heading</label>
                <input
                  type="text"
                  value={gTitle}
                  onChange={e => setGTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-brand-brown/15 rounded-xl text-sm font-semibold text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  value={gDesc}
                  onChange={e => setGDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-brand-brown/15 rounded-xl text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Feature toggles */}
          <Card icon={Sparkles} title="Gift Box Customization Settings">
            <ToggleRow
              label="Enable Gifting Section"
              description="Show or hide the entire gifting section on the storefront"
              checked={enabled}
              onChange={setEnabled}
            />
            <ToggleRow
              label="Custom Gift Boxes"
              description="Let customers build their own cookie box"
              checked={customBox}
              onChange={setCustomBox}
            />
            <ToggleRow
              label="Personalized Gift Messages"
              description="Allow customers to add a personal note"
              checked={personalMsg}
              onChange={setPersonalMsg}
            />
            <ToggleRow
              label="Greeting Cards"
              description="Include a physical greeting card option"
              checked={greetingCards}
              onChange={setGreetingCards}
            />
            <ToggleRow
              label="Gift Wrapping"
              description="Offer decorative wrapping on checkout"
              checked={wrap}
              onChange={setWrap}
            />
            <ToggleRow
              label="Premium Packaging"
              description="Upgrade to luxury box and ribbon packaging"
              checked={premium}
              onChange={setPremium}
            />
          </Card>

          {/* Gift box types */}
          <Card icon={Package} title="Gift Box Options">
            <div className="space-y-2 mb-4">
              {boxTypes.map((bt, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-brand-brown/8 bg-brand-light/50 group">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveBox(idx, -1)} disabled={idx === 0} className="text-brand-text-secondary hover:text-brand-brown disabled:opacity-20 leading-none cursor-pointer">
                      <GripVertical className="w-3.5 h-3.5 rotate-90" />
                    </button>
                    <button type="button" onClick={() => moveBox(idx, 1)} disabled={idx === boxTypes.length - 1} className="text-brand-text-secondary hover:text-brand-brown disabled:opacity-20 leading-none cursor-pointer">
                      <GripVertical className="w-3.5 h-3.5 -rotate-90" />
                    </button>
                  </div>

                  {editingIdx === idx ? (
                    <input
                      autoFocus
                      value={editingVal}
                      onChange={e => setEditingVal(e.target.value)}
                      onBlur={() => commitEdit(idx)}
                      onKeyDown={e => { if (e.key === "Enter") commitEdit(idx); if (e.key === "Escape") { setEditingIdx(null); setEditingVal(""); } }}
                      className="flex-1 px-2 py-1 text-sm border border-brand-gold rounded-lg focus:outline-none"
                    />
                  ) : (
                    <span
                      className="flex-1 text-sm text-brand-brown font-medium cursor-pointer hover:text-brand-gold"
                      onDoubleClick={() => { setEditingIdx(idx); setEditingVal(bt); }}
                      title="Double-click to edit"
                    >
                      {bt}
                    </span>
                  )}

                  <span className="text-[10px] text-brand-text-secondary hidden group-hover:inline">dbl-click to edit</span>
                  <button type="button" onClick={() => removeBoxType(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {boxTypes.length === 0 && (
                <p className="text-xs text-brand-text-secondary italic text-center py-3">No box types added yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBoxType}
                onChange={e => setNewBoxType(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addBoxType()}
                placeholder="e.g. Luxury Gift Box"
                className="flex-1 px-3 py-2 border border-brand-brown/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
              />
              <button
                type="button"
                onClick={addBoxType}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-brown text-white rounded-xl text-sm font-medium hover:bg-brand-gold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </Card>

          {/* Customer controls */}
          <Card icon={MessageSquare} title="Customer Customization Controls">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-1.5">Min Products / Box</label>
                <input
                  type="number"
                  min={1}
                  value={minProducts}
                  onChange={e => setMinProducts(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-brand-brown/15 rounded-xl text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-1.5">Max Products / Box</label>
                <input
                  type="number"
                  min={1}
                  value={maxProducts}
                  onChange={e => setMaxProducts(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-brand-brown/15 rounded-xl text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-1.5">Max Message Length</label>
                <input
                  type="number"
                  min={10}
                  value={maxMsgLen}
                  onChange={e => setMaxMsgLen(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-brand-brown/15 rounded-xl text-sm text-brand-brown focus:outline-none focus:ring-2 focus:ring-brand-gold/40 bg-brand-light"
                />
              </div>
            </div>
            <ToggleRow
              label="Allow Custom Message"
              description="Customer can write a personalised message at checkout"
              checked={allowMsg}
              onChange={setAllowMsg}
            />
            <ToggleRow
              label="Allow Emoji in Message"
              description="Customer can include emoji in their gift message"
              checked={allowEmoji}
              onChange={setAllowEmoji}
            />
          </Card>

          {/* Save */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Gifting Settings"}
            </button>
          </div>
        </div>
      )}

      {/* ── Preview tab ── */}
      {activeTab === "preview" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <p className="text-xs text-brand-text-secondary">Live preview — updates as you change settings.</p>

          {/* Storefront preview card */}
          <div className={`rounded-2xl overflow-hidden border shadow-md transition-opacity ${enabled ? "opacity-100" : "opacity-40"}`} style={{ borderColor: "rgba(92,64,51,0.12)" }}>
            <div className="bg-gradient-to-br from-brand-brown to-brand-brown/80 px-8 py-10 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-2">Gifting</p>
              <h3 className="text-2xl font-bold font-serif mb-3">{gTitle || "Gifting Title"}</h3>
              <p className="text-sm text-white/80 leading-relaxed max-w-lg">{gDesc || "Your gifting description will appear here."}</p>
            </div>

            <div className="bg-white px-8 py-6 space-y-5">
              {/* Feature badges */}
              {activeFeatures.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-2.5">Available Options</p>
                  <div className="flex flex-wrap gap-2">
                    {activeFeatures.map(f => (
                      <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-xs font-semibold text-brand-brown">
                        <Sparkles className="w-3 h-3 text-brand-gold" /> {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Box types */}
              {customBox && boxTypes.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-2.5">Gift Box Types</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {boxTypes.map(bt => (
                      <div key={bt} className="rounded-xl border border-brand-brown/10 bg-brand-light px-3 py-2.5 text-center">
                        <Package className="w-4 h-4 text-brand-gold mx-auto mb-1" />
                        <p className="text-xs font-medium text-brand-brown leading-tight">{bt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message preview */}
              {personalMsg && allowMsg && (
                <div>
                  <p className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide mb-2">Gift Message</p>
                  <div className="rounded-xl border border-brand-brown/10 bg-brand-light p-3">
                    <p className="text-xs text-brand-text-secondary italic">
                      Write a personal note… {allowEmoji && "😊🎁"} <span className="not-italic text-brand-brown/50">(max {maxMsgLen} chars)</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Box limits */}
              <div className="flex gap-4 text-xs text-brand-text-secondary border-t border-brand-brown/8 pt-4">
                <span><span className="font-semibold text-brand-brown">{minProducts}</span> min cookies/box</span>
                <span><span className="font-semibold text-brand-brown">{maxProducts}</span> max cookies/box</span>
              </div>
            </div>
          </div>

          {!enabled && (
            <p className="text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl py-2.5">
              ⚠️ Gifting section is currently <strong>disabled</strong> — it will be hidden from customers.
            </p>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-brown text-white rounded-xl text-sm font-semibold hover:bg-brand-gold transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Gifting Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
