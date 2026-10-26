export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
);

export const isDemoModeEnabled =
  import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false' || !isFirebaseConfigured;
