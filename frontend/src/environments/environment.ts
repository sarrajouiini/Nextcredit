export const environment = {
  production: false,
  apiUrl: '/api',
  bankInfo: {
    nom: 'NextCredit Bank',
    email: 'entreprise@teamwillgroup.tn',
    telephone: '+216 71 000 000',
    adresse: 'Rue du Lac Biwa Lotissement EL KHALIJ, Les Berges du lac, Tunis',
    siteWeb: 'https://www.teamwillgroup.com/fr/filiales/teamwill-tunis-tunisie/',
  },
  powerBiDashboards: {
    // Même rapport Power BI (report unique à 4 pages internes) — chaque
    // dashboard pointe vers sa page via &pageName=<id de la page>.
    vueGlobale:              'https://app.powerbi.com/reportEmbed?reportId=42700feb-f9f8-438c-b0b2-c0750355e93c&autoAuth=true&ctid=c34f8dab-ff06-4970-8c69-ce12c4490de2&pageName=be69bb16bc52531e64a2',
    performancePortefeuille: 'https://app.powerbi.com/reportEmbed?reportId=42700feb-f9f8-438c-b0b2-c0750355e93c&autoAuth=true&ctid=c34f8dab-ff06-4970-8c69-ce12c4490de2&pageName=c0755a817e09999c0337',
    retardDefaut:            'https://app.powerbi.com/reportEmbed?reportId=42700feb-f9f8-438c-b0b2-c0750355e93c&autoAuth=true&ctid=c34f8dab-ff06-4970-8c69-ce12c4490de2&pageName=9ab57b101096e5cb7c15',
    profilClients:           'https://app.powerbi.com/reportEmbed?reportId=42700feb-f9f8-438c-b0b2-c0750355e93c&autoAuth=true&ctid=c34f8dab-ff06-4970-8c69-ce12c4490de2&pageName=3d6cef1815c0b330763a',
  },
};
