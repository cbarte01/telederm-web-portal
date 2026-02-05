 # Documentation Maintenance Checklist
 
 Use this checklist when building new features to ensure documentation stays up-to-date.
 
 ---
 
 ## 📋 Feature Development Checklist
 
 Copy this checklist into your task notes when starting a new feature:
 
 ```markdown
 ### Documentation Updates Required
 
 #### User-Facing Changes
 - [ ] Update relevant user manual (EN): `docs/user-manuals/*-manual-en.md`
 - [ ] Update relevant user manual (DE): `docs/user-manuals/*-manual-de.md`
 - [ ] Add screenshots/diagrams if UI changed significantly
 
 #### Database Changes
 - [ ] Update `docs/technical/database-schema.md` if tables/columns added
 - [ ] Document new RLS policies
 - [ ] Document new database functions/triggers
 
 #### Backend Changes
 - [ ] Update `docs/technical/edge-functions.md` if functions added/modified
 - [ ] Document new API endpoints with request/response examples
 - [ ] Update environment variables section if new secrets required
 
 #### Authentication Changes
 - [ ] Update `docs/technical/authentication.md` if auth flow modified
 - [ ] Document new roles or permissions
 - [ ] Update protected routes section
 
 #### Payment Changes
 - [ ] Update `docs/technical/payment-integration.md` if billing modified
 - [ ] Document new pricing tiers or payment flows
 
 #### Architecture Changes
 - [ ] Update `docs/technical/architecture.md` if structure changed
 - [ ] Update system diagrams
 - [ ] Document new integrations
 
 #### Always Required
 - [ ] Add entry to `docs/changelog.md` with date and summary
 - [ ] Update "Last updated" timestamp on modified docs
 ```
 
 ---
 
 ## 📝 Changelog Entry Format
 
 When adding to `docs/changelog.md`:
 
 ```markdown
 ## [YYYY-MM-DD] - Feature Name
 
 ### Added
 - New feature description
 
 ### Changed
 - Modified behavior description
 
 ### Fixed
 - Bug fix description
 
 ### Security
 - Security-related changes
 ```
 
 ---
 
 ## 🎯 Quick Reference: Which Docs to Update
 
 | Change Type | Documents to Update |
 |-------------|---------------------|
 | New UI feature | User manual (EN + DE), Changelog |
 | New database table | database-schema.md, Changelog |
 | New edge function | edge-functions.md, Changelog |
 | New API endpoint | edge-functions.md, Changelog |
 | Auth flow change | authentication.md, User manuals, Changelog |
 | Pricing change | payment-integration.md, User manuals, Changelog |
 | New user role | authentication.md, database-schema.md, Changelog |
 | New storage bucket | architecture.md, Changelog |
 | Bug fix | Changelog only |
 
 ---
 
 ## 📁 Documentation File Locations
 
 ```
 docs/
 ├── README.md                    # Documentation hub (update if structure changes)
 ├── changelog.md                 # Always update with new features
 ├── MAINTENANCE.md               # This file
 │
 ├── user-manuals/
 │   ├── patient-manual-en.md     # Patient-facing features (English)
 │   ├── patient-manual-de.md     # Patient-facing features (German)
 │   ├── doctor-manual-en.md      # Doctor-facing features (English)
 │   ├── doctor-manual-de.md      # Doctor-facing features (German)
 │   ├── admin-manual-en.md       # Admin-facing features (English)
 │   └── admin-manual-de.md       # Admin-facing features (German)
 │
 └── technical/
     ├── architecture.md          # System design, tech stack
     ├── database-schema.md       # Tables, RLS, functions
     ├── edge-functions.md        # API reference
     ├── authentication.md        # Auth flows, RBAC
     └── payment-integration.md   # Stripe, pricing
 ```
 
 ---
 
 ## ✅ Before Merging Checklist
 
 Before completing a feature, verify:
 
 1. **User Manuals**: Did the UI change? Update both EN and DE versions.
 2. **Technical Docs**: Did the backend change? Update relevant technical docs.
 3. **Changelog**: Every feature/fix needs a changelog entry.
 4. **Timestamps**: Update "Last updated" on modified documents.
 5. **Links**: Test that all internal documentation links work.
 6. **Consistency**: Ensure EN and DE manuals have matching structure.
 
 ---
 
 ## 🔄 Periodic Maintenance
 
 Monthly tasks:
 - [ ] Review changelog for completeness
 - [ ] Verify all documentation links work
 - [ ] Check for outdated screenshots
 - [ ] Ensure EN/DE manuals are in sync
 - [ ] Review technical docs against current codebase
 
 ---
 
 *Last updated: February 2026*