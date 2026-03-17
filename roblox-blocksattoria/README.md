# Blocksattoria (Roblox Multiplayer)

This package builds your Roblox game idea:
- **The moon wakes up** and moves toward Earth.
- **Saturn, Jupiter, and Uranus are taken away** before the end.
- **Multiplayer round loop** (lobby -> round -> intermission).
- **Roblox avatars** (players keep their normal Roblox R15 avatar look).
- Easy update points through one config file.

## Files

- `ReplicatedStorage/BlocksattoriaConfig.lua`
  - Main update file (timers, moon speed, schedule, planet sizes/positions).
- `ServerScriptService/BlocksattoriaServer.lua`
  - Creates world, handles round logic, moon movement, collisions, and planet removals.
- `ServerScriptService/BlocksattoriaAvatarServer.lua`
  - Forces Roblox-style player avatars.
- `StarterPlayerScripts/BlocksattoriaClient.lua`
  - HUD for phase, countdown, and status messages.

## How To Install In Roblox Studio

1. Open **Roblox Studio** and create/open a Place.
2. In **Explorer**:
   - Create/confirm `ReplicatedStorage`
   - Create/confirm `ServerScriptService`
   - Create/confirm `StarterPlayer > StarterPlayerScripts`
3. Create a **ModuleScript** in `ReplicatedStorage` named `BlocksattoriaConfig`.
   - Copy/paste from `ReplicatedStorage/BlocksattoriaConfig.lua`.
4. Create a **Script** in `ServerScriptService` named `BlocksattoriaServer`.
   - Copy/paste from `ServerScriptService/BlocksattoriaServer.lua`.
5. Create a **Script** in `ServerScriptService` named `BlocksattoriaAvatarServer`.
   - Copy/paste from `ServerScriptService/BlocksattoriaAvatarServer.lua`.
6. Create a **LocalScript** in `StarterPlayerScripts` named `BlocksattoriaClient`.
   - Copy/paste from `StarterPlayerScripts/BlocksattoriaClient.lua`.
7. Press **Play** in Studio to test multiplayer logic.
8. Publish: **File -> Publish to Roblox**.

## Quick Updates You Can Make Later

Open `BlocksattoriaConfig` and edit:
- `LobbyDuration`, `RoundDuration`, `IntermissionDuration`
- `MoonAwakeAt`, `MoonSpeed`, `MoonHitDistance`
- `PlanetRemovalSchedule`
- Planet sizes/positions/colors

## Notes

- Your moon event and planet removals are server-authoritative, so they work in multiplayer.
- If you send your reference video next, the next update can match your exact scene timing and camera style.
