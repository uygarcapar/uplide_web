# Uplide Admin

E-Commerce Admin Panel — yöneticilerin ürünleri ve müşterileri tek bir panel üzerinden yönetebildiği bir yapı. Dashboard + Product/Customer CRUD + iki kullanıcı rolü (Full Access / Reader).

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript** (strict)
- **Redux Toolkit** + RTK Query (server cache, optimistic invalidation)
- **Tailwind CSS v4** + CSS variables (design tokens)
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **next-intl** (TR/EN — UI + ürün içerikleri)
- **React Hook Form** + **Zod** (form management + validation)
- **Vitest** + React Testing Library
- **pnpm** (supply chain için minimumReleaseAge)
- Deploy: **Vercel**

## Özellikler

- Dashboard: toplam ürün, toplam müşteri, aktif ürün ve düşük stok metrikleri + son eklenen 5 ürün
- Ürünler: listeleme, arama, kategori/durum filtresi, sıralama (isim/fiyat/stok), ekleme, düzenleme, silme
- Müşteriler: listeleme, arama, ekleme, düzenleme, silme
- Sidebar + Header layout, aktif sayfaya göre değişen breadcrumb
- Theme toggle (dark/light) — CSS değişkenleriyle, `localStorage`'da persist
- Multi-language (TR/EN), ürünler iki dilde yönetilebilir
- İki rol: **Full Access** (tüm CRUD) ve **Reader** (sadece görüntüleme)
- Responsive (mobile/tablet/desktop)
- 4 component testi

## Kurulum

### Gereksinimler

- Node.js 22+
- pnpm 11+
- Bir Supabase projesi

### 1. Bağımlılıkları kur

```bash
pnpm install --frozen-lockfile
```

### 2. Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinden yeni bir proje oluştur.
2. Project Settings → API'dan `URL` ve `anon key`'i kopyala.
3. `.env.example`'ı `.env.local` olarak kopyalayıp doldur:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. Supabase Dashboard → **SQL Editor**'da `supabase/migrations/0001_initial_schema.sql` dosyasını çalıştır.
5. Supabase Dashboard → **Authentication → Users**'tan iki kullanıcı oluştur:
   - `admin@uplide.test` — şifre: `admin123`
   - `reader@uplide.test` — şifre: `reader123`
6. `supabase/seed.sql`'i SQL Editor'da çalıştır — admin'i `full_access` rolüne yükseltir, örnek ürün ve müşteri verileri ekler.

### 3. Geliştirme sunucusunu başlat

```bash
pnpm dev
```

Tarayıcıda `http://localhost:3000` adresine git. `/tr` veya `/en` ile başlayan rotalara otomatik yönlendirme yapılır.

## Komutlar

| Komut             | Açıklama                              |
| ----------------- | ------------------------------------- |
| `pnpm dev`        | Geliştirme sunucusu                   |
| `pnpm build`      | Production build                      |
| `pnpm start`      | Production sunucusu                   |
| `pnpm typecheck`  | TypeScript tip kontrolü               |
| `pnpm lint`       | ESLint                                |
| `pnpm test`       | Tüm testleri tek seferde çalıştır     |
| `pnpm test:watch` | Test'leri watch mode'da çalıştır      |

## Testler

```bash
pnpm test
```

Bulunduğu yer: [tests/](tests/)

- `ThemeToggle.test.tsx` — theme toggle + localStorage persist
- `Breadcrumb.test.tsx` — route'a göre breadcrumb segment'leri
- `ProductForm.test.tsx` — Zod validation + submit
- `ConfirmDialog.test.tsx` — açılma/kapanma + confirm/cancel callback'leri

## Mimari Notlar

### Authorization (defense in depth)

Yetkilendirme iki katmanda işliyor:

1. **Client-side**: Redux'taki `auth.user.role` üzerinden CRUD butonları gizlenir/açılır ([src/lib/auth/useRole.ts](src/lib/auth/useRole.ts)).
2. **Server-side**: Supabase **Row Level Security** policies — `reader` role yazma denemesi yaparsa DB seviyesinde reddedilir ([supabase/migrations/0001_initial_schema.sql](supabase/migrations/0001_initial_schema.sql)).

Ek olarak server component'lerde `requireRole("full_access")` guard'ı vardır ([src/lib/auth/server.ts](src/lib/auth/server.ts)).

### Design Tokens + Theme

CSS değişkenleri [src/app/globals.css](src/app/globals.css)'de `:root` ve `[data-theme="dark"]` üzerinden tanımlı. Tailwind v4'ün `@theme inline` syntax'ı ile token'lar `bg-bg`, `text-fg` gibi utility class'larla erişilebilir.

`<html data-theme>` attribute'u FOUC'u önlemek için layout'a inline script ile başlangıçta set edilir, sonra ThemeToggle Redux state'e bağlı olarak günceller.

### i18n

- `[locale]` segment + `next-intl` middleware
- Mesajlar [src/messages/tr.json](src/messages/tr.json) ve [src/messages/en.json](src/messages/en.json)
- Ürün ismi/açıklaması Supabase'de JSONB olarak `{ tr, en }` formatında saklanır

## Supply Chain Önlemleri

`.npmrc`:

- `save-exact=true` — caret'siz, deterministic install
- `minimum-release-age=1209600` (14 gün) — yeni yayınlanan paketler 14 gün geçmeden install edilmez (yeni yayınlanan kötücül paketlere karşı bir kalkan)
- `audit=true` — `pnpm install` sonrası audit raporu

`pnpm-lock.yaml` commit edilmiştir. CI'da:

- `pnpm install --frozen-lockfile` ile tam reproducible install
- `pnpm audit --audit-level=high` ile high/critical vulnerability'ler build'i fail eder

## Deploy (Vercel)

1. GitHub repo'yu Vercel'e bağla
2. Environment Variables'a `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` ekle
3. Deploy

Build komutu: `pnpm build` (Vercel otomatik algılar).

## Demo Hesapları

| Kullanıcı                  | Şifre       | Rol           | Yetkiler                           |
| -------------------------- | ----------- | ------------- | ---------------------------------- |
| `admin@uplide.test`        | `admin123`  | Full Access   | Tüm CRUD işlemleri                 |
| `reader@uplide.test`       | `reader123` | Reader        | Sadece görüntüleme                 |

## Proje Yapısı

```
src/
├── app/[locale]/         # next-intl routed app
│   ├── (auth)/login/
│   └── (panel)/          # Sidebar + Header layout
│       ├── dashboard/
│       ├── products/
│       └── customers/
├── components/
│   ├── ui/               # Button, Input, Card, Table, Modal, ...
│   ├── layout/           # Sidebar, Header, Breadcrumb, ThemeToggle, LocaleSwitcher
│   ├── products/
│   ├── customers/
│   └── ...
├── store/                # Redux Toolkit + RTK Query
│   └── slices/
├── lib/
│   ├── supabase/         # Browser + server + middleware clients
│   ├── auth/             # Role guards
│   └── validations/      # Zod schemas
├── i18n/                 # next-intl routing/config
├── messages/             # tr.json, en.json
└── types/                # Database types
supabase/
├── migrations/
└── seed.sql
tests/                    # Vitest + RTL
```
