# Architecture — TéléSport Olympic Games Dashboard

## Arborescence des dossiers

```
src/
├── api/
│   ├── api.ts                # Fonction getOlympics() — point d'entrée des données
│   └── olympics.mock.json    # Données mockées simulant une API REST
├── components/
│   └── Indicator.tsx         # Composant "dumb" — affiche une stat (total + label)
├── hooks/
│   └── useData.ts            # Custom hook — gestion du fetching via TanStack Query
├── lib/
│   └── chartsData.ts         # Utilitaires de préparation des données pour Chart.js
├── pages/
│   ├── Home.tsx              # Page principale — graphique Pie, indicateurs globaux
│   └── Country.tsx           # Page détail pays — graphique Line, indicateurs par pays
├── types.ts                  # Types TypeScript partagés (Olympic, Country, Participation)
├── main.tsx                  # Point d'entrée React — routing et providers
└── index.css                 # Styles globaux
```

## Composants et leurs rôles

### Composants "smart" (avec logique)

**`pages/Home.tsx`**
Récupère les données via `useData`, calcule les indicateurs globaux, et gère la navigation vers la page détail au clic sur le graphique.

**`pages/Country.tsx`**
Récupère les données via `useData`, filtre le pays correspondant à l'URL (`:id`), et affiche ses statistiques détaillées.

### Composants "dumb" (présentation pure)

**`components/Indicator.tsx`**
Affiche simplement un nombre et un texte descriptif. Ne contient aucune logique métier. Reçoit tout via props.

## Custom Hook — `useData`

```ts
// src/hooks/useData.ts
export const useData = () => {
  return useQuery({
    queryKey: ["olympics"],
    queryFn: () => new Promise((resolve) => setTimeout(() => resolve(getOlympics()), 500)),
    staleTime: 1000 * 60 * 5,
  });
};
```

**Rôle :** centralise la récupération et le cache des données Olympics pour toute l'application.

**Avantages :**
- Les deux pages (`Home` et `Country`) appellent `useData()` indépendamment — TanStack Query ne déclenche qu'une seule requête grâce au cache (`queryKey: ["olympics"]`)
- Les états `isLoading` et `error` sont gérés automatiquement
- Le `staleTime` évite les refetch inutiles pendant 5 minutes

## Préparation des données — `lib/chartsData.ts`

La logique de construction des objets Chart.js est extraite dans des fonctions utilitaires :
- `buildOlympicsChartData(data, navigate)` — données et options du graphique Pie (Home)
- `chartEvolutionData(country)` — données et options du graphique Line (Country)

Cela garde les composants de page légers et concentrés sur l'affichage.

## Préparation à une future connexion API

L'architecture isole volontairement la source de données dans `src/api/api.ts`. Pour connecter une vraie API REST, il suffit de modifier `getOlympics()` :

```ts
// Avant (mock)                                                                         
export function getOlympics(): Olympic[] {                                            
    return data;                                                                        
  }


// Après (API réelle)
export const getOlympics = async (): Promise<Olympic[]> => {
  const response = await fetch("https://api.telesport.fr/olympics");
  return response.json();
};
```

Aucune modification n'est nécessaire dans les composants ou le hook — le contrat de données reste identique.
