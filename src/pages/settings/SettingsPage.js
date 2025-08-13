import React, { useEffect, useState } from 'react';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import adminAPI from '../../services/api';

const SettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const data = await adminAPI.getSettings();
        setSettings(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch settings');
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminAPI.updateSettings(settings);
      setError(null);
    } catch (err) {
      setError('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      {loading ? (
        <div>Loading settings...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {Object.keys(settings).map(key => (
            <div key={key}>
              <label className="block mb-1 font-semibold">{key}</label>
              <input
                className="w-full border px-2 py-1"
                name={key}
                value={settings[key]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
        </form>
      )}
      <GeneralSettings />
      <SecuritySettings />
    </div>
  );
};

export default SettingsPage;
