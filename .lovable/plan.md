
# Add Minimal CSP Meta Tag

## Summary
Add a Content Security Policy meta tag to `index.html` that provides defense-in-depth XSS protection while maintaining compatibility with all application features including Supabase, Stripe checkout, and external images.

## What This Achieves
- Blocks execution of injected inline scripts (primary XSS protection)
- Restricts which domains can load resources
- Prevents clickjacking via frame-ancestors restriction
- Adds defense-in-depth layer on top of existing React/Zod protections

## Implementation

### File to Modify: `index.html`

Add CSP meta tag to the `<head>` section:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https: blob:; 
               font-src 'self' data:; 
               connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://checkout.stripe.com; 
               frame-src https://js.stripe.com https://checkout.stripe.com; 
               frame-ancestors 'self';">
```

### CSP Directives Explained

| Directive | Value | Purpose |
|-----------|-------|---------|
| `default-src` | `'self'` | Fallback - only allow resources from same origin |
| `script-src` | `'self'` | Only allow scripts from your domain (blocks inline XSS) |
| `style-src` | `'self' 'unsafe-inline'` | Allow Tailwind's inline styles |
| `img-src` | `'self' data: https: blob:` | Allow local images, data URIs, any HTTPS images (Unsplash, Google favicon, doctor websites), and blob URLs for photo uploads |
| `font-src` | `'self' data:` | Allow bundled fonts and data URI fonts |
| `connect-src` | `'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://checkout.stripe.com` | Allow API calls to Supabase (including realtime WebSocket) and Stripe |
| `frame-src` | `https://js.stripe.com https://checkout.stripe.com` | Allow Stripe checkout iframes |
| `frame-ancestors` | `'self'` | Prevent your app from being embedded (clickjacking protection) |

### External Resources Accounted For

Based on codebase analysis:
- **Supabase**: API calls and realtime subscriptions (`*.supabase.co`, `wss://*.supabase.co`)
- **Stripe**: Payment checkout (`api.stripe.com`, `checkout.stripe.com`, `js.stripe.com`)
- **Images**: Google favicon, Unsplash blog images, doctor website images (allowed via `https:`)
- **Photo uploads**: Blob URLs for client-side image previews

---

## Technical Notes

### Why `'unsafe-inline'` for styles only?
- Tailwind CSS and many UI libraries use inline styles
- Blocking inline styles would break the entire UI
- Inline styles are lower-risk than inline scripts

### Why no `'unsafe-inline'` for scripts?
- This is the key XSS protection - blocks injected `<script>` tags
- Vite bundles all JS into external files, so no legitimate inline scripts needed

### Widget Embedding Consideration
The Widget page (`/widget/:referralCode`) is designed to be embedded on doctor websites. The `frame-ancestors 'self'` directive would block this. Options:
1. Keep as-is (widget opens in new tab anyway via `window.open`)
2. If iframe embedding is needed later, remove `frame-ancestors` or set to `*`

Currently the widget uses `window.open` so `frame-ancestors 'self'` is fine.
