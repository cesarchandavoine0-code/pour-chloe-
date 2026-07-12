# Pour Chloé 💌

Un cadeau numérique : une page web romantique, animée, avec une vraie galerie de vos photos,
une lettre qui s'écrit sous ses yeux, et un petit espace de messages privés entre vous deux.

## Ce que fait le site

- **Accueil** — ciel nocturne animé (étoiles, lune, météores, montagnes, particules en forme de cœurs),
  médaillon photo qui alterne entre vos 3 photos, nom en lettres dorées.
- **Notre Histoire** — une vraie mise en avant de chaque photo (effet zoom cinématique au défilement),
  avec une légende pour chacune.
- **Nos Petits Instants** — 5 mini-clips vidéo (3 secondes, sans son) qui tournent en boucle,
  lecture automatique déclenchée seulement quand ils sont visibles à l'écran (pour la batterie).
- **Pourquoi Toi** — 6 cartes à retourner, chacune avec une petite raison.
- **Lettre** — ta lettre s'affiche en effet machine à écrire.
- **Carte d'anniversaire (18 ans)** — au clic sur "Ouvre ton cœur" (puis sur le cœur), une carte
  s'ouvre avec deux petits personnages bâtons qui se rencontrent et s'embrassent, suivis d'un
  message d'anniversaire. Se rejoue à chaque clic. **Verrouillée jusqu'au 19 août 2026** : avant
  cette date, le clic affiche juste un petit indice ("Patience… ce secret s'ouvre le 19 août") sans
  rien dévoiler.
- **Galerie plein écran** — clique sur n'importe quelle photo pour l'ouvrir en grand, navigue avec
  les flèches, le clavier (← →) ou en swipant au doigt sur mobile.
- **Nos mots** — un espace de messages privés (bouton 💌 en bas à droite), protégé par un code PIN
  pour changer d'expéditeur.
- **Musique** — bouton ♪ en bas à gauche pour lancer une musique d'ambiance en fond.

## Personnaliser

Tout se modifie facilement, sans rien casser :

| Je veux changer... | Où |
|---|---|
| Les photos | Remplace `photo1.png`, `photo2.jpg`, `photo3.jpg` (garde les mêmes noms, ou édite les chemins dans `index.html` et `js/gallery.js`) |
| Les légendes de "Notre Histoire" | Directement dans `index.html`, section `#story` |
| Les vidéos de "Nos Petits Instants" | Remplace les fichiers dans `videos/` (garde des clips courts, sans son, format mp4 H.264) |
| Les 6 raisons ("Pourquoi Toi") | Dans `index.html`, section `#reasons` |
| Le texte de la lettre | Dans `js/letter.js`, variable `TEXT` |
| Le message d'anniversaire | Dans `index.html`, section `#birthday-wrap`, classe `.bday-text` |
| La date de déverrouillage de la carte (par défaut le 19/08/2026) | Dans `js/app.js`, `CONFIG.birthdayUnlockDate` |
| Le code PIN (par défaut `2008`) | Dans `js/messenger.js`, variable `PIN_OWNER` |
| La musique | Remplace `music.mp3` par un vrai fichier audio (voir note plus bas) |
| Un compteur "ensemble depuis..." | Dans `js/app.js`, mets `CONFIG.startDate` au format `"AAAA-MM-JJ"` |

## ⚠️ Un point important

**Les messages privés sont stockés dans le navigateur** (`localStorage`), pas sur un serveur.
   Cela veut dire qu'ils sont fiables et persistent d'une visite à l'autre *sur le même appareil/navigateur*,
   mais ne se synchronisent pas automatiquement entre ton téléphone et le sien si vous ouvrez le site
   chacun de votre côté. Idéal si vous ouvrez le site ensemble sur un même appareil pour vous laisser
   des mots ; pour une vraie synchronisation en temps réel entre deux appareils il faudrait un petit
   service de stockage en ligne (hors du présent site statique).

## Structure du projet

```
pour-chloe/
├── index.html          # structure de la page
├── style.css            # tous les styles
├── js/
│   ├── scene.js          # fond animé (ciel, montagnes, particules)
│   ├── reveal.js          # apparitions au défilement
│   ├── gallery.js         # médaillon + galerie plein écran
│   ├── letter.js          # lettre en machine à écrire
│   ├── messenger.js       # messages privés + code PIN
│   ├── moments.js         # lecture des mini-clips vidéo en boucle
│   ├── birthday.js        # carte d'anniversaire animée (18 ans)
│   └── app.js             # config, init, musique, petites features
├── photo1.png / photo2.jpg / photo3.jpg
├── videos/memory-1.mp4 … memory-5.mp4
├── music.mp3
└── README.md
```

## API — accéder aux messages programmatiquement

Les messages sont stockés en JSON dans le `localStorage` du navigateur, sous la clé `chloe-messages`.
Chaque message a la forme `{ author, text, ts }`.

**JavaScript (dans la console du navigateur ou un script sur la page) :**
```js
const messages = JSON.parse(localStorage.getItem('chloe-messages') || '[]');
console.log(messages);
```

**Ajouter un message par script :**
```js
const messages = JSON.parse(localStorage.getItem('chloe-messages') || '[]');
messages.push({ author: 'Chloé', text: 'Coucou !', ts: Date.now() });
localStorage.setItem('chloe-messages', JSON.stringify(messages));
```

Comme il s'agit de `localStorage`, il n'y a pas d'API réseau (pas de Python/curl possible) —
tout se passe côté navigateur, sur l'appareil qui a ouvert la page.

## Déployer

Ce site est 100% statique (HTML/CSS/JS), il n'y a besoin d'aucun serveur ni build.
Tu peux le déployer gratuitement sur **GitHub Pages** (Settings → Pages → déployer depuis la branche `main`),
Netlify, Vercel, ou n'importe quel hébergement statique — il suffit d'envoyer tous ces fichiers tels quels.
