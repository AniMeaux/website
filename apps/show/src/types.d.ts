declare namespace NodeJS {
  interface ProcessEnv {
    RUNTIME_ENV?: "staging" | "production";
    PUBLIC_HOST?: string;
  }
}
