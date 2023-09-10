declare namespace NodeJS {
  export interface ProcessEnv {
    ACCESS_TOKEN_PUBLIC_KEY: string;
    REFRESH_TOKEN_PUBLIC_KEY: string;
    SESSION_TOKEN_SECRET: string;
    NEXT_PUBLIC_BACKEND: string;
    NEXT_PUBLIC_FRONTEND: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
  }
}
