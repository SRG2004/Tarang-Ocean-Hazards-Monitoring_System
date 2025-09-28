# Exact UI Implementation Plan - Tarang Ocean Hazards Monitoring System

## Overview
Implementing the exact UI from provided Figma screenshots. All pages, components, layouts, colors, and interactions will match the design precisely. Using React, Tailwind CSS, shadcn/ui, Lucide icons.

## Steps to Complete

### 1. **Update Global Styles** [ ]
   - File: `src/styles/globals.css`
   - Add CSS variables for colors: `--primary: #2563eb; --secondary: #f1f5f9; --success: #10b981; --danger: #ef4444; --background: #f8fafc;`
   - Set base font: Inter via @import.
   - Define base card styles: `.card { @apply rounded-xl shadow-sm border border-gray-200 bg-white; }`
   - Add gradient background for role selection: `--gradient-background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);`

### 2. **Update Navbar Component** [ ]
   - File: `src/components/Navbar.jsx`
   - Create role-aware navbar: Logo "Tarang" left, dynamic menu items based on role (Citizen: Home/Report/Alerts/Profile; Official/Analyst: Issue/Verify/Generate Report/Notification/Social/Profile).
   - Add profile dropdown with avatar, name, logout.
   - Use AppContext for role/user state.
   - Style: Fixed top bar, blue background, white text, hover effects.

### 3. **Update Login Page** [ ]
   - File: `src/pages/LoginPage.jsx`
   - Centered form: Email/Password inputs with labels.
   - "Demo Accounts" section with 3 buttons (Citizen/Official/Analyst) that auto-login and redirect.
   - Bottom links: "Forgot Password?" and "Sign Up".
   - Style: White card on light blue gradient background, primary blue button.

### 4. **Refine Role Selection Page** [ ]
   - File: `src/pages/RoleSelectionPage.jsx`
   - Header: Waves icon + "Tarang" title, subtitle "Ocean Hazards Monitoring System — INCOIS".
   - Three cards: Citizen (blue), Official (green), Analyst (purple) with icons, titles, descriptions.
   - No quick actions row; simple click to navigate to login/:role.
   - Background: Light gradient.

### 5. **Update Citizen Dashboard** [ ]
   - File: `src/components/CitizenDashboard.jsx`
   - Top navbar.
   - Stats row: Cards for Reports (23), Alerts (19), Community (12).
   - Quick actions: "Report Hazard" and "Join Network" buttons.
   - Recent Reports table with columns (Type, Location, Status).
   - Alerts section: High/Medium/Low cards.
   - Community Feed: Cards with updates (e.g., "Beach cleanup on Marina Beach").

### 6. **Update Create Report Form** [ ]
   - File: `src/components/CreateReportForm.jsx`
   - Form fields: Hazard Type dropdown, Location (text + lat/long inputs), Description textarea.
   - Submit button, validation.
   - Integrate with hazardService.js for submission.
   - Style as modal or full page matching screenshot.

### 7. **Update Volunteer Registration Form** [ ]
   - File: `src/components/VolunteerRegistrationForm.jsx`
   - Fields: Name, Email, Phone, Address.
   - Checkbox for terms, submit button.
   - Integrate with volunteerService.js.

### 8. **Update Official Dashboard** [ ]
   - File: `src/components/OfficialDashboard.jsx`
   - Navbar with role-specific items.
   - Verification Center: Stats cards (Pending 47, Verified 23, Active 8, Alerts 15).
   - Control Panel: Buttons (Issue Alert, Verify, Coordinate Response).
   - Pending Reports table.
   - Alerts sidebar with filters (Region, Status, Time Range).

### 9. **Update Analyst Dashboard** [ ]
   - File: `src/components/AnalystDashboard.jsx`
   - Navbar same as official.
   - Social Intelligence section: Stats (Posts 3.2K, High Risk 47, Engagement 7.3%, Active Hashtags 23).
   - Filters: Social Media, Region, Time Range.
   - Trending Topics list with hashtags.

### 10. **Add/Edit Profile Pages** [ ]
   - Files: Create src/components/Profile.jsx (reusable), customize per role.
   - Citizen: Personal info form.
   - Official/Analyst: Personal + Professional details (Organization, Role, Experience).
   - Save button, integrate with auth context.

### 11. **Additional Pages** [ ]
   - Badges page: Achievement cards (First Report, Community Guardian, etc.).
   - Settings page: Notification toggles, privacy options.
   - Routes: Add to src/AppRouter.jsx (/profile/:role, /badges, /settings).

### 12. **Testing & Verification** [ ]
   - Run `npm run dev`.
   - Test critical path: Role select → Login → Dashboard → Form submit → Profile.
   - Thorough: Responsive, all interactions, ARIA labels.
   - Use browser_action to screenshot and compare.

### 13. **Commit & PR** [ ]
   - Create branch `blackboxai/exact-ui-implementation`.
   - Commit all changes.
   - Push and create PR with detailed description.

## Progress Tracking
- Mark [x] when complete.
- Update after each major step.

Current Status: Starting implementation.
