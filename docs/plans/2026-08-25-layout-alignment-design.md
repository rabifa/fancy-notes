# Design Spec: Layout & Asset Alignment with Paper Design

**Date**: 2026-08-25  
**Status**: Planning / Approved  
**Topic**: Aesthetic Alignment  
**Reference Artboard**: `Vault Notes UI` (id: `1-0`)

---

## 1. Context and Problem Statement

The current application layout does not perfectly match the design from Paper. Specifically:
1. **Icons**: The toolbar and window controls use default Lucide icons, whereas the project contains custom Cyberpunk-themed SVGs designed specifically for the application.
2. **App Icon**: The Titlebar brand icon uses a placeholder instead of the custom `vault-notes.png` icon.
3. **Extra Buttons**: The Editor Toolbar contains additional buttons not present in Paper (`Duplicate Note` and `Export to .txt`). The user wants to **keep** the "Duplicate Note" feature but we must align it aesthetically.
4. **Footer Status**: The footer contains an auto-save status indicator (`SALVO`, `MODIFICADO`) which is redundant because the application auto-saves transparently. The user wants this removed while keeping the file type badge (`MD` / `TXT`).
5. **Sidebar note list**: The user wants to keep showing the file extension (`.md`/`.txt`) on each note card in the sidebar.

---

## 2. Proposed Changes

### A. Asset Locations
All custom assets have been successfully copied from the root `assets/` to `src/renderer/src/assets/` to be compiled natively:
- **Icons**: `src/renderer/src/assets/icons/`
- **Images**: `src/renderer/src/assets/images/`

### B. Titlebar Customization
- Replace the Lucide icons in the Titlebar window controls with the custom SVGs:
  - **Minimize**: `minimize-icon.svg`
  - **Maximize**: `maxmize-icon.svg`
  - **Restore/Reduce**: `reduce-icon.svg` (when window is maximized)
  - **Close**: `close-icon.svg`
- Replace the app icon import with `src/renderer/src/assets/images/vault-notes.png`.

### C. Editor Toolbar Customization
- Replace toolbar buttons with custom SVG files:
  - **Sidebar Toggle**: Toggle between `sidebar-disable-icon.svg` (when open) and `sidebar-anable-icon.svg` (when closed)
  - **Delete Note**: `trash-icon.svg`
  - **New Note**: `new-note-icon.svg`
  - **Checklist**: `checklist-icon.svg`
  - **Color Picker**: `highlighter-icon.svg`
  - **Bold**: `bold-icon.svg`
  - **Italic**: `italic-icon.svg`
  - **Underline**: `underscore-icon.svg`
  - **Align Left**: `align-left-icon.svg`
  - **Align Center**: `align-center-icon.svg`
  - **Align Right**: `align-right-icon.svg`
- **Duplicate Note**: Keep this button. Since there is no custom icon in the asset pack, use a clean SVG or styled Lucide icon that matches the neon-accent border style of other buttons.
- **Export to .txt**: Remove this button from the toolbar.
- Gaps and grouping must match Paper:
  - Group 1: Sidebar Toggle, Delete Note, Duplicate Note, New Note
  - Group 2: Checklist, Font Family selector (`Aa`), Color Picker (`highlighter`)
  - Group 3: Bold, Italic, Underline
  - Group 4: Align Left, Align Center, Align Right

### D. Editor Footer Customization
- Remove the Save Status indicator (dot and label `SALVO` / `MODIFICADO`).
- Keep the file format badge (`MD` / `TXT`) on the right side of the footer.
- Change the stats text on the left:
  - **Content**: `PALAVRAS: {wordCount}  •  CARACTERES: {charCount}` (using `•` separator).
  - **Style**: Pink color (`#FF007F`), font-size: `12px`, font-weight: `700`, line-height: `16px`, Inter font family.

### E. Sidebar Note Card
- Keep the note card extension badge visible.

---

## 3. Visual & Styling Specifications
- **Button styling in Toolbar**:
  - Border and icon fill should utilize the Cyberpunk palette (`#FF007F` for active state, `#00E5FF` for hover/accents).
  - Background of action buttons should be `#090C20` with border `#141C3B`.
- **Titlebar buttons**:
  - Transparent background, turning to `#090c20` / `#e81123` on hover.

---

## 4. Verification Plan
1. **Aesthetic Check**: Verify Titlebar and Toolbar visually match the Paper UI design.
2. **Typecheck & Linting**: Run `npm run typecheck` and `npm run lint` to guarantee clean build.
3. **Functionality Check**:
   - Sidebar toggle successfully hides/shows the sidebar and changes icon.
   - Delete, Duplicate, and Create note buttons function correctly.
   - Format controls (Bold, Italic, Underline, Alignments, Color, Font, Checklist) apply formats inside TipTap.
   - Footer correctly displays live word and character count with the bullet separator, styled in pink.
