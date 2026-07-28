# Vault Notes Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build the complete desktop application VAULT NOTES (Electron + React + TypeScript + TipTap) featuring multi-vault folder switching, .md and .txt reading/writing, rich text formatting, and Cyberpunk Dark Neon aesthetics matching Paper UI.

**Architecture:** Electron Main process manages Node `fs` & `chokidar` file watching with `electron-store` for vault paths. Preload exposes safe IPC channels. Renderer uses React + TipTap editor for rich text formatting and Markdown conversion, styled according to Paper design tokens (`#060714`, `#FF007F`, `#00E5FF`).

**Tech Stack:** Electron 31, Vite 5, React 18, TypeScript 5, TipTap (StarterKit, TextStyle, Color, FontFamily, Underline, TextAlign, TaskList), Lucide React, Electron Store, Chokidar.

---

### Task 1: Install Required Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Run npm install for TipTap, icons, chokidar and electron-store**

Run:
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-font-family @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-task-list @tiptap/extension-task-item lucide-react chokidar electron-store
```

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install tiptap, lucide-react, chokidar, electron-store dependencies"
```

---

### Task 2: Main Process IPC Handlers & Vault Management

**Files:**
- Create: `src/main/vaultManager.ts`
- Modify: `src/main/index.ts`

**Step 1: Create vaultManager.ts with fs and dialog logic**

Implement vault operations:
- `selectVaultFolder()`: `dialog.showOpenDialog` with `openDirectory`
- `listVaultNotes(vaultPath)`: Read `.md` and `.txt` files with stats and preview
- `readNote(notePath)`: `fs.promises.readFile`
- `saveNote(notePath, content)`: `fs.promises.writeFile`
- `createNote(vaultPath, title, extension)`: Create new note file
- `deleteNote(notePath)`: `shell.trashItem` or `fs.promises.unlink`
- `exportTxt(notePath, content)`: Export dialog for `.txt`

**Step 2: Register IPC handlers in src/main/index.ts**

Connect `ipcMain.handle` calls for all `vault:*` channels.

**Step 3: Commit**

```bash
git add src/main/vaultManager.ts src/main/index.ts
git commit -m "feat(main): add vault IPC handlers and file system manager"
```

---

### Task 3: Preload API Bridge & Types Definition

**Files:**
- Create: `src/preload/index.d.ts`
- Modify: `src/preload/index.ts`
- Create: `src/renderer/src/types/vault.ts`

**Step 1: Define TypeScript interfaces in src/renderer/src/types/vault.ts**

Define `NoteMetadata`, `VaultConfig`, `IPCResult`.

**Step 2: Expose api via contextBridge in src/preload/index.ts**

Expose `window.electron.ipcRenderer` / `window.api.vault`.

**Step 3: Commit**

```bash
git add src/preload/index.ts src/preload/index.d.ts src/renderer/src/types/vault.ts
git commit -m "feat(preload): expose safe vault IPC API bridge to renderer"
```

---

### Task 4: Cyberpunk Dark Neon CSS Theme & Fonts

**Files:**
- Modify: `src/renderer/src/assets/main.css` (or create `theme.css`)
- Modify: `src/renderer/src/index.html` (Google Fonts: Inter & JetBrains Mono)

**Step 1: Set up CSS Variables and Base Dark Theme**

Implement colors from Paper design:
```css
:root {
  --bg-app: #060714;
  --bg-panel: #070919;
  --bg-control: #090c20;
  --border-color: #141c3b;
  --pink-neon: #ff007f;
  --cyan-neon: #00e5ff;
  --text-muted: #6b7a99;
  --separator: #1e295d;
}
```

**Step 2: Add Google Fonts in index.html**

Import `Inter` and `JetBrains Mono` / `Outfit` font families.

**Step 3: Commit**

```bash
git add src/renderer/src/assets/ src/renderer/index.html
git commit -m "style: configure neon cyberpunk theme tokens and fonts"
```

---

### Task 5: Custom Titlebar Component

**Files:**
- Create: `src/renderer/src/components/layout/Titlebar.tsx`
- Modify: `src/main/index.ts` (frameless window setup)

