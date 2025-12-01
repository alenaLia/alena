# OpenSeat

A real-time crowd monitoring web application for the Stevens library floors.

## Project Overview

OpenSeat provides live crowd level information for each floor of the library. The website features:
- Real-time floor occupancy cards with visual indicators
- Trend visualization chart
- Crowd level submission form
- Very cool dark mode toggle
- Even cooler dynamic header that shrinks on scroll
- Fully responsive design

## Project Structure

```
OpenSeat/
├── index.html              # Main page with floor cards and chart
├── pages/
│   ├── about.html         # About page with team info
│   └── submit.html        # Crowd level submission form
├── styles/
│   └── main.css           # All styling (~900 lines)
├── scripts/
│   ├── main.js            # Core functionality and data loading
│   ├── charts.js          # Canvas-based trend visualization
│   └── submit.js          # Form handling
├── data/
│   └── mock.json          # Mock crowd data (17 entries)
└── assets/
    └── all of our images + an unused QR code that can be printed           
```

## Code Explanation

### HTML Structure

**index.html** - The main page consists of:
- **Header**: Logo, navigation links, and theme toggle button
- **Hero Section**: Page banner with title and tagline
- **Floor Cards Section**: Container that displays crowd level cards dynamically loaded from `mock.json`
- **Charts Section**: Canvas element for the trend visualization
- **Footer**: Completely real copyright and team information

**pages/about.html** - Contains team information and project mission

**pages/submit.html** - Simple form with floor selector, busyness slider (1-5), and notes textarea

### CSS Architecture (`styles/main.css`)

The styling is organized into logical sections:

1. **CSS Variables**: Color definitions for light and dark modes
   - Primary purple: `#6366f1`
   - Background colors that adapt to theme
   - Text colors for different contexts

2. **Base Styles**: Typography, body background, smooth scrolling

3. **Header Styles**:
   - Fixed positioning with backdrop blur
   - `.header--scrolled` class reduces padding when scrolling
   - Tagline fades out and collapses via opacity and max-height transitions
   - Bottom corners rounded (8px) for visual softness

4. **Hero Sections**:
   - Purple gradient backgrounds with white text
   - Rounded corners (16px) on all sides
   - Merged rules for `.hero`, `.submit-hero`, and `.about-hero`

5. **Floor Cards**:
   - Grid layout (responsive: 1→2→3 columns)
   - White cards with shadows and hover effects
   - Color-coded crowd indicators (green/yellow/orange/red)

6. **Chart Container**:
   - Light gray background with 8px rounded corners
   - Padding and border for visual separation
   - Adapts background color in dark mode

7. **Footer**:
   - Dark background with top border
   - Only top corners rounded (16px) to avoid edge artifacts
   - Centered copyright text

8. **Dark Mode**:
   - `.dark-mode` class toggled on `<body>`
   - Overrides backgrounds, text colors, borders throughout
   - Smooth transitions for theme changes

9. **Responsive Design**:
   - Mobile-first approach with min-width media queries
   - Breakpoints at 640px (tablet) and 1024px (desktop)
   - Navigation switches from mobile to desktop layout
   - Floor cards adjust from 1 to 3 columns

### JavaScript Modules

#### **scripts/main.js** (~120 lines)

Core functionality for the homepage:

1. **Theme Toggle System**:
   ```javascript
   initThemeToggle()
   ```
   - Reads theme from `localStorage`
   - Toggles `.dark-mode` class on body
   - Updates button icon (moon/sun)
   - Persists preference across sessions

2. **Dynamic Header on Scroll**:
   ```javascript
   window.addEventListener('scroll', () => {...})
   ```
   - Detects when scroll position exceeds 50px
   - Adds `.header--scrolled` class to shrink padding
   - Hides tagline smoothly with CSS transitions

3. **Data Loading System**:
   ```javascript
   async function loadData()
   ```
   - Fetches `data/mock.json` asynchronously
   - Groups entries by floor ("1st Floor", "2nd Floor", etc.)
   - Calculates average busyness score per floor
   - Returns structured data: `{floors: [{name, score, description, reportCount}]}`

4. **Floor Card Generation**:
   ```javascript
   function createFloorCard(floor)
   ```
   - Creates DOM elements for each floor
   - Uses `getCrowdText(score)` to determine description and emoji
   - Applies appropriate CSS class for color coding
   - Inserts cards into `.floor-grid` container

5. **Crowd Level Logic**:
   ```javascript
   function getCrowdText(score)
   ```
   - Takes 1-5 busyness score
   - Returns emoji and text:
     - 1: 🟢 Very Quiet
     - 2: 🟢 Quiet
     - 3: 🟡 Moderate
     - 4: 🟠 Busy
     - 5: 🔴 Very Crowded

#### **scripts/charts.js** (~130 lines)

Canvas-based line chart visualization:

1. **Chart Initialization**:
   - Waits for DOM load
   - Fetches `data/mock.json`
   - Calls `drawChart(canvas, data)` on success
   - Hides status text when chart loads

