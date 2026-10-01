# Fanni's Store — site e-commerce 🎁

Site vitrine et boutique en ligne de **Fanni's Store**, boutique de cadeaux personnalisés.
Entièrement en HTML / CSS / JavaScript, **sans framework ni étape de compilation** : il se charge vite et s'héberge n'importe où (Netlify, Vercel, GitHub Pages, OVH, un hébergement mutualisé…).

## Pages

| Page | Fichier |
|---|---|
| Accueil (bannière, histoire, catégories, best-sellers, étapes, avis, Instagram, newsletter) | `index.html` |
| Boutique avec filtres (occasion, destinataire, prix) et tri | `boutique.html` |
| Page produit (galerie, personnalisation, prix en direct) | `produit.html?id=…` |
| Configurateur « Crée ta box sur mesure » | `creer-ma-box.html` |
| À propos, valeurs, atelier | `a-propos.html` |
| Contact (formulaire, WhatsApp, Instagram, Facebook, TikTok) | `contact.html` |
| FAQ | `faq.html` |
| Panier et commande (paiement à la livraison ou en ligne) | `panier.html` |
| Mentions légales, CGV, confidentialité | `mentions-legales.html` |

## Voir le site en local (fichiers seuls)

```bash
cd fannis-store
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Espace administration (/admin)

Tout se gère depuis **https://votre-site/admin** — aucune ligne de code à toucher :

- **Produits** : ajouter, modifier, dupliquer, supprimer, réordonner (glisser-déposer),
  photos (redimensionnées automatiquement), prix / prix barré, stock, badge, best-seller,
  textes FR + AR, brouillon ou en ligne, aperçu en direct.
- **Commandes** : chaque commande passée sur le site arrive ici (suivi : nouvelle → confirmée →
  en préparation → expédiée → livrée), message WhatsApp prêt pour la cliente, note interne,
  impression du bon, export CSV.
- **Crée ta box** : tailles, articles, catégories, emballages, finitions et prix du configurateur.
- **Avis clients**, **Messages** du formulaire de contact, **Newsletter** (export CSV).
- **Paramètres** : WhatsApp, email, réseaux sociaux, frais et seuil de livraison, occasions, rubans…

Au premier démarrage, la base est remplie automatiquement avec le catalogue de `assets/js/data.js`.

## Voir le site + l'admin en local

```bash
npm install
ADMIN_EMAIL=moi@exemple.com ADMIN_PASSWORD=MotDePasse npm start
# site : http://localhost:3000   admin : http://localhost:3000/admin
```

Sans `DATABASE_URL`, les données sont enregistrées dans le dossier `data/` (pratique en local).

## Mettre en ligne sur Render

Le site est maintenant un **Web Service Node** (et non plus un « Static Site »).

1. **Base de données** (gratuite et permanente) : créez un projet sur https://neon.tech
   (ou https://supabase.com) et copiez l'URL de connexion `postgresql://…`.
   ⚠️ La base PostgreSQL gratuite de Render est supprimée au bout de 30 jours.
2. Sur https://dashboard.render.com : **New → Blueprint**, dépôt `fannis-store`, puis **Apply**
   (ou **New → Web Service** : *Build Command* `npm install`, *Start Command* `npm start`).
3. Variables d'environnement (*Environment*) :
   | Clé | Valeur |
   |---|---|
   | `DATABASE_URL` | l'URL copiée à l'étape 1 |
   | `ADMIN_EMAIL` | votre email de connexion |
   | `ADMIN_PASSWORD` | un mot de passe solide (12 caractères ou plus) |
   | `SESSION_SECRET` | une longue chaîne aléatoire (générée automatiquement par le Blueprint) |
   | `PUBLIC_URL` | l'adresse du site, ex. `https://www.fannis-store.com` |
4. Supprimez l'ancien service « Static Site » et reportez le nom de domaine sur le nouveau
   (*Settings → Custom Domains*).

Chaque envoi (push) sur `main` redéploie automatiquement le site.
Le plan gratuit met le service en veille après 15 min sans visite (1er chargement plus lent).

## Personnaliser

Tout se règle dans **`assets/js/data.js`** :

- **`FANNI.config`** : numéro WhatsApp (format international sans « + »), email, liens Instagram / Facebook / TikTok, devise, frais et seuil de livraison offerte, lien de paiement en ligne.
- **`FANNI.products`** : les box (nom FR/AR, prix, occasions, destinataires, description, contenu).
- **`FANNI.builder`** : tailles de box, articles, emballages et finitions du configurateur.
- **`FANNI.reviews`** : les avis clients.

### Ajouter vos photos

Tant qu'un produit n'a pas de photo, une illustration de box cadeau (rubans, nœud, étincelles) est générée automatiquement dans ses couleurs.
Pour utiliser vos vraies photos :

1. Déposez-les dans `assets/img/produits/` (JPG ou WebP, environ 1200 × 1500 px, format portrait 4:5).
2. Ajoutez-les au produit dans `data.js` :
   ```js
   images: ["assets/img/produits/eclat-de-rose-1.jpg", "assets/img/produits/eclat-de-rose-2.jpg"],
   ```
   La première image devient la vignette, les suivantes alimentent la galerie.

### Logo

Le logo a été recréé en vectoriel (SVG) d'après votre fichier : `assets/img/logo.svg` (en-tête), `logo-full.svg` (avec « Personalized · Handcrafted »), `favicon.svg`.
Pour utiliser votre fichier original, remplacez simplement ces fichiers (en gardant les mêmes noms).

## Commandes et paiement

- Le **panier** est conservé dans le navigateur du client.
- À la validation, un numéro de commande est créé et le client **envoie le récapitulatif complet sur WhatsApp** en un clic : articles, personnalisations, adresse, date souhaitée, mode de paiement.
- **Paiement à la livraison** : rien à configurer.
- **Paiement en ligne** : renseignez `onlinePaymentUrl` (lien de votre passerelle : Konnect, Flouci, Stripe Payment Link…). Le client y est redirigé avec le montant et le numéro de commande. Laissé vide, un lien de paiement est envoyé au client par WhatsApp. Aucune donnée bancaire ne transite par le site.
- Le formulaire de contact ouvre WhatsApp ou l'email du client avec le message pré-rempli.
- La newsletter enregistre les adresses localement : pour les recevoir vraiment, reliez le formulaire (`.js-newsletter` dans `main.js`) à Brevo, Mailchimp ou un Google Form.

## Langues

Français par défaut, arabe (de droite à gauche) via le bouton **عربي** dans l'en-tête ou le lien `?lang=ar`.
Les traductions sont dans `assets/js/i18n.js`. Le texte des mentions légales reste en français.

## SEO et performance

- Balises title / description uniques, Open Graph, URL canoniques, `sitemap.xml`, `robots.txt`, `site.webmanifest`.
- Données structurées schema.org : `Store` (accueil), `Product` (pages produit), `FAQPage` (FAQ).
- Aucune bibliothèque externe : seulement 3 polices Google Fonts (`display=swap`), des scripts `defer` et des illustrations SVG légères.
- Animations douces au défilement, désactivées si l'utilisateur préfère réduire les animations.
- ⚠️ Remplacez `https://www.fannis-store.com` par votre vrai nom de domaine dans les pages HTML, `sitemap.xml` et `robots.txt`.

## Avant la mise en ligne

- [ ] Numéro WhatsApp, email et réseaux sociaux dans `data.js`
- [ ] Vos photos produits
- [ ] Vos informations légales dans `mentions-legales.html` (repérées par des crochets `[…]`)
- [ ] Votre nom de domaine (voir SEO)
- [ ] Prix, frais de livraison et devise
