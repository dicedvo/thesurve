import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, CustomParams, getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

export const firebaseConfig = {
  apiKey: import.meta.env.SSR ? process.env.VITE_FIREBASE_API_KEY : import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.SSR ? process.env.VITE_FIREBASE_PROJECT_ID : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.SSR ? process.env.VITE_FIREBASE_APP_ID : import.meta.env.VITE_FIREBASE_APP_ID,
}

export function initializeFirebase(config: typeof firebaseConfig) {
  if (app && analytics) return;

  app = initializeApp(config);
  analytics = getAnalytics(app);
}

export const logAnalyticsEvent = (eventName: string, eventParams?: object) => {
  if (!import.meta.env.SSR && analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export const setAnalyticsUserProperties = (properties: CustomParams) => {
  if (!import.meta.env.SSR && analytics) {
    setUserProperties(analytics, properties);
  }
};

export const getAnalyticsInstance = () => analytics;

type PageViewParams = {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  [key: string]: any;
};

export const logPageView = (params?: PageViewParams) => {
  if (!import.meta.env.SSR && analytics) {
    const defaultParams = {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    };

    logEvent(analytics, 'page_view', {
      ...defaultParams,
      ...params,
    });
  }
};
