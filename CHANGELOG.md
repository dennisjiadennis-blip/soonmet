# Changelog

## [a0006] - 2025-01-23

### Fixed (Locked)
- **Host Twin Persona "Digital Avatar"**:
  - **Soft Opening**: Replaced direct greetings with "Sharing Life Fragments" (e.g., "Saki is currently developing photos...").
  - **Daily Vibe Injection**: Added `dailyVibe` field to Host data, randomly injected into the opening to create a sense of "real-time" presence.
  - **Interaction Depth Logic**: Introduced `interactionDepth` variable. The system now refuses to sell (pop up schedule) until the conversation depth reaches 3 rounds or the user shows explicit intent ("Invisible Conversion").
  - **Tone Alignment**: Adjusted the AI's tone to be more Japanese-style (indirect, empathetic, "Ma" 间).

### Changed
- **Data Model**: Expanded `Host` interface in `data.ts` to include `dailyVibe` array.
- **Agent Logic**: Modified `AgentChat.tsx` to track conversation turns and delay the "Sales Pitch".

## [a005] - 2025-01-23

### Fixed (Locked)
- **AgentChat System**:
  - Implemented Dual Mode Architecture: "Matchmaker" (Global Search) <-> "Host Twin" (Personalized Deep Talk).
  - **Big Number UI**: Restored the iconic "Active Locals Matched" countdown animation in Matchmaker mode.
  - **Deep Talk Injection**: Host specific "Obsessions" and "Expectations" are now injected into the context window upon mode switch.
  - **Transaction Loop**: Integrated Schedule Picker and Payment Card directly into the chat flow.
  - **Mock API**: Connected `fetchTopHosts`, `getHostAvailability`, and `processTransaction` to the frontend.

### Added
- **Visuals**:
  - "Connecting..." system message with `Zap` icon animation.
  - Dynamic header changing colors based on mode (Purple for Matchmaker, Indigo for Twin).
  - Host Recommendation Cards with horizontal scroll snap.

### Status
- **Stable**: Core interaction loop from Landing -> Search -> Chat -> Book is functional.
