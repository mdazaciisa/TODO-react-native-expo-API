export interface User {
  email: string;
  name: string;
  token?: string;
}

export interface TaskLocation {
  latitude: number;
  longitude: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  photoUri: string;
  location?: TaskLocation;
  userEmail: string;
  createdAt: string;
}