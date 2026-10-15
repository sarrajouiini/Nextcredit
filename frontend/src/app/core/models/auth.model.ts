export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface AgentInfo {
  email: string;
  nom: string;
  prenom: string;
  role: 'agent' | 'admin';
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  agent: AgentInfo;
}
