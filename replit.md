# InkAlchemy - Creative Writing Management System

## Overview

InkAlchemy is a comprehensive creative writing management system built as a full-stack web application. It provides writers with tools to organize and manage their creative projects, including character development, world-building, timeline management, and lore documentation. The application is designed to help writers maintain consistency and organization across complex creative works.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API endpoints
- **Development Server**: Custom Vite integration for hot reloading

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Schema Location**: Shared between client and server for type consistency

## Key Components

### Database Schema
The application manages several core entities:
- **Projects**: Main creative writing projects with metadata
- **Characters**: Character profiles with appearance, personality, and backstory
- **Locations**: World locations with geographical and cultural information
- **Timeline Events**: Chronological story events with categorization
- **Magic Systems**: Magical rule systems (referenced but not fully implemented)
- **Lore Entries**: Historical and cultural documentation (referenced but not fully implemented)

### API Endpoints
- `GET/POST /api/projects` - Project management
- `GET/POST/PUT/DELETE /api/projects/:id` - Individual project operations
- Character, location, timeline, magic system, and lore endpoints (partially implemented)

### UI Components
- **Layout Components**: Sidebar navigation, header with search functionality
- **Page Components**: Dashboard, timeline, characters, locations, magic systems, lore
- **Shared Components**: Project cards, stats cards, dialogs, forms
- **UI Kit**: Comprehensive set of reusable components based on Radix UI

## Data Flow

1. **Client Requests**: React components use React Query to fetch data from API endpoints
2. **API Processing**: Express.js routes handle requests and interact with the database
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Handling**: Data is returned to the client and cached by React Query
5. **UI Updates**: Components re-render with updated data automatically

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Build tool and development server
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Command**: `npm run dev` starts both frontend and backend in development mode
- **Port**: Application runs on port 5000 with auto-reload capabilities

### Production Build
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Deployment Target**: Autoscale deployment on Replit
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### Database Configuration
- **Connection**: Uses DATABASE_URL environment variable
- **Migration**: `npm run db:push` applies schema changes
- **Provider**: Neon Database for serverless PostgreSQL

## Changelog

