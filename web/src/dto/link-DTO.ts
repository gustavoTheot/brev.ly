export interface LinkResponse {
  id: string;
  originalUrl: string;
  shortUrl: string;
  userCounter: number;
}

export interface LinkProps {
  originUrl: string;
  shortUrl: string;
}