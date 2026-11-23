# Kracht(vrouwen) in de Wijk — website (review copy)

> This repository is a working duplicate of `popisoso/PS2COP`, used for a round of UI review and improvements.
> Changes are made on the `ui-review` branch and merged into `main` through a pull request.
> Preview of the review copy: https://claude.ai/artifact/UzXwWuDtC5fGoTfooJ8kZ6 (private until shared).

A working website built from the Figma file **"The big PS2 sprints file"**, section *Website prototype*
(desktop pages) with the *mobile prototype* as the guide for small screens.

Kracht(vrouwen) in de Wijk is a Community of Practice for and by women's organizations in The Hague.

## View it

- Open `index.html` in a browser, or
- serve the folder: `python3 -m http.server 8000` and visit http://localhost:8000, or
- turn on **GitHub Pages** (Settings → Pages → deploy from branch, root folder). No build step is needed
  for hosting because `index.html` is committed.

## What's in it

| Page | Route | Figma frame |
| --- | --- | --- |
| Home | `#home` | HOME PAGE |
| Organizations | `#organizations` | ORGANIZATIONS |
| Community Map | `#map` | Find your community (interactive flower map, list, profile, contact, success stories) |
| VrouwenBuurtLab Laak | `#org-vbl` | SINGLE ORGANIZATION |
| ReVa Moeders | `#org-reva` | SINGLE ORGANIZATION |
| Events | `#events` | EVENTS PAGE |
| Blog / Blog entry | `#blog`, `#blog-entry` | BLOG, BLOG ENTRY |
| Guide + 5 topics | `#guide`, `#guide-location`, `#guide-structure`, `#guide-frictions`, `#guide-balance`, `#guide-generations` | GUIDE + topic frames |
| FAQ | `#faq` | FAQ PAGE 4–7 |
| Contact | `#contact` | CONTACT PAGE |
| Media | `#media` | MEDIA |
| About us | `#about` | ABOUT US |

Working features: hash routing between all pages, sticky header with Resources dropdown and a mobile
slide-in menu, site-wide search, events calendar (month / week / day views, organization and category
filters, upcoming-events list, event details), filterable lists, accordions, tabs, form validation,
photo lightbox and copy-to-clipboard buttons.

## Project layout

```
index.html              built site (generated — edit pages/ and src/ instead)
artifact.html           same site without <html>/<head>/<body>, for publishing as a claude.ai Artifact
src/shell.html          page shell: <head>, header/footer slots, script tags
pages/<route>.html      one HTML fragment per page
css/site.css            design tokens and shared components (colours, type, buttons, chips, cards…)
js/app.js               header, footer, router, search, calendar and other behaviors
js/events.js            calendar events and organizations — edit this to add events
js/orgs.js              organizations on the Community Map — edit this to add or update an organization
js/map.js               the Community Map (illustrative neighbourhood shapes, flowers, filters, views)
assets/                 images and icons exported from Figma
scripts/build.py        assembles index.html and artifact.html from src/ and pages/
scripts/optimize_images.py  compresses exported images
scripts/check_assets.py     reports missing or unused images
```

## Editing

1. Change a page in `pages/`, the styles in `css/site.css`, or events in `js/events.js`.
2. Run `python3 scripts/build.py` to regenerate `index.html` and `artifact.html`.

Page fragments use data attributes instead of inline scripts — see the comments at the top of `js/app.js`
and the classes in `css/site.css`.

## Placeholders

Content that is not available yet is shown as a highlighted `[text]` placeholder
(`<span class="ph" title="Missing: …">[text]</span>`; hover it to see what is missing). In `js/orgs.js`, any field left
as `null` renders a placeholder automatically. Search the site for `[text]` to find everything that still needs filling in.

Organization facts were checked against public sources (the organizations' own websites, Sociale Kaart Den Haag,
Gemeente Den Haag, De Haagse Hogeschool) in November 2026; the sources are listed per organization in `js/orgs.js`.

## Notes

- Events are the weekly activities published by the organizations (see the comments in `js/events.js`). The calendar
  opens on the current month; weekly activities repeat automatically.
- Events-page filter tags (location, category, demographic) are sample values; adjust the `data-*` attributes
  on the event cards in `pages/events.html`.
- Original site preview: https://claude.ai/artifact/H3i2Hey3RRoHb4DzEnpf8u (private to the owner until shared).
- Forms validate and show a confirmation, but nothing is sent anywhere yet; they need a backend or a form
  service to deliver messages.
- The language switch (globe) only offers English for now.
