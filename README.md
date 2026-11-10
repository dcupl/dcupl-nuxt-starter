# Dcupl Nuxt Starter

![Start - 21](https://github.com/user-attachments/assets/1a89b6bb-4eb3-411b-bda3-0267d4da6ef7)


## Intro
This project is a Nuxt starter template integrating [dcupl](https://docs.dcupl.com) for data filtering on the server and in the browser. It uses data and models from the **"Product Catalog"** console project. You can start by exploring the provided data and models and even create your own console project based on the Starter Catalog to update data and models as needed.

**Stack:** Nuxt 4 (`app/` directory layout), [`@dcupl/nuxt`](https://github.com/dcupl/dcupl-nuxt) 0.1 with the dcupl SDK 2.1 (`@dcupl/core`, `@dcupl/common`), Tailwind CSS 4 via `@tailwindcss/vite`. Requires Node.js 20 or later.

## How it works
- `app/pages/index.vue` lists the articles with filters and paging, `app/pages/articles/[key].vue` shows one article, `server/api/article/[key].ts` returns one article as JSON.
- The first page is rendered on the server with the dcupl instance of the server process, which the API routes share. The module checks the console project for changes at most once a minute and swaps in a new instance in the background.
- After hydration the browser builds its own dcupl instance, and filtering and paging run client-side.

## Loading your own data
1. Create a project in the [dcupl Console](https://console.dcupl.com), for example from the "Product Catalog" starter, and copy its **projectId** and **apiKey**.
2. Put them into `nuxt.config.ts`:

   ```ts
   dcupl: {
     config: {
       projectId: "<YOUR_PROJECT_ID>",
       apiKey: "<YOUR_API_KEY>",
     },
     // optional: GET /api/reload-dcupl?token=<secret> rebuilds the server instance right away
     // reloadHook: { secret: "<YOUR_SECRET>" },
     // optional: time between update checks in ms (default 60000), false disables them
     // updateCheckInterval: 60_000,
   },
   ```

3. The pages expect an `Article` model with `productName`, `category` (both filterable), `price` and a `vendorId` reference, as in the "Product Catalog" project. If your models differ, adapt the `modelKey`, the table columns in `app/pages/index.vue` and the filter attributes.

All module options are described in the [`@dcupl/nuxt` README](https://github.com/dcupl/dcupl-nuxt#readme).

* [dcupl Console](https://console.dcupl.com)
* [dcupl Docs](https://docs.dcupl.com)
* [dcupl.com](https://dcupl.com)

## Setup

```bash
npm install
```

## Development server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

```bash
npm run build     # builds into .output/
npm run preview   # or: PORT=3000 node .output/server/index.mjs
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
