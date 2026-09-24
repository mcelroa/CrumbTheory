# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CrumbTheory is a bakery ordering site: an ASP.NET Core (.NET 10) Web API in `CrumbTheoryAPI/` and a Vite + React 19 + TypeScript frontend in `frontend/`. Customers browse items and place pickup orders (paid on collection); a single admin manages items and orders.

## Commands

Backend (run from `CrumbTheoryAPI/`):
- `dotnet run --launch-profile http` — serves on http://localhost:5278 (the port the Vite proxy expects)
- `dotnet build`
- `dotnet ef migrations add <Name>` — add a migration after changing models (migrations are applied automatically on startup)
- `CrumbTheoryAPI.http` has sample requests for every endpoint, including login and authorized calls

Required user secrets before the API will start/login will work:
- `dotnet user-secrets set "Jwt:Key" "<at least 32 chars>"` — startup throws without it
- `dotnet user-secrets set "Admin:Username" "..."` and `"Admin:Password" "..."`

Frontend (run from `frontend/`):
- `npm run dev` — http://localhost:5173
- `npm run build` — type-checks (`tsc -b`) then builds
- `npm run lint`

There are no automated tests yet.

## Architecture

- **Frontend ↔ API:** the frontend calls relative `/api/...` URLs through the axios instance in `frontend/src/utils/api.ts`; Vite's dev proxy forwards `/api` to `localhost:5278`. The API also has a CORS policy for `localhost:5173`. Note `axios` is installed in the repo-root `package.json`, not `frontend/package.json`.
- **Database:** SQLite via EF Core (`CrumbTheory.db`, connection string in `appsettings.json`). `Program.cs` runs `MigrateAsync()` and `DbSeeder.SeedAsync()` on every startup; the seeder only inserts sample items when the table is empty.
- **Models vs DTOs:** entities live in `Models/` alongside their DTOs (`BakeryItemDTO`, `OrderDTOs`, `AuthDTOs`). Controllers never return entities directly — they map with private `ItemToDTO`/`OrderToDTO` helpers.
- **Auth:** single admin, no user table. `AuthController` checks credentials against config (`Admin:Username`/`Admin:Password`) and issues an 8-hour JWT. Admin-only endpoints use `[Authorize]`; public ones are item reads and `POST /api/orders`.
- **Orders:** `OrdersController.PostOrder` validates pickup date (tomorrow or later) and item availability, merges duplicate lines, and prices everything from the DB — never trust client prices. `OrderItem` snapshots `ItemName` and `UnitPrice` so later item edits don't change past orders.
- **Enums/dates:** `Order.Status` is stored as a string and serialized as a string (`JsonStringEnumConverter`). `CreatedAt` is re-marked UTC on read because SQLite drops `DateTimeKind`.
