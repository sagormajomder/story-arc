export interface ITutorial {
  _id: string;
  title: string;
  category: string;
  url: string;
  thumbnail: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITutorialFormData {
  title: string;
  category: string;
  url: string;
  thumbnail: string;
  description?: string;
}

export interface ITutorialsResponse {
  tutorials: ITutorial[];
  currentPage: number;
  totalPages: number;
  totalTutorials: number;
}
