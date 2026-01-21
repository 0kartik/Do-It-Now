// src/pages/Settings.jsx
import { useState } from "react"
import { clearAllData, cleanupStorage, getIntentLogs } from "../services/storageService"
import { useNavigate } from "react-router-dom"

export default function Settings() {
  const navigate = useNavigate()
  const [storageInfo, setStorageInfo] = useState(null)

  function calculateStorageSize() {
    try {
      let totalSize = 0
      let itemCount = 0
      const breakdown = {}

      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = localStorage[key].length + key.length
          totalSize += size
          itemCount++
          breakdown[key] = (size / 1024).toFixed(2) + " KB"
        }
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      const usagePercentage = ((totalSize / maxSize) * 100).toFixed(2)

      setStorageInfo({
        totalSize: (totalSize / 1024).toFixed(2) + " KB",
        itemCount,
        usagePercentage: usagePercentage + "%",
        breakdown,
        eventLogs: getIntentLogs().length
      })
    } catch (error) {
      console.error("Failed to calculate storage:", error)
    }
  }

  function handleCleanup() {
    if (window.confirm("This will remove old event logs. Continue?")) {
      cleanupStorage()
      calculateStorageSize()
      alert("Storage cleaned up successfully!")
    }
  }

  function handleReset() {
    if (window.confirm("⚠️ This will DELETE ALL your data! Are you absolutely sure?")) {
      if (window.confirm("This action cannot be undone. Confirm deletion?")) {
        clearAllData()
        alert("All data cleared. Refreshing app...")
        window.location.reload()
      }
    }
  }

  function exportData() {
    try {
      const data = {}
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          data[key] = localStorage[key]
        }
      }

      const dataStr = JSON.stringify(data, null, 2)
      const blob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement("a")
      link.href = url
      link.download = `do-it-now-backup-${Date.now()}.json`
      link.click()
      
      URL.revokeObjectURL(url)
      alert("Data exported successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export data")
    }
  }

  function importData() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          
          if (window.confirm("This will overwrite your current data. Continue?")) {
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, data[key])
            })
            alert("Data imported successfully! Refreshing app...")
            window.location.reload()
          }
        } catch (error) {
          console.error("Import failed:", error)
          alert("Failed to import data. Invalid file format.")
        }
      }
      reader.readAsText(file)
    }
    
    input.click()
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>⚙️ Settings</h1>

      {/* Storage Information */}
      <section style={{
        background: "#f9fafb",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px"
      }}>
        <h2>📦 Storage Information</h2>
        
        {!storageInfo ? (
          <button
            onClick={calculateStorageSize}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Check Storage Usage
          </button>
        ) : (
          <div>
            <div style={{ marginBottom: "15px" }}>
              <p><strong>Total Size:</strong> {storageInfo.totalSize}</p>
              <p><strong>Items Stored:</strong> {storageInfo.itemCount}</p>
              <p><strong>Storage Usage:</strong> {storageInfo.usagePercentage}</p>
              <p><strong>Event Logs:</strong> {storageInfo.eventLogs} events</p>
            </div>

            <details style={{ marginTop: "15px" }}>
              <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
                Storage Breakdown
              </summary>
              <ul style={{ marginTop: "10px" }}>
                {Object.entries(storageInfo.breakdown).map(([key, size]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {size}
                  </li>
                ))}
              </ul>
            </details>

            <button
              onClick={calculateStorageSize}
              style={{
                padding: "8px 16px",
                backgroundColor: "#757575",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                marginTop: "15px"
              }}
            >
              Refresh
            </button>
          </div>
        )}
      </section>

      {/* Data Management */}
      <section style={{
        background: "#f9fafb",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "30px"
      }}>
        <h2>💾 Data Management</h2>
        
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "15px"
        }}>
          <button
            onClick={exportData}
            style={{
              padding: "12px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            📥 Export Data (Backup)
          </button>

          <button
            onClick={importData}
            style={{
              padding: "12px 20px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            📤 Import Data (Restore)
          </button>

          <button
            onClick={handleCleanup}
            style={{
              padding: "12px 20px",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            🧹 Cleanup Storage
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section style={{
        background: "#ffebee",
        padding: "20px",
        borderRadius: "12px",
        border: "2px solid #f44336"
      }}>
        <h2 style={{ color: "#d32f2f" }}>⚠️ Danger Zone</h2>
        <p style={{ color: "#666" }}>
          These actions cannot be undone. Proceed with caution.
        </p>

        <button
          onClick={handleReset}
          style={{
            padding: "12px 20px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "15px"
          }}
        >
          🗑️ Reset All Data
        </button>
      </section>

      {/* Quick Links */}
      <section style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f9fafb",
        borderRadius: "12px"
      }}>
        <h3>Quick Navigation</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            onClick={() => navigate("/analytics")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#9c27b0",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            View Analytics
          </button>
          
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#607d8b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Back to Home
          </button>
        </div>
      </section>
    </div>
  )
}