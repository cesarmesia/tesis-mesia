// Autenticación demo-grade para la sustentación de tesis.
// Las credenciales y el secreto se configuran por variables de entorno;
// hay valores por defecto para que funcione sin configuración.

export const AUTH_COOKIE = "tesis_session";

const DEFAULT_SECRET = "tesis-mesia-7074-La-Inmaculada-secret";

export function expectedToken(): string {
  return process.env.AUTH_SECRET || DEFAULT_SECRET;
}

export function appUser(): string {
  return process.env.APP_USER || "revisor";
}

export function appPassword(): string {
  return process.env.APP_PASSWORD || "Mesia2025";
}

export function checkCredentials(user: string, password: string): boolean {
  return user === appUser() && password === appPassword();
}
