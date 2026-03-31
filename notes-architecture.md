# Notes d'architecture — Analyse du starter code

## Observations générales

Le starter code est entièrement contenu dans un seul fichier `src/App.tsx` de 380 lignes. Tout y est mélangé : données, logique, composants, routing. C'est le problème central à corriger.

---

## Anti-patterns identifiés

### Anti-pattern 1 — Données hardcodées dans le composant
Les données des pays olympiques (5 pays, leurs participations) sont définies directement dans `App.tsx` sous forme d'un tableau `olympicsData` littéral.

**Problème :** dans un vrai projet, ces données viendraient d'une API. Les mélanger avec le code UI rend impossible le remplacement par un vrai fetch sans toucher aux composants.

**Solution :** extraire dans un module `api/` avec une fonction `getOlympics()`.

---

### Anti-pattern 2 — Composant Home défini dans App.tsx
Le composant `Home` (et `Country`) sont définis dans `App.tsx` au lieu d'avoir leurs propres fichiers.

**Problème :** un fichier par composant est la convention React. Ça nuit à la lisibilité et la maintenabilité.

**Solution :** créer `src/pages/Home.tsx` et `src/pages/Country.tsx`.

---

### Anti-pattern 3 — Usage de `any` partout
Tous les types sont annotés `any` : `useState<any>`, paramètres de fonctions, données du tableau.

**Problème :** on perd tous les bénéfices de TypeScript (autocomplétion, détection d'erreurs).

**Solution :** définir des interfaces dans `src/types.ts` (`Olympic`, `Participation`).

---

### Anti-pattern 4 — `useEffect` avec logique de fetching dans le composant
Le `useEffect` qui charge les données (avec `setTimeout`) est directement dans `Home`.

**Problème :** la logique de récupération de données est couplée au rendu. Difficile à tester, réutiliser, ou remplacer.

**Solution :** extraire dans un custom hook (`useData`) ou utiliser react query.

---

### Anti-pattern 5 — `console.log` en production
Plusieurs `console.log` sont présents : `'Loading data...'`, `'Data loaded:'`, `'App rendered'`, `'Loading country with id:'`, etc.

**Problème :** polluent la console en production, peuvent exposer des données sensibles.

**Solution :** les supprimer.

---

### Anti-pattern 6 — Logique métier dans le composant
La fonction `calculateTotalMedals` est définie directement dans `Home`.

**Problème :** mélange UI et logique. Difficile à tester unitairement.

**Solution :** extraire dans un utilitaire `lib/chartsData.ts`.

---

### Anti-pattern 7 — État de chargement dérivé des données
`if (!data) return <div>Chargement...</div>` — l'état de chargement est déduit du fait que `data` est `null`.

**Problème :** on ne distingue pas "en cours de chargement" de "données absentes" ou "erreur". Impossible d'afficher un message d'erreur différent.

**Solution :** états dédiés `isLoading` et `error`, natifs avec TanStack Query.

---

### Anti-pattern 8 — Composant dupliqué entre Home et Country
Les "cartes" d'indicateurs (pays participants, éditions des JO, etc.) sont du HTML dupliqué entre `Home` et `Country`.

**Problème :** si on veut changer le style, il faut le faire à deux endroits.

**Solution :** extraire en composant réutilisable `Indicator.tsx`.

---

### Anti-pattern 9 — Plusieurs composants dans le même fichier
`Home`, `Country` et `App` sont tous dans `App.tsx`.

**Problème :** fichier de 380 lignes, difficile à naviguer. Violation du principe de responsabilité unique.

**Solution :** un fichier par composant.

---

### Anti-pattern 10 — Préparation des données du graphique dans le composant
Les objets `chartData` et `chartOptions` (pour Chart.js) sont construits directement dans le corps du composant.

**Problème :** mélange logique de présentation et logique de transformation de données.

**Solution :** extraire dans `lib/chartsData.ts`.

---

### Anti-pattern 11 — Routing dans App.tsx
Le `BrowserRouter` et les `Routes` sont dans `App.tsx`.

**Problème :** manque de séparation des responsabilités.

**Solution :** déplacer le routing dans `main.tsx`.

---

## Résumé des priorités

| Priorité | Problème | Impact |
|----------|----------|--------|
| Haute | Données hardcodées dans le composant | Bloque toute connexion API future |
| Haute | Tout dans un seul fichier | Lisibilité et maintenabilité |
| Haute | `any` partout | Sécurité TypeScript nulle |
| Moyenne | Logique dans les composants | Difficile à tester |
| Faible | `console.log` | Propreté du code |
