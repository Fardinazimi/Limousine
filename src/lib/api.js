// src/lib/api.js
// Small API helper that reads Vite env var VITE_BACKEND_URL
// If not provided, will use relative URLs (same origin)

const RAW_BASE = import.meta?.env?.VITE_BACKEND_URL || '';
const API_BASE = RAW_BASE.replace(/\/$/, ''); // strip trailing slash

async function http(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

export async function getDrivers() {
  return http(apiUrl('/api/drivers'));
}

export async function saveDrivers(drivers) {
  return http(apiUrl('/api/drivers'), {
    method: 'POST',
    body: JSON.stringify({ drivers }),
  });
}

export async function getRecords() {
  return http(apiUrl('/api/records'));
}

export async function saveRecords(records) {
  return http(apiUrl('/api/records'), {
    method: 'POST',
    body: JSON.stringify({ records }),
  });
}

export async function getDriverMeta() {
  return http(apiUrl('/api/driverMeta'));
}

export async function saveDriverMeta(meta) {
  return http(apiUrl('/api/driverMeta'), {
    method: 'POST',
    body: JSON.stringify({ meta }),
  });
}
