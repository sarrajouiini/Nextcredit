export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  objectif?: string;
  data: T;
}
