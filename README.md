<img width="1024" height="500" alt="singlado-feature-1024x500" src="https://github.com/user-attachments/assets/49d99c5c-25e6-44e0-b7cd-ae00ea984ce7" />

# singlado.

**[singlado.top](https://singlado.top)** — a music player that ships with no catalog of its own. You bring the sources.

Singlado is a cross-platform media player. It has no built-in library: a **source** is a plugin you add — a small, declarative JSON manifest that tells the app how to search a service and how to turn a result into something it can play. Connect a personal media server (Subsonic/Navidrome, Jellyfin, Emby, Plex) or add a community plugin. Only what you add shows up.

This repository hosts the **marketing site** and the **public release downloads**.

## About

Singlado is a **player, not a streaming service**. It does not host, index, or distribute any music of its own, and it ships with no catalog. What you can play is entirely what *you* connect: your own media server, or a community plugin pointing at a service you already use. The app is the player; the sources are yours.

Plugins follow one rule — **data, not code**. A source is a plain JSON manifest that describes *where* to read and *how* to shape a result, never *what to execute*. The engine runs only a fixed, closed set of built-in steps, so a plugin can be read top to bottom and shared without running anyone's code. That keeps the app small, auditable, and the same across Android, Linux, Windows and macOS.

The goal is a clean, out-of-the-way player you own, pointed at the sources you choose — nothing bundled, nothing watching over your shoulder.

## Download

Get the latest build from the [**Releases**](https://github.com/singlado/singlado.top/releases/latest) page:

- **Android** — `singlado-<version>.apk`
- **Linux (x64)** — `singlado-linux-x64.tar.gz`
- **Windows (x64)** — `singlado-windows-x64.zip`
- **macOS** — `singlado-macos.dmg` *(not notarized yet — the first time, right-click the app → Open, or System Settings → Privacy & Security → Open Anyway)*

Android is also on Google Play.

## Plugins

A source is **data, not code**: a manifest is pure JSON with no embedded script and no way to run arbitrary code. The engine composes a fixed, closed set of built-in steps; a manifest only chooses which steps run and with what data. That is what makes a plugin safe to read and safe to share.

Full plugin reference and the step vocabulary: **[singlado.top/plugins](https://singlado.top/plugins)**.

In the app, open **Add a source** to connect a media server or import a community plugin (from GitHub, a file, pasted JSON, or a URL). Community plugins are not verified by us — you decide which to trust.

## Features

Multi-source search, a player that gets out of the way (queue, shuffle, repeat, gapless-style transitions, loudness leveling), casting to Chromecast/Nest with "Play on…" output switching, Android Auto, and the same app on Android, Linux, Windows and macOS. See **[singlado.top/features](https://singlado.top/features)**.

## This repo (the site)

The site is built with [Astro](https://astro.build) + Tailwind and deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
```

Pages live in `src/pages/`, shared pieces in `src/components/` and `src/layouts/`, static assets (including app screenshots) in `public/`.

## Links

- Site: [singlado.top](https://singlado.top)
- Privacy: [singlado.top/privacy](https://singlado.top/privacy)
- Account & data deletion: [singlado.top/account-deletion](https://singlado.top/account-deletion)
