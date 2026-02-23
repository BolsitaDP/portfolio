export const APP_BASE_PATH =
  process.env.NODE_ENV === "production" ? "/portfolio" : "";

export function withBasePath(path: string) {
  return path.startsWith("/")
    ? `${APP_BASE_PATH}${path}`
    : `${APP_BASE_PATH}/${path}`;
}
