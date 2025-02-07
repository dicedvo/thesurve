import { FirebaseApp, initializeApp } from 'firebase/app';
import { Analytics, CustomParams, getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

if (!import.meta.env.SSR) {
  app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })

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
