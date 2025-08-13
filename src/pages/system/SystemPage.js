import React from 'react';
import HealthMonitor from './HealthMonitor';
import StorageStats from './StorageStats';

function SystemPage() {
  return (
    <div className="p-8">
  <h1 className="text-2xl font-bold mb-6">System Controls</h1>
  <h2 className="text-2xl font-bold mb-4">System Monitor</h2>
      <HealthMonitor />
      <StorageStats />
    </div>
  );
}

export default SystemPage;
