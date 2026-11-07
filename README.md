# Faux Alibi

Un jeu d'enquête en pixel art, jouable à la souris dans le navigateur. Interroge les suspects, fouille les lieux et démasque celui qui ment.

**Jouer :** https://lechat45.github.io/Faux_alibi/

Dix enquêtes, plus un niveau test : un couloir de six salles, chacune avec sa façon d'interroger, jouée directement dans le décor.

## Le projet

- `index.html` : le jeu complet, en un seul fichier. Il est généré, ne pas le modifier à la main.
- `src/` : le code source et les styles.
- `tools/build.js` : assemble `src/` en `index.html`.
- `tools/test.js` : vérifie les enquêtes et les cartes des 10 niveaux.
- `tools/serve.js` : serveur local sur le port 4173.

## Construire et tester

```bash
node tools/build.js
```

```bash
node tools/test.js 40
```

```bash
node tools/serve.js
```
