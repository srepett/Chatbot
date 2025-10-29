export type Role = 'user' | 'model';

export interface Message {
  id?: number;
  role: Role;
  text: string;
  image?: string;
}

export type Model = 'Zymzz-2.5-flash' | 'Zymzz-1.0-Pro-Beta';

export type Mode = 'chat' | 'imageToCode';