```
Changelog:
- July 3, 2025. Enhanced lore edit page with proper InkAlchemy color scheme and improved usability:
  * Updated all category configurations to use consistent InkAlchemy color variables instead of hardcoded colors
  * Made title input field highly visible with proper background, border, and focus states
  * Improved tag input styling with InkAlchemy colors and better hover effects
  * Enhanced content textarea with proper color scheme and focus transitions
  * All form elements now use consistent --color-* variables for brand consistency
  * Title input now has clear visual distinction making it intuitive to edit
- July 3, 2025. Created missing lore edit page functionality:
  * Added lore-edit.tsx page with full editing capabilities for existing lore entries
  * Implemented proper form initialization with existing lore entry data  
  * Added route registration in App.tsx for /project/:projectId/lore/:loreId/edit
  * Fixed character card display in magic system detail page to use consistent design
  * Updated magic system character cards to remove image dependency and use proper InkAlchemy styling
  * Lore edit page includes title, category, content, and tag editing with category-based tag suggestions
  * All edit buttons in lore listing and detail pages now properly navigate to working edit functionality
- July 3, 2025. Fixed power system persistence issue in character edit mode:
  * Resolved bug where selected power systems would disappear when entering edit mode
  * Simplified power system loading logic to use character.powerSystems as primary source
  * Removed conflicting useEffect hooks that were overwriting power system selections
  * Fixed handleCancel to properly restore original power system selections
  * Power systems now correctly persist and display when editing characters
- July 3, 2025. Fixed character deletion functionality and cache invalidation:
  * Implemented proper delete confirmation dialog using reusable DeleteConfirmationDialog component
  * Fixed character deletion to properly redirect users back to characters list after successful deletion
  * Updated cache invalidation to use correct query keys matching the characters list page
  * Added proper navigation using wouter's setLocation function for SPA behavior
  * Character deletion now works completely - removes character from database and updates UI immediately
  * Fixed power system search functionality in character creation form with proper dropdown behavior
  * Added click-outside handling and improved search filtering for magic/power systems
- July 2, 2025. Integrated SerpentineTimeline component into character detail pages:
  * Replaced placeholder timeline content with fully functional SerpentineTimeline component
  * Character timeline now shows all events where that specific character is mentioned
  * Timeline automatically filters events by character name using filterCharacter prop
  * Maintains consistent visual styling and behavior across all timeline implementations
  * Characters can now view their story timeline directly from their detail pages
  * Enhanced character detail pages with comprehensive timeline visualization
- July 2, 2025. Successfully completed final migration from Replit Agent to standard Replit environment:
  * All migration checklist items completed successfully with full database connectivity
  * Application running cleanly on port 5000 with proper client/server separation and security practices
  * Supabase PostgreSQL database connected and synchronized with all schemas deployed
  * All API endpoints functioning correctly with persistent data storage and proper authentication
  * SerpentineTimeline confirmed as highly reusable component used across timeline, character, and location pages
  * Timeline component features configurable filtering, responsive layout, and consistent InkAlchemy styling
  * Migration completed with enhanced database connectivity and full feature availability
- July 2, 2025. Successfully completed migration from Replit Agent to standard Replit environment:
  * Fixed database schema synchronization issues by adding missing character columns (age, race, weapons)
  * Connected application to user's Supabase PostgreSQL database with permanent schema updates
  * Resolved API 500 errors by ensuring database structure matches application schema
  * All functionality now working with persistent database storage and proper authentication
  * Migration completed with enhanced database connectivity and full feature availability
- July 2, 2025. Enhanced character database schema with age, race, and weapons fields:
  * Added three new fields to characters table: age (text), race (text), weapons (text)
  * Successfully migrated database schema using PostgreSQL-specific configuration 
  * Updated character creation and storage to support new fields for enhanced character development
  * Character records now include comprehensive physical and equipment details
  * All existing character functionality preserved while expanding data model capabilities
- July 2, 2025. Completed migration from Replit Agent to standard Replit environment:
  * Successfully migrated project from Replit Agent environment to standard Replit
  * Connected to Replit-provided PostgreSQL database with full schema deployment
  * Removed Current Location section from character detail pages per user request
  * All functionality working correctly with proper client/server separation and database persistence
  * Migration completed with enhanced database connectivity and streamlined UI
- July 2, 2025. Fixed timeline vertical spacing and cleaned up duplicate components:
  * Fixed excessive vertical spacing in main timeline page serpentine layout
  * Reduced row height from 200px to 80px per row (60% reduction)
  * Reduced minimum vertical spacing from 180px to 60px between rows (67% reduction)  
  * Reduced base Y offset from 100px to 50px (50% reduction)
  * Reduced overall timeline height minimum from 800px to 400px (50% reduction)
  * Timeline arms are now much shorter when wrapping to new rows, eliminating excessive downward positioning
  * Replaced duplicate SerpentineTimeline component with simplified stub since main timeline page handles all functionality
  * Completed migration from Replit Agent to standard Replit environment with full Supabase database connectivity
- July 1, 2025. Added comprehensive double-click prevention to all creation forms:
  * Enhanced location creation form with proper double-click prevention in handleSave function
  * Added button disabled state during submission and loading text feedback ("Creating...")
  * Improved character creation with double-click prevention in handleSave function
  * Enhanced timeline event creation with double-click prevention in handleSubmit function  
  * Added double-click prevention to project creation dialog in onSubmit function
  * All creation forms now prevent duplicate submissions when users accidentally click submit multiple times
  * Added proper error handling and user feedback toasts for failed submissions
  * Forms maintain loading states and disable submit buttons during API calls
- July 1, 2025. Successfully completed migration and fixed location pages to use API instead of hardcoded data:
  * Fixed location pages (locations.tsx and location-detail.tsx) to fetch data from API endpoints instead of hardcoded sample data
  * Connected location listing page to /api/projects/:id/locations endpoint with proper loading states
  * Updated location detail page to fetch individual location data from /api/locations/:id endpoint
  * Removed location 'type' field references since schema doesn't include this field - simplified to show generic "Location" badge
  * Added proper error handling and loading states for both location pages
  * Fixed navigation hook usage and JSX syntax issues during migration
  * Location pages now properly integrated with Supabase database for persistent data storage
  * Migration from Replit Agent to standard Replit environment completed successfully with all functionality preserved
- July 1, 2025. Fixed character pages to use API instead of hardcoded data:
  * Removed hardcoded sample character data from characters.tsx and character-detail.tsx
  * Connected character listing page to fetch characters from /api/projects/:id/characters endpoint
  * Updated character detail page to fetch individual character data from /api/characters/:id endpoint
  * Added proper loading states and error handling for both character pages
  * Fixed character magic systems fetching to use dynamic character ID from URL parameters
  * Implemented real API calls for character updates (PUT /api/characters/:id)
  * Added multi-event bubble scrolling functionality to timeline component with max-h-48 overflow-y-auto
  * Enhanced multi-event popups with scroll indicators and better hover effects
  * Character pages now properly integrated with Supabase database for persistent data storage
- July 1, 2025. Successfully completed migration from Replit Agent to standard Replit environment:
  * Fixed all required packages and dependencies installation 
  * Application running cleanly on port 5000 with proper client/server separation and security practices
  * Successfully connected to Supabase PostgreSQL database for persistent data storage
  * All API endpoints functioning correctly with database persistence and proper authentication
  * Implemented edit project functionality with popup dialog matching new project design
  * Edit project dialog includes all fields (title, genre, status, description) with proper form validation
  * Project cards now open edit dialog instead of navigating to project page when selecting "Edit Project"
  * Migration completed successfully with full database functionality and enhanced user experience
  * Hot reloading and development tools working perfectly for continued development
- June 30, 2025. Successfully completed migration and Supabase database integration:
  * Fixed all required packages and dependencies installation
  * Application running cleanly on port 5000 with proper client/server separation and security practices
  * Successfully integrated Supabase PostgreSQL database for persistent data storage
  * Resolved connection issues by switching from Neon serverless driver to native PostgreSQL driver with SSL configuration
  * Schema successfully pushed to Supabase with all 8 tables created (projects, characters, locations, timeline_events, magic_systems, lore_entries, character_magic_systems, edit_history)
  * All API endpoints functioning correctly with database persistence and proper authentication
  * Hot reloading and development tools working perfectly for continued development
  * Migration completed successfully with full database functionality verified
- June 30, 2025. Successfully completed migration and Supabase database integration:
  * Fixed all required packages and dependencies installation
  * Application running cleanly on port 5000 with proper client/server separation and security practices
  * Successfully integrated Supabase PostgreSQL database for persistent data storage
  * Resolved connection issues by switching from Neon serverless driver to native PostgreSQL driver with SSL configuration
  * Schema successfully pushed to Supabase with all 8 tables created (projects, characters, locations, timeline_events, magic_systems, lore_entries, character_magic_systems, edit_history)
  * All API endpoints functioning correctly with database persistence and proper authentication
  * Hot reloading and development tools working perfectly for continued development
  * Migration completed successfully with full database functionality verified
- June 29, 2025. Successfully completed full migration from Replit Agent to standard Replit environment:
  * Fixed timeline filter layout to use compact fixed-width inputs (w-64) instead of full-width responsive grid
  * Filters now use horizontal layout (sm:flex-row) for better space utilization matching user's design preferences
  * All migration checklist items completed: packages installed, workflow restarted, functionality verified
  * Application running cleanly on port 5000 with proper client/server separation and security practices
  * Database initialized with MemStorage containing sample data for immediate use
  * All API endpoints functioning correctly with proper authentication and data flow
  * Hot reloading and development tools working perfectly for continued development
- June 29, 2025. Successfully completed migration from Replit Agent to standard Replit environment:
  * Verified all required packages (tsx, Node.js 20) are properly installed and functioning
  * Application running successfully on port 5000 with full client/server separation
  * Database initialized with MemStorage containing sample timeline events and characters
  * Removed timeline stats cards (Total Events, High Priority, Character Events) per user request
  * All API endpoints working correctly with proper authentication and data flow
  * Frontend loading properly with timeline, character, location, and project management features
  * Migration completed with proper security practices and Replit compatibility
  * Project ready for continued development in standard Replit environment
- June 29, 2025. Consolidated timeline implementations to eliminate code duplication:
  * Replaced all three timeline implementations (main, character, location) with unified SerpentineTimeline component
  * Created lightweight wrapper functions (CharacterTimelineWrapper, LocationTimelineWrapper) that use shared timeline with proper filtering
  * Eliminated 500+ lines of duplicate timeline code across character-detail.tsx and location-detail.tsx
  * All timelines now share same codebase, styling, and behavior - only differ by filtering (character vs location events)
  * Fixed maintenance nightmare where same bugs had to be fixed in multiple places
  * Timeline color scheme, popup behavior, and event handling now consistent across all three timeline views
- June 29, 2025. Fixed timeline event boxes to use proper InkAlchemy color scheme:
  * Updated serpentine timeline component to use bg-[var(--color-100)] instead of hardcoded white/cream backgrounds
  * Fixed event title boxes, date labels, and multi-event popups to use consistent --color-100 variable
  * Fixed event detail popup background to match InkAlchemy palette
  * All timeline elements now properly follow the 50-950 color scheme throughout the application
  * Timeline boxes now display the warm cream color (#F4F0CD) as intended in the design
- June 29, 2025. Enhanced timeline with rich sample data and completed migration:
  * Added 25 detailed timeline events showcasing the serpentine timeline layout
  * Created connected story events following Elena Brightblade's Chronicles with all main characters
  * Events span from Day 1 to Day 120 with proper importance levels, categories, and character connections
  * Updated location data to match timeline events (Brightblade Manor, Mystic Academy, Temple of Elements, etc.)
  * Timeline events include character arcs, battles, prophecies, discoveries, and world events
  * All three timeline views now display rich interconnected data (main timeline, character timelines, location timelines)
  * Events properly filtered by character and location across all timeline interfaces
  * Sample data demonstrates full serpentine timeline functionality with proper visual layout
- June 29, 2025. Successfully completed migration from Replit Agent to Replit environment:
  * Fixed timeline integration to use proper API endpoints instead of static sample data
  * Connected character detail page timeline to main timeline API for synchronized data
  * Implemented data conversion between database TimelineEvent type and timeline component format
  * Both main timeline and character timelines now fetch from /api/projects/:id/timeline endpoint
  * Timeline events are properly shared between pages - adding events updates both views
  * Fixed TypeScript compatibility issues with nullable database fields
  * Application now runs cleanly on standard Replit environment with proper client/server separation
  * All dependencies properly installed and working
  * Database initialized with MemStorage and sample timeline events
- June 28, 2025. Fixed character timeline color scheme consistency:
  * Updated character timeline tab background to use bg-[var(--worldforge-bg)] matching main timeline page
  * Fixed all stats cards to use bg-[var(--color-100)] and proper InkAlchemy gradients
  * Updated timeline header icon and text colors to match InkAlchemy scheme
  * Changed event popups to use #faf9ec background matching main timeline page exactly
  * Replaced all hardcoded color values with proper InkAlchemy color variables
  * Character timeline now maintains complete visual consistency with main timeline page
- June 28, 2025. Comprehensive color scheme consistency updates:
  * Fixed all orange references to use InkAlchemy color variables instead of hardcoded orange values
  * Updated location type colors to complement InkAlchemy scheme using graduated color variables (--color-300 to --color-900)
  * Replaced all transparent components with appropriate InkAlchemy colors (bg-transparent → bg-[var(--color-50)], etc.)
  * Fixed timeline event label boxes from white to bg-[var(--color-100)] for consistency
  * Updated all modal overlays from bg-black/80 to bg-[var(--color-950)]/80 for brand consistency
  * Changed character cards from white to bg-[var(--color-100)] background
  * Eliminated all focus:bg-white instances in favor of focus:bg-[var(--color-50)]
  * Ensured all UI components use the warm, earthy InkAlchemy palette (--color-50 to --color-950)
  * Application now maintains complete visual consistency with no off-brand colors or transparencies
- June 27, 2025. Rebranded application from WorldForge to InkAlchemy:
  * Updated application name throughout UI components (navbar and sidebar)
  * Changed logo references to use InkAlchemy branding
  * Updated HTML document title to reflect new branding
  * Updated Electron app configuration for desktop builds
  * Cleaned up attached_assets folder removing 74+ unused screenshot files
  * Updated project documentation to reflect new InkAlchemy branding
- June 27, 2025. Fixed character timeline overflow issue and restored functionality:
  * Fixed serpentine timeline responsive layout to stay within container bounds
  * Updated timeline to use dynamic width calculation based on available space
  * Improved event spacing and positioning for better mobile responsiveness
  * Timeline now properly adapts to different screen sizes without overflow
  * Restored timeline tab after temporary removal - user confirmed it was working perfectly
  * Changed timeline layout to 3 bubbles per row instead of 4 for better spacing
  * Fixed hover popup positioning from fixed to absolute so it stays relative to bubbles during scroll
  * Increased vertical and horizontal spacing between timeline events for better visual breathing room
- June 27, 2025. Removed broken character timeline functionality:
  * Removed timeline tab from character detail pages per user request
  * Deleted SerpentineTimeline component usage from character pages
  * Cleaned up timeline-related imports and sample data
  * Fixed broken timeline functionality that was causing errors
- June 27, 2025. Moved all add buttons from navbar to page headers for consistent layout:
  * Relocated Add Event, Add Character, Add Location, Add Lore Entry, and Add Note buttons
  * All buttons now positioned on right side of page titles using justify-between layout
  * Maintained consistent orange styling and functionality across all pages
  * Updated navbar components to remove rightContent props throughout application
  * Applied uniform header layout matching magic systems page design pattern
- June 27, 2025. Standardized all page title icon sizes throughout the application:
  * Fixed main page headers to use consistent w-10 h-10 containers with w-5 h-5 icons
  * Updated timeline, characters, locations, magic systems, lore, and notes pages
  * Standardized title sizing to text-2xl across all main pages
  * Ensured detail pages maintain consistent icon sizing
  * Created uniform visual hierarchy throughout the entire application
- June 27, 2025. Applied consistent styling system to notes pages:
  * Created note detail page with same hierarchy as lore detail page
  * Implemented category-based icons and color schemes (Plot, Characters, World Building, Research)
  * Updated notes listing to use clickable cards with proper navigation
  * Applied unified tag system with consistent styling throughout
  * Added same button positioning and styling (orange edit, red outline delete)
  * Established consistent page hierarchy across all content types
- June 27, 2025. Updated lore detail page to match location detail page styling:
  * Moved category icon from card header to sit next to the page title
  * Repositioned back, edit, and delete buttons to main content area instead of navbar
  * Applied consistent button styling with orange edit button and red outline delete button
  * Enhanced header layout to match location detail page structure
  * Cleaned up page hierarchy by removing duplicate icon and timestamp
  * Repositioned tags below header for better visual flow and removed unnecessary metadata section
- June 27, 2025. Successfully completed migration from Replit agent to Replit environment:
  * Installed required packages (tsx for TypeScript execution)
  * Set up PostgreSQL database and applied schema migrations
  * Updated timeline system terminology from "Character Development" to "Character Arc"
  * Fixed magic systems page icon to match consistent styling (proper orange background container)
  * Switched back to MemStorage to resolve magic systems API 500 errors
  * Added cute bouncy hover animations to all icons throughout the app:
    - Page header icons (timeline, characters, locations, magic systems) with scale, bounce, and rotation effects
    - Stat card icons with bounce, rotation, and scale animations on hover
    - Navigation bar icons with bounce and scale effects
    - Search icon with rotation and scale effects
    - Magic system card icons with bounce animations
    - Location card icons with bounce animations
    - Character role icons with bounce animations
    - Used group hover states for proper animation scoping and duration-300 for smooth transitions
  * Application running successfully on port 5000 with full functionality
  * All migration checklist items completed successfully
- June 26, 2025. Standardized tag system throughout the project:
  * Created comprehensive unified Tag component with consistent styling and color schemes
  * Implemented gradient backgrounds with proper color coding for different entity types
  * Updated timeline, character, location, and magic system pages to use unified tags
  * Added support for character roles (protagonist, antagonist, ally, enemy, supporting, neutral)
  * Enhanced power system tags with magic vs power categorization (violet for magic, cyan for power)
  * Improved event category tags with distinct colors for each type
  * Standardized location and importance level tags across all pages
  * All tags now have consistent hover effects, sizing, and removal functionality
- June 26, 2025. Enhanced timeline and character stats cards with beautiful icons:
  * Added gradient icon backgrounds matching entity types and importance levels
  * Timeline cards: Calendar (blue), Star (red), Users (purple) with smooth hover animations
  * Character cards: Users (blue), Crown (yellow), Sword (red), Shield (green) using existing role icons
  * Improved visual hierarchy and professional styling across both pages
- June 26, 2025. Replaced navigation buttons with comprehensive editing history table:
  * Created EditingHistoryTable component showing all project modifications with timestamps
  * Added color-coded action badges (green for created, blue for updated, red for deleted)
  * Implemented edit history API endpoints and sample data for demonstration
  * Enhanced project overview page with detailed change tracking functionality
- June 26, 2025. Enhanced magic systems with example data and character connections:
  * Added 5 detailed magic systems (Fire, Light, Shadow, Water, Earth Magic) with comprehensive descriptions, rules, limitations, sources, and costs
  * Enhanced character data with detailed descriptions and magic system connections
  * Implemented smart character-magic system mapping that connects characters to magic systems based on names and descriptions
  * Fixed TypeScript errors in storage system for proper magic system creation
  * Removed "Create Character" button from magic system detail pages per user preference
  * Updated magic system cards to use link-style navigation matching location cards instead of buttons
  * Replaced dropdown menu in magic system detail with dedicated Edit and Delete buttons for better UX
  * Edit button uses primary orange styling, Delete button uses warning red styling with outline design
  * Magic system detail pages now show connected characters in the Characters tab
  * Elena Brightflame connects to both Fire Magic and Light Magic systems, Marcus Shadowbane to Shadow Magic, etc.
- June 26, 2025. Updated character power system terminology and icons:
  * Changed "Power System" to "Power Type" throughout character pages for better clarity
  * Implemented category-based icon system matching magic systems page (Sparkles for magic, Zap for powers)
  * Added power system categories (magic vs power) with distinct visual styling
  * Updated PowerSystemSearch components to use consistent color coding (purple for magic, blue for powers)
  * Enhanced character creation and detail pages with proper icon differentiation
  * Expanded power systems list to include both magical systems and superhuman powers
  * Applied consistent styling across character-new and character-detail pages
- June 26, 2025. Fixed double-click navigation issue:
  * Completely simplified navigation context to eliminate JavaScript errors
  * Removed complex history tracking that was causing button conflicts
  * Now using wouter directly with browser's built-in history API for reliable single-click navigation
  * Eliminated "e.set is not a function" error that required double clicks
  * All back buttons and navigation links now work with single clicks as expected
- June 26, 2025. Implemented comprehensive navigation context system:
  * Created NavigationProvider context to track user navigation history throughout the app
  * Added useNavigationTracker hook to automatically store previous page context
  * Updated all back buttons across timeline, character, and location pages to use proper navigation context
  * Replaced hardcoded navigation paths with intelligent back functionality that remembers where users came from
  * Users can now navigate from timeline events to character/location details and return to the correct previous page
  * Improved user experience by preserving navigation context instead of defaulting to parent pages
  * Applied navigation tracking to: timeline event detail/edit/new, character detail/new, location detail/new pages
- June 25, 2025. Updated WorldForge branding and magic systems:
  * Replaced generic BookOpen icons with custom feather logo design
  * Updated sidebar and navbar components with larger logo size (40x40px)
  * Removed old logo files to optimize storage space
  * Created comprehensive Magic Systems page with full CRUD functionality
  * Updated lore icon from Scroll to BookOpen for better semantic match
  * Added Magic tab to project navigation with dedicated route
  * Simplified magic system card design with clean inline format
  * Converted creation/editing from popups to dedicated pages for consistency
  * Added page icon (Sparkles) matching other sections
  * Added character connections tab to magic system detail pages
  * Fixed broken placeholder images by using actual placeholder.png asset
  * Enhanced magic systems with category selection (Magic vs Power) and distinct icons
  * Implemented complete API endpoints for magic systems management
- January 23, 2025. Added character-specific timeline feature:
  * Created reusable SerpentineTimeline component for displaying timeline events
  * Added timeline tab to character detail page showing events where character appears
  * Implemented serpentine timeline layout with proper event filtering
  * Timeline shows character appearances chronologically with event details
  * Added event importance indicators and category icons
- January 23, 2025. Created location detail page and timeline integration:
  * Built comprehensive location detail page with tabbed interface (Details, Geography, Culture, Timeline)
  * Extended SerpentineTimeline component to support location-based filtering
  * Converted locations from popup dialog to full page experience
  * Added location timeline showing events that occur in specific locations
  * Created location creation form with structured input tabs
  * Updated location listing page to link to detail pages instead of dialogs
- January 23, 2025. Enhanced timeline component with full responsive design:
  * Made SerpentineTimeline fully responsive with dynamic width and height calculations
  * Added statistics cards and legend to character and location timelines
  * Fixed container overflow issues with proper dimension management
  * Enhanced character timeline with comprehensive story events for Elena Brightblade
  * Timeline now matches main timeline page functionality across all contexts
- June 24, 2025. Implemented comprehensive Cairo font system:
  * Created custom typography system with semantic font classes
  * Applied Cairo font across all components and pages
  * Added proper font loading with fallbacks and performance optimization
  * Updated all headings, body text, buttons, and UI components
  * Ensured consistent typography hierarchy throughout the application
- June 23, 2025. Initial setup
- June 23, 2025. Implemented unified navbar system:
  * Replaced multiple header/navbar components with single Navbar component
  * Added conditional project navigation (shows only on project pages)
  * Updated all routes to follow /project/:projectId/[page-name] pattern
  * Removed deprecated Header component
  * All pages now use unified navigation with proper props
- January 23, 2025. Successfully migrated to Replit environment:
  * Fixed runtime error in project-layout.tsx with null safety checks
  * Verified all dependencies are properly installed and working
  * Application running correctly on port 5000 with Vite hot reloading
  * Memory storage layer functioning with sample data for testing
  * Fixed background color consistency across all pages (locations, lore, notes now match characters/timeline)
  * Removed redundant search inputs from page headers (search functionality moved to navbar)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```