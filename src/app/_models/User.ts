import { Photo } from './Photo';
export interface User {
  id: number;
  username: string;
  gender: string;
  age: number;
  knownAs: string;
  created: Date;
  lastActive: Date;
  city: string;
  country: string;
  photoUrl: string;
  interests?: string;
  lookingFor?: string;
  introduction?: string;
  photos?: Photo[];
}