2. **Drawing System**:
   ```javascript
   function drawChart(canvas, data)
   ```
   - **Canvas Setup**: 900x360px, white background with 8px rounded corners
   - **Clipping Region**: Uses `ctx.clip()` to keep all drawing within rounded bounds
   - **Grid Lines**: Horizontal lines for each busyness level (1-5), vertical lines for each time entry
   - **Axes**: Dark gray X and Y axes with labels
   - **Y-axis Label**: "Busyness Level (1-5)" rotated 90° on the left (at x=15)
   - **X-axis Title**: "Sunday, November 30 (8 AM - 8 PM)" centered at bottom
   - **Line Graph**: Purple line (`#4f46e5`) connecting data points with semi-transparent fill below
   - **Data Points**: Red circles with white centers at each data point
   - **Point Labels**: Busyness value above each point, formatted time below
   - **Spacing**: 60px padding on top/left/bottom, 30px on right to reduce empty space

3. **Coordinate System**:
   - X-axis: Distributes points evenly across `(w - pad - rightPad)`
   - Y-axis: Maps busyness (1-5) to vertical position inversely (5 at top)
   - Uses direct math calculations (no helper functions for simplicity)

#### **scripts/submit.js** (~54 lines)

Form interaction handling:

1. **Label Updates**:
   ```javascript
   function updateLabel()
   ```
   - Updates slider label text dynamically as user drags
   - Shows current busyness level (1-5)

2. **Report Submission**:
   ```javascript
   function addReport(report)
   ```
   - Creates list item with floor, busyness, and timestamp
   - Prepends to submission history
   - Limits display to 5 most recent reports

3. **Form Handlers**:
   - **Submit**: Validates, creates report object, adds to list, shows confirmation
   - **Reset**: Clears form and submission history

### Data Structure (`data/mock.json`)

Contains 17 sample crowd reports with:
```json
{
  "floor": "1st Floor" | "2nd Floor" | "3rd Floor",
  "timestamp": "ISO 8601 datetime string",
  "busyness": 1-5 (integer)
}
```

Distribution:
- Floor 1: 4 entries, average busyness ~2
- Floor 2: 6 entries, average busyness ~3
- Floor 3: 7 entries, average busyness ~4

## Design System

### Color Palette

**Primary Colors**:
- Purple: `#6366f1` (buttons, links, chart line)
- Red: `#ef4444` (data point markers, very crowded indicator)
- Orange: `#f97316` (busy indicator)
- Yellow: `#eab308` (moderate indicator)
- Green: `#22c55e` (quiet indicator)

**Backgrounds**:
- Light mode: White (`#ffffff`), light gray (`#f8f9fa`)
- Dark mode: Very dark gray (`#121212`), dark gray (`#1a1a1a`)

**Text**:
- Light mode: Dark gray (`#1f2937`)
- Dark mode: Light gray (`#e5e7eb`)

### Typography

- **Font Family**: Inter, system-ui, sans-serif (fallbacks for reliability)
- **Headings**: Bold, larger sizes (32px for h1, 24px for h2)
- **Body**: 16px base size, 1.6 line height for readability
- **Labels**: 14px, slightly lighter weight

### Layout Principles

1. **Container System**: Max-width 1200px, centered with auto margins, 24px horizontal padding
2. **Spacing Scale**: Consistent 16px, 24px, 32px gaps throughout
3. **Grid Layouts**: Floor cards use CSS Grid with auto-fill for responsiveness
4. **Flexbox**: Navigation and footer use flex for alignment
5. **Border Radius**: 8px for small elements, 16px for sections, creates cohesive rounded aesthetic

### Interactive Elements

1. **Transitions**: 0.3s duration on hover states, theme changes, header shrinking
2. **Hover Effects**: Subtle scale (1.05), shadow increases, color changes
3. **Focus States**: Visible outlines for accessibility
4. **Smooth Scrolling**: Native `scroll-behavior: smooth` for anchor navigation

### Accessibility Features

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`)
- ARIA labels on interactive elements
- Sufficient color contrast ratios (WCAG compliant)
- Keyboard navigation support
- Focus indicators on all interactive elements
- Canvas has `aria-hidden="true"` with descriptive parent role

## How It All Works Together

1. **Page Load**:
   - HTML loads and displays static structure
   - CSS applies initial styling based on default/saved theme
   - JavaScript initializes theme toggle and checks localStorage
   - `main.js` fetches `mock.json` and generates floor cards
   - `charts.js` fetches `mock.json` and draws the trend visualization

2. **User Interactions**:
   - **Scrolling**: Header shrinks at 50px threshold, tagline fades out
   - **Theme Toggle**: Toggles `.dark-mode` class, updates all themed elements
   - **Navigation**: Links navigate to About and Submit pages
   - **Chart**: Static visualization (updates would require page refresh)
   - **Submit Form**: Collects input, displays in local history (no backend persistence)

3. **Responsive Adaptation**:
   - Mobile: Single column layout, hamburger-ready navigation
   - Tablet (640px+): Two-column floor cards, expanded navigation
   - Desktop (1024px+): Three-column floor cards, full-width chart

4. **Data Flow**:
   - `mock.json` → `fetch()` → parse JSON → group by floor → calculate averages → generate DOM elements
   - Same data used for both floor cards (aggregated) and chart (individual points)

## Working Rules

1. Never push directly to `main`
2. Create a branch: `git checkout -b yourname-feature`, where yourname is your name and feature is the part of the project you are working on
3. Push: `git push origin yourname-feature`
4. Open a Pull Request → wait for approval
5. After merge, pull the new main: `git pull origin main`

## Credits to The Beautiful Team

- Anthony Kanev
- Riyan Mehta
- Alena Liakhava
- Josh Grzyb