# GridLock — Challenge Your X Followers on U2U Solaris

 <!-- IMAGE: Hero / Banner -->
 <!-- Add a catchy product image or GIF showcasing a challenge flow -->

 GridLock is a social wagering platform where creators challenge their X (Twitter) followers, and the community stakes on outcomes. It’s powered by smart contracts on the U2U Solaris mainnet and built as a modern Turborepo monorepo.

 - **Challenge your followers** with custom prompts and deadlines.
 - **Stake on outcomes** and let the market decide confidence.
 - **Trustless settlement** via on-chain contracts on U2U Solaris.

 > Note: This repository contains multiple apps (web, socket-server, http-server) and shared packages (prisma, ui, types, etc.).

 ---

 ## Table of Contents
 - **[Overview](#overview)**
 - **[Features](#features)**
 - **[How It Works](#how-it-works)**
 - **[Architecture](#architecture)**
 - **[Monorepo Structure](#monorepo-structure)**
 - **[Tech Stack](#tech-stack)**
 - **[Prerequisites](#prerequisites)**
 - **[Setup](#setup)**
 - **[Development](#development)**
 - **[Build](#build)**
 - **[Database & Migrations](#database--migrations)**
 - **[Contracts & Network](#contracts--network)**

 ## Overview
 GridLock lets creators spin up on-chain challenges that their X followers can participate in. Others can stake on whether a creator will complete the challenge. Results are announced and settled trustlessly.

 <!-- IMAGE: Overview Diagram -->
 <!-- Add a high-level overview image illustrating creator -> challenge -> staking -> result flow -->

 ## Features
 - **Creator challenges** with on-chain lifecycle.
 - **Community staking** on outcomes with clear odds and payouts.
 - **Real-time updates** via sockets for challenge status and staking activity.
 - **U2U Solaris mainnet** for low-cost, fast settlement.
 - **Modular monorepo** with shared packages and consistent tooling.

 ## How It Works
 1. **Create Challenge:** A creator defines the challenge, stake window, and resolution criteria (usually an on-chain or admin result announcement).
 2. **Share on X:** The challenge page provides a shareable link or prefilled post to drive participation.
 3. **Stake:** Followers and community members stake on the Yes/No (or multi-outcome) result.
 4. **Resolve & Settle:** Once the result is announced, the smart contract settles, distributing rewards to winning stakers.

 ## Architecture
 Monorepo with three primary apps and shared packages.

 <!-- IMAGE: Architecture Diagram -->
 <!-- Add a diagram showing web (Next.js) ⇄ socket-server ⇄ http-server ⇄ DB ⇄ U2U chain -->

 ## Monorepo Structure
 - `apps/web`: Next.js frontend, wallet/wagmi setup, contract interactions.
 - `apps/socket-server`: Realtime updates (e.g., Socket.IO) for challenge events and staking activity.
 - `apps/http-server`: HTTP/REST APIs (e.g., Express) for business logic and off-chain orchestration.
 - `packages/prisma`: Prisma schema, migrations, and DB client.
 - `packages/ui`: Shared UI components.
 - `packages/types`: Shared TypeScript types.
 - `packages/eslint-config`, `packages/typescript-config`: Shared tooling.

 ## Tech Stack
 - **Framework:** Next.js, Node.js, TypeScript
 - **Monorepo:** Turborepo, pnpm
 - **Realtime:** Socket server (e.g., Socket.IO)
 - **DB:** Prisma ORM (+ your SQL database)
 - **Web3:** wagmi/viem (client), custom contracts on U2U Solaris
 - **Tooling:** ESLint, Prettier, TypeScript configs

 ## Prerequisites
 - **Node.js >= 18**
 - **pnpm** (repo uses `pnpm-workspace.yaml`)
 - Access to a **U2U Solaris mainnet RPC URL**
 - A SQL database connection string for Prisma (e.g., PostgreSQL)

 ## Setup
 1. Install dependencies:
    ```bash
    pnpm install
    ```
 2. Create environment files per app.

 ### apps/web `.env`
 ```bash
 # Public web config
 NEXT_PUBLIC_CHAIN_ID= # e.g., U2U Solaris chain ID
 NEXT_PUBLIC_RPC_URL=  # e.g., https://rpc.solaris.u2u.xyz (example; replace with the actual)
 NEXT_PUBLIC_CONTRACT_ADDRESS= # Deployed challenge/staking contract
 NEXT_PUBLIC_EXPLORER_URL=     # U2U explorer base URL

 # Optional X (Twitter) integration
 NEXT_PUBLIC_X_SHARE_URL=https://twitter.com/intent/tweet
 ```

relevant web helpers:
 - `apps/web/utils/wagmiProvider.tsx`
 - `apps/web/utils/contractInfo.ts`

### apps/socket-server `.env`
 ```bash
 # Server config
 PORT=4001

 # Chain
 RPC_URL=
CHAIN_ID=
CONTRACT_ADDRESS=

 # If signing or posting txs server-side
 PRIVATE_KEY= # NEVER commit this
 ```

relevant server files:
 - `apps/socket-server/src/index.ts`
 - `apps/socket-server/src/contractFn.ts`
 - `apps/socket-server/src/utils/contractInfo.ts`

### apps/http-server `.env`
 ```bash
 PORT=4000
 DATABASE_URL= # Prisma connection string

 # Chain (if needed)
 RPC_URL=
CHAIN_ID=
CONTRACT_ADDRESS=
```

relevant controllers:
 - `apps/http-server/src/controllers/resultAnnounce/info.ts`

### packages/prisma `.env`
 ```bash
 DATABASE_URL=
```

 ## Development
 - **Dev all apps:**
   ```bash
   pnpm dev
   ```
 - **Dev a specific app:**
   ```bash
   pnpm -F web dev
   pnpm -F socket-server dev
   pnpm -F http-server dev
   ```

 ## Build
 - **Build everything:**
   ```bash
   pnpm build
   ```
 - **Build a specific app:**
   ```bash
   pnpm -F web build
   pnpm -F socket-server build
   pnpm -F http-server build
   ```

 ## Database & Migrations
 - Prisma lives in `packages/prisma`.
 - Typical flow:
   ```bash
   # Edit schema.prisma then
   pnpm -F prisma db push      # or: pnpm -F prisma prisma migrate dev
   pnpm -F prisma generate
   ```

Ensure `DATABASE_URL` is set in the appropriate `.env`.

 ## Contracts & Network
 - Chain: **U2U Solaris mainnet**.
 - Configure addresses in:
   - `apps/web/utils/contractInfo.ts`
   - `apps/socket-server/src/utils/contractInfo.ts`
 - Provide the correct:
   - `CHAIN_ID`
   - `RPC_URL`
   - `CONTRACT_ADDRESS`

 > Tip: Add links to the contract on the U2U explorer and keep ABIs synced across apps.