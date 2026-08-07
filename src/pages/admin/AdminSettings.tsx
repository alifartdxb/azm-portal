import React, { useState, useEffect } from 'react';
import { getCollection, updateDocument, createDocument } from '../../services/db';
import { Save, Building2, Clock, MapPin, Phone, Mail, MessageCircle, Calendar } from 'lucide-react';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const [settings, setSettings] = useState({
    address: 'Shop 12, Building Materials Mall, Warsan-3, Dubai',
    googleMapsUrl: 'https://www.google.com/maps?q=25.161985,55.461234',
    workingHours: 'Mon - Sun | 9:00 AM - 9:00 PM',
    telephone: '+971 4 28 444 52',
    whatsapp: '+971 55 8090 292',
    email: 'sales@alzahrabm.com',
    availableDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
    availableTimeSlots: '10:00 AM,11:00 AM,12:00 PM,01:00 PM,02:00 PM,03:00 PM,04:00 PM,05:00 PM,06:00 PM,07:00 PM',
    bookingDuration: '60',
    maxBookingsPerSlot: '2'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const sysSettings = await getCollection('settings');
      const showroomSettings = sysSettings.find((s: any) => s.id === 'showroom' || s.type === 'showroom') as any;
      if (showroomSettings) {
        setSettingsId(showroomSettings.id);
        setSettings({
          address: showroomSettings.address || settings.address,
          googleMapsUrl: showroomSettings.googleMapsUrl || settings.googleMapsUrl,
          workingHours: showroomSettings.workingHours || settings.workingHours,
          telephone: showroomSettings.telephone || settings.telephone,
          whatsapp: showroomSettings.whatsapp || settings.whatsapp,
          email: showroomSettings.email || settings.email,
          availableDays: Array.isArray(showroomSettings.availableDays) ? showroomSettings.availableDays.join(',') : (showroomSettings.availableDays || settings.availableDays),
          availableTimeSlots: Array.isArray(showroomSettings.availableTimeSlots) ? showroomSettings.availableTimeSlots.join(',') : (showroomSettings.availableTimeSlots || settings.availableTimeSlots),
          bookingDuration: showroomSettings.bookingDuration?.toString() || settings.bookingDuration,
          maxBookingsPerSlot: showroomSettings.maxBookingsPerSlot?.toString() || settings.maxBookingsPerSlot
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        type: 'showroom',
        ...settings,
        availableDays: settings.availableDays.split(',').map(s => s.trim()).filter(Boolean),
        availableTimeSlots: settings.availableTimeSlots.split(',').map(s => s.trim()).filter(Boolean),
        bookingDuration: parseInt(settings.bookingDuration) || 60,
        maxBookingsPerSlot: parseInt(settings.maxBookingsPerSlot) || 2,
        updatedAt: new Date().toISOString()
      };

      if (settingsId) {
        await updateDocument('settings', settingsId, payload);
      } else {
        await createDocument('settings', payload, 'showroom');
        setSettingsId('showroom');
      }
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Showroom & Contact Settings</h1>
          <p className="text-stone-500 text-sm mt-1">Configure booking details, opening hours, and contact information.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
            <Building2 size={18} className="text-brand-primary" />
            <h2 className="font-bold text-stone-800">Company Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><MapPin size={14} /> Showroom Address</label>
              <textarea name="address" value={settings.address} onChange={handleChange} rows={2} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Google Maps URL</label>
              <input type="text" name="googleMapsUrl" value={settings.googleMapsUrl} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><Clock size={14} /> Working Hours</label>
              <input type="text" name="workingHours" value={settings.workingHours} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><Phone size={14} /> Telephone</label>
                <input type="text" name="telephone" value={settings.telephone} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><MessageCircle size={14} /> WhatsApp</label>
                <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-2"><Mail size={14} /> General Email</label>
              <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
            </div>
          </div>
        </div>

        {/* Booking Configuration */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
            <Calendar size={18} className="text-brand-primary" />
            <h2 className="font-bold text-stone-800">Booking Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Available Days (comma separated)</label>
              <input type="text" name="availableDays" value={settings.availableDays} onChange={handleChange} placeholder="e.g. Monday, Tuesday, Wednesday" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Available Time Slots (comma separated)</label>
              <textarea name="availableTimeSlots" value={settings.availableTimeSlots} onChange={handleChange} rows={3} placeholder="e.g. 10:00 AM, 11:00 AM, 12:00 PM" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Booking Duration (Mins)</label>
                <input type="number" name="bookingDuration" value={settings.bookingDuration} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Max Bookings Per Slot</label>
                <input type="number" name="maxBookingsPerSlot" value={settings.maxBookingsPerSlot} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-brand-primary focus:outline-none focus:bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
