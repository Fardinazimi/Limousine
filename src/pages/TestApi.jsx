import React, { useState } from 'react';
import { saveRecords } from '../lib/api';

export default function TestApi() {
  const [driver, setDriver] = useState('Testfahrer');
  const [uber, setUber] = useState('100');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const payload = [
        {
          id: String(Date.now()),
          driver,
          month,
          weekNumber: 1,
          startDate: `${month}-01`,
          endDate: `${month}-07`,
          uber: Number(uber) || 0,
          bonus: 0,
          tips: 0,
          cashCollectedAmount: 0,
          cashHandedOver: false,
          transferToDriver: 0,
        },
      ];
      const res = await saveRecords(payload);
      setMessage(`Erfolg! Gespeicherte Einträge: ${Array.isArray(res.records) ? res.records.length : 0}`);
    } catch (err) {
      setMessage(`Fehler: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>API Test: /api/records</h2>
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Fahrer</label>
          <input className="form-control" value={driver} onChange={(e) => setDriver(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Uber (€)</label>
          <input type="number" step="0.01" className="form-control" value={uber} onChange={(e) => setUber(e.target.value)} />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Sende...' : 'Test speichern'}
          </button>
        </div>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
