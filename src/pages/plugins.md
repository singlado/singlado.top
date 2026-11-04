---
layout: ../layouts/Prose.astro
title: Build a source plugin
subtitle: Singlado ships with no sources — you bring your own, as a simple data-driven spec.
---


This page explains what a source plugin is and how to write one.

## The model

A source plugin is **not arbitrary code**. It's a small **data-driven spec** (an
`ExtractorSpec`) describing how to search a service and how to turn an item into
a playable stream. Singlado's generic engine reads that spec and does the work;
the spec never ships executable code, so a plugin is portable and safe to review.

Two kinds of source, set by `resolvesBy`:

- **`RESOLVES_BY_NAME`** — the plugin can search by `artist + title`; Singlado's
  resolver fuzzy-matches and ranks the candidates.
- **`RESOLVES_BY_HANDLE`** — the plugin resolves a precise, opaque `handle` the
  user already chose (no fuzzy matching).

The data exchanged:

- **`Track`** — what you ask to play: `{ artist, title, duration_sec? }`.
- **`SearchResult`** — a candidate from search:
  `{ handle, title, channel, duration_sec, cover_url? }`. `handle` is opaque and
  source-internal — Singlado caches it and re-resolves it later.
- **`ResolvedAudio`** — the playable result:
  `{ url, duration_sec, stream_expires_at? }`. `url` is `null` when a handle
  can't be resolved; `stream_expires_at` lets a source declare when its URL stops
  being valid (so expiring-URL rules stay confined to that source).

## Spec directives {#spec-directives}

An `ExtractorSpec` is JSON with these fields:

| Directive | Type | What it does |
|---|---|---|
| `resolvesBy` | `"RESOLVES_BY_NAME"` \| `"RESOLVES_BY_HANDLE"` | How the source resolves (search-and-rank vs. a precise handle). |
| `searchTemplate` | string | Template used to search the service (for by-name sources). |
| `itemUrlTemplate` | string | Template that turns a `handle` into the item URL to resolve. Supports `{handle}`. |
| `formatSelector` | string | Which stream/format to pick when resolving. |
| `tiers` | array | Ordered fallback attempts — Singlado walks them until one yields a playable stream (see below). |
| `fatalMarkers` | string[] | Error markers that mean "stop, don't retry other tiers" (a genuine failure vs. a transient one). |
| `expireParam` | string \| null | A query param in the stream URL that encodes its expiry (so Singlado knows when to re-resolve). |
| `rangeFromFilesize` | boolean | Whether byte-range windows are derived from the reported file size. |

### Tiers

`tiers` is an ordered list of attempts. Singlado tries each in turn until one
produces a usable stream, which lets a plugin degrade gracefully (e.g. a fast
path first, a more robust path as fallback). Each tier:

| Tier field | Type | What it does |
|---|---|---|
| `label` | string | A human name for the tier (for diagnostics). |
| `extractorArgs` | object | Opaque per-tier extraction options, passed straight through. |
| `jsRuntimes` | string[] | JS runtimes this tier may use (when the service needs a JS challenge solved). |
| `remoteComponents` | string[] | Optional remote helper components the tier may load. |

## Example: a source plugin {#example}

Below is an **illustrative** `ExtractorSpec` for a source that exposes a public
API — here, an open service like **SoundCloud** (it has a public API and is a
legitimate, free source). This shows the *shape* of a spec; adapt the templates
and format selector to the service you're integrating.

```json
{
  "resolvesBy": "RESOLVES_BY_NAME",
  "searchTemplate": "scsearch:{query}",
  "itemUrlTemplate": "https://soundcloud.com/{handle}",
  "formatSelector": "bestaudio[ext=m4a]/bestaudio",
  "fatalMarkers": ["this track is not available", "404 not found"],
  "expireParam": null,
  "rangeFromFilesize": true,
  "tiers": [
    {
      "label": "fast",
      "extractorArgs": {},
      "jsRuntimes": [],
      "remoteComponents": []
    },
    {
      "label": "robust",
      "extractorArgs": { "retries": "3" },
      "jsRuntimes": ["deno"],
      "remoteComponents": []
    }
  ]
}
```

**What happens at runtime:**

1. The user searches "artist title". Because `resolvesBy` is
   `RESOLVES_BY_NAME`, Singlado runs the search, fuzzy-matches and ranks the
   candidates, and picks the best one — getting a `SearchResult` with an opaque
   `handle`.
2. When the user plays it, Singlado builds the item URL from
   `itemUrlTemplate` + `handle`, walks the `tiers` until one yields a playable
   stream in the chosen `formatSelector`, and returns a `ResolvedAudio` with the
   stream URL and real duration.
3. Singlado caches the `handle` and re-resolves it when the stream URL expires.

## Bring your own access

A plugin can target **public, private, free, or paid** services. Singlado itself
**does not include access to any paid service** — if a source requires an
account or subscription, you provide your own credentials/access. The plugin
only describes *how* to talk to the service; it's your right to use it.

## Publishing

A source only becomes playable once its plugin is published to the registry.
Until then, Singlado is a player waiting for a source — which is exactly the
point: open, and yours to extend.
