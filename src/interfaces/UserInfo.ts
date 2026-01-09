export interface UserInfo {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  company: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  htmlUrl: string;
}
