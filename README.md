# Dcupl Nuxt Starter

## Intro
This project is an Angular starter template integrating [dcupl](https://docs.dcupl.com) for client-side data filtering. It uses data and models from the **"Product Catalog"** console project. You can start by exploring the provided data and models and even create your own console project based on the Starter Catalog to update data and models as needed.

## Loading Your Own Data
To load data from the dcupl CDN, open the `dcupl.instance.ts` file. You’ll find the **projectId** and **apiKey** fields there, which are used to configure and authenticate the data load process. Update these fields with your own project's **projectId** and **apiKey** once you've set up a new console project.

* [dcupl Console](https://console.dcupl.com)
* [dcupl Docs](https://docs.dcupl.com)
* [dcupl.com](https://dcupl.com)

# Nuxt Readme Part

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
