export interface RepositoryItem {
  id?: string | number;
  name: string;
  description?: string | null;
  ownerAvatarUrl?: string | null;
  imageUrl?: string | null;
  owner?: string | null;
  language?: string | null;
}