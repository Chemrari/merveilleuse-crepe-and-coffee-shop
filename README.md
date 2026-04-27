# Merveilleuse Crepe & Coffee Shop

Site vitrine statique pour un coffee shop/creperie avec plusieurs pages (accueil, menu, galerie, a propos, contact).

## Apercu

Le projet utilise:
- HTML
- Tailwind CSS (CDN)
- JavaScript vanilla

Fonctionnalites principales:
- Navbar et footer centralises dans `components/`
- Chargement automatique des composants via `components/components-loader.js`
- Mise en surbrillance du lien actif dans la navbar
- Formulaire de contact (Formspree)
- Systeme de reviews (ajout + affichage) avec `localStorage`
- Affichage des derniers reviews dans la page d accueil

## Pages

- `accueil.html`: page d accueil + hero + sections highlights + reviews clients
- `menu.html`: featured crepes + menu complet
- `Gallery.html`: galerie photos
- `about.html`: presentation de la marque
- `contact.html`: infos contact + formulaire + map + section reviews

## Structure du projet

```text
SHOP/
|-- accueil.html
|-- menu.html
|-- Gallery.html
|-- about.html
|-- contact.html
|-- components/
|   |-- navbar.html
|   |-- footer.html
|   `-- components-loader.js
|-- assets/
|   |-- images/
|   `-- js/
|       `-- contact-reviews.js
`-- README.md
```

## Installation et lancement local

Important: le site doit etre lance avec un serveur local (pas avec `file://`) car les composants sont charges avec `fetch()`.

### Option 1 (VS Code)

1. Installer l extension **Live Server**
2. Ouvrir le dossier projet
3. Clic droit sur `accueil.html` -> **Open with Live Server**

### Option 2 (Python)

Dans le dossier `SHOP`, lancer:

```powershell
python -m http.server 5500
```

Puis ouvrir:

```text
http://localhost:5500/accueil.html
```

## Personnalisation rapide

- Modifier la navbar: `components/navbar.html`
- Modifier le footer: `components/footer.html`
- Modifier les items du menu: `menu.html`
- Modifier les reviews (logique): `assets/js/contact-reviews.js`
- Modifier les images: `assets/images/...`

## Notes techniques

- Les reviews sont stockes dans le navigateur (`localStorage`) sous la cle:
  - `merveilleuse_reviews_v1`
- Le formulaire contact envoie vers Formspree (endpoint defini dans `contact.html`).

## Auteur

Projet realise pour Merveilleuse Crepe & Coffee Shop.
