# Implementation Plan: Layout & Asset Alignment with Paper Design

This plan outlines the specific coding steps to replace Lucide React icons with our custom Cyberpunk SVGs, adjust the Titlebar and Editor Toolbar, and modify the Editor Footer style to match the Paper mockup exactly.

---

### Task 1: Update Titlebar Icons and App Branding
**Files**:
- `src/renderer/src/components/layout/Titlebar.tsx`
- `src/renderer/src/assets/titlebar.css`

**Steps**:
1. **Import custom SVGs**:
   - `import minimizeIcon from '../../assets/icons/minimize-icon.svg'`
   - `import maximizeIcon from '../../assets/icons/maxmize-icon.svg'`
   - `import reduceIcon from '../../assets/icons/reduce-icon.svg'`
   - `import closeIcon from '../../assets/icons/close-icon.svg'`
   - `import brandIcon from '../../assets/images/vault-notes.png'`
2. **Refactor JSX**:
   - Render `brandIcon` in the titlebar logo.
   - Render `minimizeIcon` for the minimize button.
   - Render `maximizeIcon`/`reduceIcon` dynamically depending on window maximization state.
   - Render `closeIcon` for the close button.
3. **Style update**:
   - Adjust CSS to handle SVGs inside buttons correctly.

---

### Task 2: Refactor Editor Toolbar layout and icons
**Files**:
- `src/renderer/src/components/editor/EditorToolbar.tsx`
- `src/renderer/src/assets/editor.css`

**Steps**:
1. **Import custom SVGs**:
   - `import sidebarEnableIcon from '../../assets/icons/sidebar-anable-icon.svg'`
   - `import sidebarDisableIcon from '../../assets/icons/sidebar-disable-icon.svg'`
   - `import trashIcon from '../../assets/icons/trash-icon.svg'`
   - `import newNoteIcon from '../../assets/icons/new-note-icon.svg'`
   - `import checklistIcon from '../../assets/icons/checklist-icon.svg'`
   - `import highlighterIcon from '../../assets/icons/highlighter-icon.svg'`
   - `import boldIcon from '../../assets/icons/bold-icon.svg'`
   - `import italicIcon from '../../assets/icons/italic-icon.svg'`
   - `import underscoreIcon from '../../assets/icons/underscore-icon.svg'`
   - `import alignLeftIcon from '../../assets/icons/align-left-icon.svg'`
   - `import alignCenterIcon from '../../assets/icons/align-center-icon.svg'`
   - `import alignRightIcon from '../../assets/icons/align-right-icon.svg'`
2. **Re-align Groups and Icons**:
   - **Group 1**:
     - Sidebar Toggle (uses `sidebarDisableIcon` when sidebar is open, `sidebarEnableIcon` when closed).
     - Delete Note (uses `trashIcon`).
     - Duplicate Note (keeps feature; uses a styled copy icon matching the SVGs).
     - New Note (uses `newNoteIcon`).
     - *Remove "Export to .txt" button.*
   - **Group 2**:
     - Checklist button (uses `checklistIcon`).
     - Font dropdown (`Aa`).
     - Font Color dropdown (uses `highlighterIcon` instead of Lucide Palette).
   - **Group 3**:
     - Bold (uses `boldIcon`).
     - Italic (uses `italicIcon`).
     - Underline (uses `underscoreIcon`).
   - **Group 4**:
     - Align Left (uses `alignLeftIcon`).
     - Align Center (uses `alignCenterIcon`).
     - Align Right (uses `alignRightIcon`).
     - *Remove Align Justify button.*
3. **Styles**:
   - Ensure the SVG colors are set correctly via CSS or styling rules (using `#FF007F` for active/hover accenting).

---

### Task 3: Adjust Editor Footer
**Files**:
- `src/renderer/src/components/editor/EditorFooter.tsx`
- `src/renderer/src/assets/editor.css`

**Steps**:
1. **Reformat Statistics Text**:
   - Change content to: `PALAVRAS: {wordCount}  •  CARACTERES: {charCount}`
2. **Remove Save Status**:
   - Delete the `.editor-save-status` container and classes.
3. **Format Badge**:
   - Keep the `note-format-badge` on the right side.
4. **Style Alignment**:
   - Style stats text to use `#FF007F` color, size 12px, Inter font, bold weight.
   - Set footer border-top and padding to align layout.

---

### Task 4: Verification and Clean Compile
**Steps**:
1. Run `npm run typecheck` to verify no TypeScript compilation issues are introduced.
2. Run `npm run lint` to fix/verify coding style constraints.
3. Run `npm run dev` to test the visual layout alignment and functionalities locally.
