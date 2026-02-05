 # Medena Care - Developer Quick Start Guide
 
 Welcome to the Medena Care development team! This guide will get you up and running quickly.
 
 ---
 
 ## 🚀 Quick Setup (5 minutes)
 
 ### Prerequisites
 - Node.js 18+ ([install with nvm](https://github.com/nvm-sh/nvm))
 - Git
 
 ### Steps
 
 ```bash
 # 1. Clone the repository
 git clone <YOUR_GIT_URL>
 cd medena-care
 
 # 2. Install dependencies
 npm install
 
 # 3. Start development server
 npm run dev
 ```
 
 The app will be available at `http://localhost:8080`
 
 > **Note**: Environment variables are pre-configured. No `.env` setup required for local development.
 
 ---
 
 ## 🏗️ Project Structure
 
 ```
 medena-care/
 ├── src/
 │   ├── components/       # Reusable UI components
 │   │   ├── ui/           # shadcn/ui primitives
 │   │   ├── admin/        # Admin-specific components
 │   │   ├── consultation/ # Consultation flow components
 │   │   └── patient/      # Patient-specific components
 │   ├── pages/            # Route pages
 │   │   ├── auth/         # Login pages (Patient, Doctor, Admin)
 │   │   ├── consultation/ # Multi-step consultation wizard
 │   │   └── dashboards/   # Role-based dashboards
 │   ├── hooks/            # Custom React hooks
 │   ├── contexts/         # React contexts (AuthContext)
 │   ├── i18n/             # Translations (EN/DE)
 │   └── integrations/     # Supabase client & types
 ├── supabase/
 │   ├── functions/        # Edge Functions (Deno/TypeScript)
 │   └── migrations/       # Database schema migrations
 └── docs/                 # Documentation
 ```
 
 ---
 
 ## 🔑 Key Concepts
 
 ### 1. Three User Roles
 
 | Role | Entry Point | Dashboard | How Created |
 |------|-------------|-----------|-------------|
 | **Patient** | `/auth` | `/patient/dashboard` | Self-signup |
 | **Doctor** | `/auth/doctor` | `/doctor/dashboard` | Admin creates |
 | **Admin** | `/auth/admin` | `/admin/dashboard` | Seeded via Edge Function |
 
 ### 2. Authentication Flow
 
 ```typescript
 // Access auth state anywhere
 import { useAuth } from "@/contexts/AuthContext";
 
 const { user, session, signOut } = useAuth();
 ```
 
 ```typescript
 // Check user role
 import { useRole } from "@/hooks/useRole";
 
 const { role, isLoading, hasRole } = useRole();
 if (hasRole("doctor")) { /* ... */ }
 ```
 
 ### 3. Database Access (Supabase)
 
 ```typescript
 import { supabase } from "@/integrations/supabase/client";
 
 // Query data
 const { data, error } = await supabase
   .from("consultations")
   .select("*")
   .eq("patient_id", user.id);
 
 // Types are auto-generated
 import type { Tables } from "@/integrations/supabase/types";
 type Consultation = Tables<"consultations">;
 ```
 
 ### 4. Internationalization (i18n)
 
 ```typescript
 import { useTranslation } from "react-i18next";
 
 const { t } = useTranslation("common");
 return <h1>{t("welcome")}</h1>;
 ```
 
 Translation files: `src/i18n/locales/{en,de}/*.json`
 
 ### 5. Styling (Tailwind + Design Tokens)
 
 ```tsx
 // ✅ Use semantic tokens
 <div className="bg-background text-foreground">
   <Button variant="default">Primary Action</Button>
 </div>
 
 // ❌ Avoid raw colors
 <div className="bg-white text-black">...</div>
 ```
 
 Design tokens defined in: `src/index.css` and `tailwind.config.ts`
 
 ---
 
 ## 📋 Common Tasks
 
 ### Add a New Page
 
 1. Create component in `src/pages/YourPage.tsx`
 2. Add route in `src/App.tsx`
 3. Wrap with `<ProtectedRoute>` if auth required
 
 ### Add a Database Table
 
 1. Create migration via Lovable's migration tool
 2. Include RLS policies for security
 3. Types auto-regenerate in `src/integrations/supabase/types.ts`
 
 ### Create an Edge Function
 
 1. Add folder: `supabase/functions/your-function/`
 2. Create `index.ts` with Deno handler
 3. Functions auto-deploy on commit
 
 ```typescript
 // supabase/functions/your-function/index.ts
 import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 
 serve(async (req) => {
   return new Response(JSON.stringify({ message: "Hello" }), {
     headers: { "Content-Type": "application/json" },
   });
 });
 ```
 
 ### Add Translations
 
 1. Add keys to both `src/i18n/locales/en/*.json` and `de/*.json`
 2. Use `t("namespace:key")` in components
 
 ---
 
 ## 🧪 Testing
 
 ```bash
 # Run unit tests
 npm test
 
 # Run specific test file
 npm test -- src/lib/validation/__tests__/sanitization.test.ts
 ```
 
 ---
 
 ## 🔒 Security Checklist
 
 Before submitting code, verify:
 
 - [ ] New tables have RLS policies enabled
 - [ ] Sensitive data uses appropriate access controls
 - [ ] User input is sanitized (see `src/lib/validation/sanitization.ts`)
 - [ ] Edge Functions validate auth tokens
 - [ ] No secrets/API keys in frontend code
 
 ---
 
 ## 📚 Further Reading
 
 | Topic | Document |
 |-------|----------|
 | System Architecture | [architecture.md](technical/architecture.md) |
 | Database Schema | [database-schema.md](technical/database-schema.md) |
 | API Reference | [edge-functions.md](technical/edge-functions.md) |
 | Auth Details | [authentication.md](technical/authentication.md) |
 | Payments | [payment-integration.md](technical/payment-integration.md) |
 | Maintenance | [MAINTENANCE.md](MAINTENANCE.md) |
 
 ---
 
 ## 💡 Tips
 
 1. **Use Lovable Chat** - Make changes by describing what you need
 2. **Check Console** - Browser DevTools for frontend errors
 3. **Check Logs** - Edge Function logs in Lovable Cloud view
 4. **Follow Patterns** - Copy existing similar components as templates
 5. **Update Docs** - See [MAINTENANCE.md](MAINTENANCE.md) checklist
 
 ---
 
 ## 🆘 Getting Help
 
 - Review existing code patterns in similar features
 - Check technical documentation in `/docs/technical/`
 - Look at user manuals in `/docs/user-manuals/` for expected behavior
 
 ---
 
 *Welcome aboard! Happy coding! 🎉*