export type Gist = { id: string; description: string | null; updated_at: string; public: boolean };
export type GistRevision = { version: string; committed_at: string };

const cachedGists = new Map<string, Gist[]>();

export function readCachedGists(login: string): Gist[] | undefined {
  const cached = cachedGists.get(login.toLowerCase());
  return cached?.map((gist) => ({ ...gist }));
}

export function cacheGists(login: string, gists: Gist[]): void {
  cachedGists.set(login.toLowerCase(), gists.map((gist) => ({ ...gist })));
}

export function clearCachedGists(login: string): void {
  cachedGists.delete(login.toLowerCase());
}

export function mainBackupKey(login: string): string {
  return `updainium.main-gist.v1.${login.toLowerCase()}`;
}

export function chooseMainBackup(gists: Gist[], rememberedId: string | null): string {
  if (rememberedId && gists.some((gist) => gist.id === rememberedId)) return rememberedId;
  return gists.length === 1 ? gists[0].id : "";
}
