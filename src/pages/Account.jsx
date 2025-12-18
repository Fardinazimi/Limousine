// src/components/Account.jsx
import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";

const LS_DRIVERS = "app_drivers_v1";
const LS_RECORDS = "app_records_v1";
const LS_DRIVER_META = "app_driver_meta_v1"; // { [driverName]: { defaultShift: 'Day'|'Night', carPlate: string, carModel: string } }

const emptyEntry = {
  weekNumber: "",
  startDate: "",
  endDate: "",
  uber: "",
  bonus: "",
  tips: "",
  cashCollectedAmount: "",
  cashHandedOver: false,
  transferToDriver: "",
};

function formatCurrency(n, showSymbol = true) {
  const num = Number(n) || 0;
  return (
    num.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + (showSymbol ? " €" : "")
  );
}

function monthKeyFromDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(0, 7);
}

export default function Account() {
  const [drivers, setDrivers] = useState([]);
  const [newDriver, setNewDriver] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [records, setRecords] = useState([]);
  const [entryForm, setEntryForm] = useState(emptyEntry);
  const [editingId, setEditingId] = useState(null);
  const printableRef = useRef(null);
  // Driver meta (shift, car plate, model)
  const [driverMeta, setDriverMeta] = useState({});

  useEffect(() => {
    const lsDrivers = JSON.parse(localStorage.getItem(LS_DRIVERS) || "[]");
    const lsRecords = JSON.parse(localStorage.getItem(LS_RECORDS) || "[]");
    const lsMeta = JSON.parse(localStorage.getItem(LS_DRIVER_META) || "{}");
    setDrivers(lsDrivers);
    setRecords(lsRecords);
    setDriverMeta(lsMeta && typeof lsMeta === "object" ? lsMeta : {});
    if (lsDrivers.length) setSelectedDriver((prev) => prev || lsDrivers[0]);

    // Try to hydrate from server (MongoDB) and override local cache if available
    (async () => {
      try {
        const [drvRes, recRes, metaRes] = await Promise.all([
          fetch("/api/drivers"),
          fetch("/api/records"),
          fetch("/api/driverMeta"),
        ]);
        if (drvRes.ok) {
          const { drivers: dbDrivers = [] } = await drvRes.json();
          if (Array.isArray(dbDrivers)) {
            setDrivers(dbDrivers);
            localStorage.setItem(LS_DRIVERS, JSON.stringify(dbDrivers));
            if (dbDrivers.length && !selectedDriver)
              setSelectedDriver(dbDrivers[0]);
          }
        }
        if (recRes.ok) {
          const { records: dbRecords = [] } = await recRes.json();
          if (Array.isArray(dbRecords)) {
            setRecords(dbRecords);
            localStorage.setItem(LS_RECORDS, JSON.stringify(dbRecords));
          }
        }
        if (metaRes.ok) {
          const { meta: dbMeta = {} } = await metaRes.json();
          if (dbMeta && typeof dbMeta === "object") {
            setDriverMeta(dbMeta);
            localStorage.setItem(LS_DRIVER_META, JSON.stringify(dbMeta));
          }
        }
      } catch (e) {
        // Best-effort: stay on localStorage if API not reachable
        console.warn("API load failed, using local cache", e);
      }
    })();
  }, []);

  const persistDrivers = (arr) => {
    setDrivers(arr);
    localStorage.setItem(LS_DRIVERS, JSON.stringify(arr));
    // Fire-and-forget sync
    fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drivers: arr }),
    }).catch(() => {});
  };

  const persistRecords = (arr) => {
    setRecords(arr);
    localStorage.setItem(LS_RECORDS, JSON.stringify(arr));
    fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records: arr }),
    }).catch(() => {});
  };

  const persistDriverMeta = (meta) => {
    setDriverMeta(meta);
    localStorage.setItem(LS_DRIVER_META, JSON.stringify(meta));
    fetch("/api/driverMeta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meta }),
    }).catch(() => {});
  };

  const getSelectedDriverMeta = () => {
    const m = driverMeta[selectedDriver] || {};
    return {
      defaultShift: m.defaultShift || "Day",
      carPlate: m.carPlate || "",
      carModel: m.carModel || "",
    };
  };

  const updateSelectedDriverMeta = (patch) => {
    if (!selectedDriver) return;
    const current = getSelectedDriverMeta();
    const next = { ...current, ...patch };
    persistDriverMeta({ ...driverMeta, [selectedDriver]: next });
  };

  const handleAddDriver = () => {
    const name = newDriver.trim();
    if (!name) return alert("Bitte Fahrernamen eingeben.");
    if (drivers.includes(name)) {
      setNewDriver("");
      setSelectedDriver(name);
      return;
    }
    const updated = [...drivers, name];
    persistDrivers(updated);
    setNewDriver("");
    setSelectedDriver(name);
  };

  const handleDeleteDriver = (name) => {
    if (!name) return;
    if (
      !window.confirm(
        `Fahrer "${name}" wirklich löschen? Alle Einträge werden entfernt.`
      )
    )
      return;
    const updatedDrivers = drivers.filter((d) => d !== name);
    const updatedRecords = records.filter((r) => r.driver !== name);
    persistDrivers(updatedDrivers);
    persistRecords(updatedRecords);
    if (selectedDriver === name) setSelectedDriver(updatedDrivers[0] || "");
  };

  const filteredEntries = records
    .filter((r) => r.driver === selectedDriver && r.month === selectedMonth)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const onEntryChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntryForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const computeEntryValues = (ent) => {
    const uber = Number(ent.uber) || 0;
    const bonus = Number(ent.bonus) || 0;
    const tips = Number(ent.tips) || 0;
    const cash = Number(ent.cashCollectedAmount) || 0;
    const transfer = Number(ent.transferToDriver) || 0;
    const cashSub = ent.cashHandedOver ? cash : 0;
    // Deduct cash handed over ONLY from driver side, not from Uber/net totals
    const netUber = uber; // keep Uber totals intact
    const weekTotal = uber + bonus;
    const driverShareRaw = (uber + bonus) * 0.4 + tips;
    const driverRemaining = driverShareRaw - cashSub - transfer;
    return {
      uber,
      bonus,
      tips,
      cash,
      cashSub,
      transfer,
      netUber,
      weekTotal,
      driverShareRaw,
      driverRemaining,
    };
  };

  const handleSaveEntry = (ev) => {
    ev?.preventDefault();
    if (!selectedDriver) return alert("Bitte zuerst den Fahrer auswählen.");
    if (!entryForm.weekNumber) return alert("Bitte Woche auswählen.");
    if (!entryForm.startDate || !entryForm.endDate)
      return alert("Start- und Enddatum angeben.");

    const entryMonth = monthKeyFromDate(entryForm.startDate);
    if (entryMonth !== selectedMonth) {
      if (
        !window.confirm(
          "Startdatum gehört zu einem anderen Monat. Trotzdem speichern?"
        )
      )
        return;
    }

    const toSave = {
      id: editingId || Date.now(),
      driver: selectedDriver,
      month: selectedMonth,
      ...entryForm,
    };
    const updatedRecords =
      editingId !== null
        ? records.map((r) => (r.id === editingId ? toSave : r))
        : [...records, toSave];
    persistRecords(updatedRecords);
    setEditingId(null);
    setEntryForm(emptyEntry);
  };

  const startEdit = (rec) => {
    setEditingId(rec.id);
    setEntryForm({ ...rec });
    setSelectedDriver(rec.driver);
    setSelectedMonth(rec.month);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeEntry = (id) => {
    if (!window.confirm("Eintrag löschen?")) return;
    persistRecords(records.filter((r) => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const cancelEdit = () => setEntryForm(emptyEntry) || setEditingId(null);

  const monthlyTotals = () => {
    const sums = {
      uber: 0,
      bonus: 0,
      tips: 0,
      cashSub: 0,
      transfer: 0,
      netUber: 0,
      weekTotal: 0,
      driverShareRaw: 0,
      driverRemaining: 0,
    };
    filteredEntries.forEach((r) => {
      const v = computeEntryValues(r);
      sums.uber += v.uber;
      sums.bonus += v.bonus;
      sums.tips += v.tips;
      sums.cashSub += v.cashSub;
      sums.transfer += v.transfer;
      sums.netUber += v.netUber;
      sums.weekTotal += v.weekTotal;
      sums.driverShareRaw += v.driverShareRaw;
      sums.driverRemaining += v.driverRemaining;
    });
    return sums;
  };

  const totals = monthlyTotals();

  const downloadPdf = async () => {
    if (!printableRef.current) return alert("Nichts zu exportieren.");

    const clone = printableRef.current.cloneNode(true);
    clone.querySelectorAll("button").forEach((btn) => btn.remove());

    // Remove € signs from normal cells
    clone.querySelectorAll("td, th").forEach((cell) => {
      if (!cell.classList.contains("total-cell"))
        cell.innerHTML = cell.innerHTML.replace("€", "");
    });

    const wrapper = document.createElement("div");
    wrapper.style.padding = "20px";
    wrapper.style.backgroundColor = "#fff";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, { scale: 2 });
    document.body.removeChild(wrapper);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth - 20;
    const imgHeight = imgWidth / (imgProps.width / imgProps.height);

    pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
    pdf.setFontSize(16);
    pdf.text(`Monatsübersicht für Fahrer: ${selectedDriver}`, 10, 10);
    pdf.setFontSize(12);
    pdf.text(`Monat: ${selectedMonth}`, 10, 16);
    pdf.save(`${selectedDriver}_${selectedMonth}.pdf`);
  };

  const getMonthOptions = (count = 12) => {
    const now = new Date();
    const res = [];
    for (let i = -3; i < count - 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = d.toLocaleString("de-DE", {
        month: "long",
        year: "numeric",
      });
      res.push({ key, label });
    }
    return res;
  };

  const resetForm = () => setEntryForm(emptyEntry) || setEditingId(null);

  return (
    <div className="container-fluid py-4 px-3 px-lg-4">
      <div className="row g-4">
        {/* DRIVER MANAGEMENT */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100 p-3">
            <h4 className="mb-3">Fahrer verwalten</h4>
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Neuen Fahrer hinzufügen"
                value={newDriver}
                onChange={(e) => setNewDriver(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDriver()}
              />
              <button className="btn btn-dark" onClick={handleAddDriver}>
                Hinzufügen
              </button>
            </div>
            <div className="mb-3">
              <div className="input-group mb-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    const [y, m] = selectedMonth.split("-").map(Number);
                    const d = new Date(y, m - 2, 1);
                    const next = `${d.getFullYear()}-${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}`;
                    setSelectedMonth(next);
                  }}
                >
                  ◀
                </button>
                <input
                  type="month"
                  className="form-control"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  value={selectedMonth}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    const [y, m] = selectedMonth.split("-").map(Number);
                    const d = new Date(y, m, 1);
                    const next = `${d.getFullYear()}-${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}`;
                    setSelectedMonth(next);
                  }}
                >
                  ▶
                </button>
              </div>
              <select
                className="form-select"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">-- Fahrer auswählen --</option>
                {drivers.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {selectedDriver && (
                <button
                  className="btn btn-outline-danger mt-2"
                  onClick={() => handleDeleteDriver(selectedDriver)}
                >
                  Fahrer löschen
                </button>
              )}
              {selectedDriver && (
                <div className="mt-3 border-top pt-3">
                  <h6 className="mb-3">Fahrer Details</h6>
                  <div className="row g-3">
                    <div className="col-12 col-md-4">
                      <label className="form-label">Standard Schicht</label>
                      <select
                        className="form-select"
                        value={getSelectedDriverMeta().defaultShift}
                        onChange={(e) =>
                          updateSelectedDriverMeta({
                            defaultShift: e.target.value,
                          })
                        }
                      >
                        <option value="Day">Tag</option>
                        <option value="Night">Nacht</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Kennzeichen</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="z.B. B-AB 1234"
                        value={getSelectedDriverMeta().carPlate}
                        onChange={(e) =>
                          updateSelectedDriverMeta({ carPlate: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">Fahrzeugmodell</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="z.B. Mercedes E-Klasse"
                        value={getSelectedDriverMeta().carModel}
                        onChange={(e) =>
                          updateSelectedDriverMeta({ carModel: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ENTRY FORM */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm h-100 p-3">
            <h4 className="mb-3">Wöchentliche Einnahme</h4>
            <form onSubmit={handleSaveEntry}>
              <div className="row g-3">
                <div className="col-3">
                  <label className="form-label">Woche</label>
                  <select
                    className="form-select"
                    name="weekNumber"
                    value={entryForm.weekNumber}
                    onChange={onEntryChange}
                  >
                    <option value="">-- Woche auswählen --</option>
                    {[1, 2, 3, 4].map((w) => (
                      <option key={w} value={w}>
                        Woche {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3">
                  <label className="form-label">Startdatum</label>
                  <input
                    type="date"
                    name="startDate"
                    className="form-control"
                    value={entryForm.startDate}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-3">
                  <label className="form-label">Enddatum</label>
                  <input
                    type="date"
                    name="endDate"
                    className="form-control"
                    value={entryForm.endDate}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-3">
                  <label className="form-label">Transfer to Driver (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="transferToDriver"
                    className="form-control"
                    value={entryForm.transferToDriver}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Uber Einkommen (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="uber"
                    className="form-control"
                    value={entryForm.uber}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Bonus (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="bonus"
                    className="form-control"
                    value={entryForm.bonus}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Trinkgeld (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="tips"
                    className="form-control"
                    value={entryForm.tips}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label">Bargeld gesammelt (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cashCollectedAmount"
                    className="form-control"
                    value={entryForm.cashCollectedAmount}
                    onChange={onEntryChange}
                  />
                </div>
                <div className="col-12 form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="cashHandedOver"
                    checked={entryForm.cashHandedOver}
                    onChange={onEntryChange}
                  />
                  <label className="form-check-label">
                    Barzahlung im Büro erfolgt
                  </label>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary flex-grow-1">
                  {editingId ? "Änderungen speichern" : "Eintrag speichern"}
                </button>
                {editingId ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    Abbrechen
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    Zurücksetzen
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* MONTHLY SUMMARY */}
      <div className="card shadow-lg p-4 mb-4 border border-dark bg-light">
        <h3 className="mb-3 text-center">
          Monatsübersicht für Fahrer: {selectedDriver} ({selectedMonth})
        </h3>
        <div ref={printableRef}>
          <table className="table table-bordered table-sm text-center">
            <thead className="table-dark">
              <tr>
                <th>Woche</th>
                <th>Start</th>
                <th>Ende</th>
                <th>Uber</th>
                <th>Bonus</th>
                <th>Tip</th>
                <th>Bargeld</th>
                <th>Abgegeben</th>
                <th>Transfer</th>
                <th>Netto Uber</th>
                <th>Woche Total</th>
                <th>Fahrer (40%) + Tip</th>
                <th>Verbleibender Betrag</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={14}>Keine Einträge</td>
                </tr>
              ) : (
                filteredEntries.map((r) => {
                  const v = computeEntryValues(r);
                  const transferPositive = Number(r.transferToDriver) > 0;
                  const cashPositive = Number(r.cashCollectedAmount) > 0;
                  const highlight = transferPositive && !!r.cashHandedOver;
                  return (
                    <tr key={r.id} className={highlight ? "table-danger" : ""}>
                      <td>{r.weekNumber}</td>
                      <td>{r.startDate}</td>
                      <td>{r.endDate}</td>
                      <td>{formatCurrency(v.uber, false)}</td>
                      <td>{formatCurrency(v.bonus, false)}</td>
                      <td>{formatCurrency(v.tips, false)}</td>
                      <td
                        className={
                          cashPositive && r.cashHandedOver
                            ? "fw-bold text-danger"
                            : ""
                        }
                      >
                        {formatCurrency(v.cash, false)}
                      </td>
                      <td className={highlight ? "fw-bold text-danger" : ""}>
                        {r.cashHandedOver ? "Ja" : "Nein"}
                      </td>
                      <td
                        className={
                          transferPositive ? "fw-bold text-danger" : ""
                        }
                      >
                        {formatCurrency(v.transfer, false)}
                      </td>
                      <td>{formatCurrency(v.netUber, false)}</td>
                      <td>{formatCurrency(v.weekTotal, false)}</td>
                      <td>{formatCurrency(v.driverShareRaw, false)}</td>
                      <td>{formatCurrency(v.driverRemaining, false)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => startEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeEntry(r.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot className="fw-bold bg-secondary text-white">
              <tr>
                <td colSpan={3} className="total-cell">
                  Summen
                </td>
                <td className="total-cell">{formatCurrency(totals.uber)}</td>
                <td className="total-cell">{formatCurrency(totals.bonus)}</td>
                <td className="total-cell">{formatCurrency(totals.tips)}</td>
                <td className="total-cell">{formatCurrency(totals.cashSub)}</td>
                <td></td>
                <td className="total-cell">
                  {formatCurrency(totals.transfer)}
                </td>
                <td className="total-cell">{formatCurrency(totals.netUber)}</td>
                <td className="total-cell">
                  {formatCurrency(totals.weekTotal)}
                </td>
                <td className="total-cell">
                  {formatCurrency(totals.driverShareRaw)}
                </td>
                <td className="total-cell">
                  {formatCurrency(totals.driverRemaining)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-success"
            onClick={downloadPdf}
            disabled={!selectedDriver || filteredEntries.length === 0}
          >
            Als PDF herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}
