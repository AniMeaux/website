declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "production" | "development";
    PORT: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_DATABASE_URL: string;
    FIREBASE_PRIVATE_KEY: string;
  }
}
