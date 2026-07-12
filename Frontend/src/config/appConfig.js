export const APP_CONFIG = {
  appName: import.meta.env.VITE_APP_NAME || "Do It Now App",
  storageKey: import.meta.env.VITE_STORAGE_KEY || "consistency_tasks",
  environment: import.meta.env.VITE_ENV || "development",
  lastOpenKey: "last_open_date"
}