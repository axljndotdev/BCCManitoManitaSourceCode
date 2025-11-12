# Manito-Manita Church Gift Exchange - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles with festive Christmas adaptations. This utility-focused app prioritizes clarity, mobile usability, and ease of navigation for church members of all ages and technical backgrounds.

## Core Design Principles
1. **Mobile-First**: Primary experience optimized for phone screens
2. **Clarity Over Complexity**: Large touch targets, readable text, clear CTAs
3. **Festive Warmth**: Incorporate Christmas elements without overwhelming functionality
4. **Trust & Security**: Visual cues reinforcing PIN safety and admin approval process

---

## Typography

**Font Family**: Google Fonts - "Inter" for UI elements, "Poppins" for headings

**Type Scale**:
- Page Titles: text-3xl font-bold (mobile), text-4xl (desktop)
- Section Headings: text-xl font-semibold
- Body Text: text-base font-normal
- Helper Text/Labels: text-sm font-medium
- PIN Display: text-2xl font-mono font-bold (for emphasis)
- Success Messages: text-lg font-semibold

---

## Layout & Spacing System

**Tailwind Spacing Units**: Use 4, 6, 8, 12, 16 as primary spacing values
- Component padding: p-6 (mobile), p-8 (desktop)
- Section gaps: gap-6 or gap-8
- Form field spacing: space-y-4
- Page margins: px-4 (mobile), px-8 (tablet), max-w-4xl mx-auto (desktop)

**Container Strategy**:
- All pages: max-w-lg mx-auto for forms/dashboards (narrow focus)
- Admin dashboard: max-w-6xl mx-auto (wider for tables)

---

## Component Library

### Navigation/Header
- Sticky header with app logo/title centered
- "Logout" button (top-right, small, text-sm) when authenticated
- Christmas icon (snowflake/star) next to title
- Height: h-16, with drop shadow

### Forms (Registration & Login)
- **Card Container**: Elevated card with rounded-2xl, p-8
- **Input Fields**: 
  - Full-width with rounded-lg borders
  - Height: h-12 for text inputs
  - Textarea for wishlist: h-32
  - Labels above inputs (text-sm font-medium, mb-2)
- **PIN Display** (after registration): 
  - Large centered box with dashed border
  - Background treatment (subtle pattern)
  - "Copy PIN" button below
- **Primary CTA**: Full-width button, h-12, rounded-lg, font-semibold

### Dashboard Cards
- **User Info Card**: 
  - Grid layout showing Name, Codename, Gender, Wishlist
  - Each field: label + value pair with divider lines
- **Draw Button** (when enabled):
  - Extra-large centered button, h-16, rounded-xl
  - Gift icon (🎁) + text
  - Pulsing animation effect
- **Result Card** (after drawing):
  - Festive border treatment
  - Large "Your Manito/Manita is..." heading
  - Codename displayed prominently
  - Wishlist in styled list format (ul with custom bullets)

### Admin Dashboard
- **Tabs/Sections**: 
  - "Pending Approvals" | "Approved Participants" | "Settings"
  - Horizontal tab navigation with underline indicator
- **Participant Table**:
  - Responsive: Cards on mobile, table on desktop
  - Columns: Name, Codename, Gender, Status, Actions
  - Action buttons: Small, icon + text (Approve/Reject)
- **Toggle Switch**: 
  - "Enable Drawing" master control
  - Large switch component with label
  - Status indicator showing current state

### Status Indicators
- Pending: Amber badge with dot
- Approved: Green badge with checkmark
- Drawn: Blue badge with gift icon

### Buttons
- **Primary**: Solid background, white text, rounded-lg
- **Secondary**: Outline style, transparent background
- **Danger** (reject): Subtle treatment
- All buttons: h-10 minimum, px-6, font-medium

---

## Festive Elements (Visual Treatment)

- **Decorative Icons**: Snowflakes, stars, gift boxes as subtle page accents (corners, headers)
- **Success States**: Confetti or sparkle animations (very brief, 1-2s)
- **Borders**: Use snowflake or dot patterns for special cards (PIN display, result reveal)
- **Background Texture**: Subtle pattern overlay (very light, almost invisible)

---

## Images

**No large hero images needed** - This is a utility app focused on functionality.

**Icon Usage**: 
- Heroicons for UI elements (user, gift, check, x-mark, logout)
- Christmas-themed icons for decorative accents (snowflake, star, tree)

---

## Page-Specific Layouts

### Registration Page
- Centered card (max-w-md)
- Vertical form with space-y-4
- Festive header with icon
- Success modal/overlay showing PIN after submission

### Login Page
- Minimal centered design
- Single PIN input field (large, centered)
- "Don't have a PIN? Register" link below
- Christmas decoration in background corners

### Participant Dashboard
- Stacked card layout
- Profile card → Draw button/Result card → Wishlist reminder
- Spacing: space-y-6

### Admin Dashboard
- Full-width layout (max-w-6xl)
- Stats row at top (total registered, approved, drawn)
- Tabbed interface for different views
- Table/grid showing all participants

---

## Responsive Breakpoints
- Mobile: base (320px+)
- Tablet: md (768px+) 
- Desktop: lg (1024px+)

**Key Adaptations**:
- Forms remain narrow on all screens
- Admin table converts to cards on mobile
- Touch targets minimum 44x44px on mobile

---

## Accessibility
- Focus states: Visible ring with offset on all interactive elements
- ARIA labels for icons and status indicators
- High contrast text throughout
- Minimum font-size: 14px (text-sm)