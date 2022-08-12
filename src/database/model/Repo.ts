export interface Repo {
  id?: number;
  originId: string;
  name: string;
  developer: string;
  language: string;
  description: string;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  homepage: string;
  htmlUrl: string;
  url: string;
  archived: boolean;
  stared: boolean;
}
