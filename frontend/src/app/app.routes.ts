import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'produit',
        loadComponent: () =>
          import('./features/public/produit/produit.component').then(m => m.ProduitComponent),
      },
      {
        path: 'solution',
        loadComponent: () =>
          import('./features/public/solution/solution.component').then(m => m.SolutionComponent),
      },
      {
        path: 'services-ia',
        loadComponent: () =>
          import('./features/public/services-ia/services-ia.component').then(m => m.ServicesIaComponent),
      },
      {
        path: 'tarifs',
        loadComponent: () =>
          import('./features/public/tarifs/tarifs.component').then(m => m.TarifsComponent),
      },
      {
        path: 'article',
        loadComponent: () =>
          import('./features/public/article/article.component').then(m => m.ArticleComponent),
      },
      {
        path: 'article/:slug',
        loadComponent: () =>
          import('./features/public/article/article-detail.component').then(m => m.ArticleDetailComponent),
      },
      {
        path: 'entreprise',
        loadComponent: () =>
          import('./features/public/entreprise/entreprise.component').then(m => m.EntrepriseComponent),
      },
    ]
  },
  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/public/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'agent',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/agent-layout/agent-layout.component').then(m => m.AgentLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/agent/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'octroi',
        loadComponent: () =>
          import('./features/agent/octroi/octroi.component').then(m => m.OctroiComponent),
      },
      {
        path: 'comportement',
        loadComponent: () =>
          import('./features/agent/comportement/comportement.component').then(m => m.ComportementComponent),
      },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./features/agent/assistant/assistant.component').then(m => m.AssistantComponent),
      },
      {
        path: 'dossiers',
        loadComponent: () =>
          import('./features/agent/dossiers/dossiers.component').then(m => m.DossiersComponent),
      },
      {
        path: 'risque',
        loadComponent: () =>
          import('./features/agent/risque/risque.component').then(m => m.RisqueComponent),
      },
      {
        path: 'bi/vue-globale',
        loadComponent: () =>
          import('./features/agent/bi/vue-globale.component').then(m => m.BiVueGlobaleComponent),
      },
      {
        path: 'bi/retard-defaut',
        loadComponent: () =>
          import('./features/agent/bi/retard-defaut.component').then(m => m.BiRetardDefautComponent),
      },
      {
        path: 'bi/profil-clients',
        loadComponent: () =>
          import('./features/agent/bi/profil-clients.component').then(m => m.BiProfilClientsComponent),
      },
      {
        path: 'bi/performance-portefeuille',
        loadComponent: () =>
          import('./features/agent/bi/performance-portefeuille.component').then(m => m.BiPerformancePortefeuilleComponent),
      },
      {
        path: 'bi/evolution-ia',
        loadComponent: () =>
          import('./features/agent/bi/evolution-ia.component').then(m => m.BiEvolutionIaComponent),
      },
      {
        path: 'guide',
        loadComponent: () =>
          import('./features/agent/guide/guide.component').then(m => m.GuideComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/agent/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'monitoring',
        loadComponent: () =>
          import('./features/agent/monitoring/monitoring.component').then(m => m.MonitoringComponent),
      },
      {
        path: 'admin/comptes',
        loadComponent: () =>
          import('./features/agent/admin-comptes/admin-comptes.component').then(m => m.AdminComptesComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
