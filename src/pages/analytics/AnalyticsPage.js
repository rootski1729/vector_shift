import React, { useEffect, useState } from 'react';
import adminAPI from '../../services/api';

const AnalyticsPage = () => {
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const stats = await adminAPI.getPlatformAnalytics();
        setPlatformStats(stats);
        setError(null);
      } catch (err) {
        setError('Failed to fetch analytics');
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Analytics</h2>
      {loading ? (
        <div>Loading analytics...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : platformStats ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Platform Stats</h3>
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(platformStats, null, 2)}</pre>
        </div>
      ) : (
        <div>No analytics data available.</div>
      )}
    </div>
  );
};

export default AnalyticsPage;
