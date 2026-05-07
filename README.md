# Party Mashup Creator Kit Website

This is a simple static creator/press-kit site for Party Mashup. It can be hosted on any static host, with Supabase used for creator/key request submissions.

## Local Preview

Open `index.html` directly, or run a local static server from the repo root:

```powershell
cd website
python -m http.server 5173
```

If system Python is not available, use the bundled Codex runtime Python path or any static file server.

## Supabase Setup

1. Run `supabase/migrations/20260507162000_creator_requests.sql` in the Supabase SQL Editor, or apply it through the Supabase CLI.
2. Copy `website/config.example.js` to `website/config.js`.
3. Fill in:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Do not commit `website/config.js` if it contains a real project URL and anon key.

The anon key is safe to use in the browser when Row Level Security is enabled. The migration allows public inserts into `creator_requests` but does not allow public reads.

## Deployment

Deploy the contents of `website/` to a static host such as Cloudflare Pages, Netlify, Vercel, or GitHub Pages. Supabase handles the form data; it is not the recommended place to host the static web page itself.

Large video files should stay outside the static deploy. The current trailer button links to Google Drive instead of bundling the 179 MB trailer into the site.

## Press Kit

The downloadable ZIP is generated at:

```text
website/downloads/party-mashup-presskit.zip
```

Regenerate it after changing source marketing assets.