**Step 1: Build Titlebar with custom window controls**

Display SVG Vault Notes logo with `#00E5FF` ("VAULT") & `#FF007F` ("NOTES") title, and window minimize, maximize, close buttons.

**Step 2: Commit**

```bash
git add src/renderer/src/components/layout/Titlebar.tsx src/main/index.ts
git commit -m "feat(ui): add custom frameless window titlebar"
```

---

### Task 6: Sidebar, Note List & Bottom Left Vault Selector

**Files:**
- Create: `src/renderer/src/components/sidebar/Sidebar.tsx`
- Create: `src/renderer/src/components/sidebar/SearchBar.tsx`
- Create: `src/renderer/src/components/sidebar/NoteCard.tsx`
- Create: `src/renderer/src/components/sidebar/VaultSelector.tsx`

**Step 1: Build SearchBar & NoteCard components**

Implement neon active border `#FF007F`, glowing shadow, date/time formatting, and favorite star toggle.

**Step 2: Build VaultSelector for Bottom-Left Sidebar**

Position at bottom-left showing active Vault folder name, icon, and button to switch/add Vaults.

**Step 3: Commit**

```bash
git add src/renderer/src/components/sidebar/
git commit -m "feat(ui): implement sidebar with search, note cards and bottom-left vault selector"
```

---

### Task 7: TipTap Editor & Custom Formatting Toolbar

**Files:**
- Create: `src/renderer/src/components/editor/TipTapEditor.tsx`
- Create: `src/renderer/src/components/editor/EditorToolbar.tsx`

**Step 1: Implement EditorToolbar with all Paper formatting buttons**

Buttons:
- Toggle Sidebar
- Delete Note
- Duplicate / Export Txt
- Create Note
- Task List / Checkbox
- Font Family dropdown (`Aa`)
- Color Picker (`Pen/Dropper`)
- Bold, Italic, Underline
- Text Align (Left, Center, Right, Justify)

**Step 2: Implement TipTap Editor instance**

Integrate StarterKit, Color, TextStyle, FontFamily, Underline, TextAlign, TaskList extensions.

**Step 3: Commit**

```bash
git add src/renderer/src/components/editor/
git commit -m "feat(editor): implement TipTap rich text editor with full toolbar formatting"
```

---

### Task 8: Status Bar & Onboarding Modal

**Files:**
- Create: `src/renderer/src/components/editor/EditorFooter.tsx`
- Create: `src/renderer/src/components/modals/OnboardingModal.tsx`

**Step 1: Implement EditorFooter**

Live calculation of word count (`PALAVRAS: X`), character count (`CARACTERES: Y`), and save status badge.

**Step 2: Implement OnboardingModal**

Prompt user to select default Vault folder if no Vault is configured yet.

**Step 3: Commit**

```bash
git add src/renderer/src/components/editor/EditorFooter.tsx src/renderer/src/components/modals/OnboardingModal.tsx
git commit -m "feat(ui): add editor status bar and onboarding vault selection modal"
```

---

### Task 9: Application State Integration (React Hooks & App.tsx)

**Files:**
- Create: `src/renderer/src/hooks/useVault.ts`
- Create: `src/renderer/src/hooks/useNotes.ts`
- Modify: `src/renderer/src/App.tsx`

**Step 1: Implement useVault and useNotes hooks**

Manage state for active vault, list of notes, active note, autosave with debounce, search filter, and favorite notes.

**Step 2: Assemble App.tsx**

Render Titlebar, Sidebar, EditorPanel, and OnboardingModal.

**Step 3: Commit**

```bash
git add src/renderer/src/hooks/ src/renderer/src/App.tsx
git commit -m "feat(app): connect hooks, state management, and assemble application layout"
```

---

### Task 10: Verification & Build Validation

**Files:**
- Verify: Entire codebase

**Step 1: Run TypeScript typecheck**

Run: `npm run typecheck`
Expected: 0 errors.

**Step 2: Verify local dev build**

Run: `npm run dev`

**Step 3: Commit**

```bash
git add .
git commit -m "chore: complete vault notes desktop app implementation"
```
