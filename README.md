# Goudswaard Apps website

Source for https://jeroengoudswaard.github.io, the home of Strokes Gained and
future apps. Plain HTML/CSS/JS, no build step.

```
index.html                     hub: one card per app
assets/site.css, site.js       shared styles, theme + language toggles
strokes-gained/index.html      app landing page
strokes-gained/privacy/        privacy policy (NL + EN)
strokes-gained/app/            web app (filled in at deploy time)
.github/workflows/pages.yml    deploys to GitHub Pages
```

Text is bilingual: write every string as
`<span lang="en">…</span><span lang="nl">…</span>`; the toggle hides the other.

## Adding an app

1. Copy `strokes-gained/` to `<new-app>/` and rewrite the text.
2. Add a card for it in `index.html` (copy the Strokes Gained `<a class="card tint">`).
   Add its page (and privacy page) to `sitemap.xml`, and update `<lastmod>` when a page changes.
3. If it has a web build, add `"<new-app>:<new-app>"` to the loop in
   `.github/workflows/pages.yml` and publish `<new-app>-web.zip` on a release
   tagged `<new-app>` (see the release workflow in the strokes_gained repo).

## How the app gets here

The strokes_gained repo's `Release app` workflow builds the web app and APK,
uploads them to the `strokes-gained` release in this repo, and triggers a
redeploy. The APK link is always
`https://github.com/jeroengoudswaard/jeroengoudswaard.github.io/releases/download/strokes-gained/strokes-gained.apk`.

## Google Search Console

`googleffdf8ada715d6ce6.html` in the root verifies ownership of the site for
Google Search Console. Don't delete or rename it: Google re-checks it, and the
site loses its verified status when it's gone.
