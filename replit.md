# FinTalk - Financial Advisory Platform

## Overview

FinTalk is a sophisticated financial advisory platform that connects users with SEBI-registered financial advisors through real-time video/voice consultations. The platform features stock market integration, AI-powered insights, and a pay-per-minute consultation model.

## System Architecture

### Frontend Architecture
- **React 18.3.1** with TypeScript for type-safe component development
- **Tailwind CSS** for responsive, utility-first styling
- **Wouter** for lightweight client-side routing
- **TanStack Query** for advanced data fetching and state management
- **Shadcn/UI** components for consistent, accessible UI
- **WebRTC** integration via SimplePeer for real-time video/voice communication

### Backend Architecture
- **Express.js** server with TypeScript
- **PostgreSQL** database with Drizzle ORM for type-safe database operations
- **WebSocket** server for real-time communication features
- **Passport.js** with local strategy for authentication
- **Express sessions** with PostgreSQL store for session management

### Database Design
The database uses Drizzle ORM with PostgreSQL and includes:
- **Users table**: Authentication, profile data, and wallet balance
- **Advisors table**: Advisor profiles, ratings, and SEBI verification
- **Sessions table**: Consultation scheduling and status tracking
- **Transactions table**: Payment and billing records
- **Watchlists/WatchlistItems**: Stock portfolio management
- **UserInterests table**: Interest tracking for advisor applications

## Key Components

### Authentication System
- Local username/password authentication with bcrypt password hashing
- Email verification with token-based confirmation
- Session-based authentication using express-session
- Role-based access control (user/advisor/admin)
- Admin dashboard for advisor verification and user management

### Real-Time Communication
- WebSocket server for live messaging and call signaling
- WebRTC peer-to-peer video/voice calls using SimplePeer library
- Call state management with connection status tracking
- Session-based call billing and duration tracking

### Stock Market Integration
- **Angel One SmartAPI**: Primary Indian stock market data source
- **Alpha Vantage API**: Fallback and international market data
- Hybrid service architecture automatically selects best data source
- Real-time price updates and stock search functionality
- Watchlist management with portfolio tracking

### Payment Processing
- Stripe integration for secure payment processing
- Wallet-based system for consultation payments
- Per-minute billing calculation for advisor sessions
- Transaction history and balance management

## Data Flow

### User Registration & Authentication
1. User submits registration form with email verification
2. System creates user record and sends verification email
3. Email verification activates account
4. Login creates authenticated session with role-based routing (user→dashboard, advisor→advisor/dashboard, admin→admin/dashboard)

### Advisor Consultation Flow
1. User searches and selects advisor from listing
2. Session booking with duration selection and payment calculation
3. Real-time WebSocket connection established
4. WebRTC call initiation with signaling through WebSocket
5. Session completion triggers billing and transaction recording

### Stock Data Integration
1. Frontend requests stock data for symbol
2. Hybrid service determines optimal data source (Angel One vs Alpha Vantage)
3. API calls made with authentication and error handling
4. Data cached and returned with standardized format
5. Real-time updates pushed via WebSocket for watchlist items

## External Dependencies

### Financial Data APIs
- **Angel One SmartAPI**: Indian stock market data with real-time quotes
- **Alpha Vantage**: International markets and fallback data source
- **Perplexity API**: AI-powered stock analysis and recommendations

### Communication Services
- **SendGrid**: Production email delivery service
- **Nodemailer**: Development email testing with Ethereal

### Payment Processing
- **Stripe**: Secure payment processing and wallet management
- **Stripe Elements**: Frontend payment form components

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations

## Deployment Strategy

### Development Environment
- **Vite** development server with hot module replacement
- **tsx** for TypeScript execution during development
- **Ethereal Email** for development email testing
- Local PostgreSQL or Neon database connection

### Production Build
- **Vite** production build with optimized bundling
- **esbuild** for server-side TypeScript compilation
- **Express** static file serving for production
- Environment variable configuration for API keys and database

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `ANGEL_ONE_API_KEY`, `ANGEL_ONE_USERNAME`, `ANGEL_ONE_PASSWORD`, `ANGEL_ONE_TOTP`: Angel One API credentials
- `ALPHA_VANTAGE_API_KEY`: Alpha Vantage API key
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`: Stripe payment keys
- `SENDGRID_API_KEY` or `GMAIL_USER`/`GMAIL_APP_PASSWORD`: Email service credentials

Changelog:
- July 07, 2025. Initial setup
- July 10, 2025. Fixed app startup issues and added missing tags functionality for advisors
- July 10, 2025. Added comprehensive admin dashboard with advisor verification system, user interest management, and admin authentication
- July 10, 2025. Simplified admin interface to focus only on advisor management, removed all extra features for admin users
- July 10, 2025. Modified main dashboard to show empty state for admin users while keeping advisor management accessible via navigation
- July 10, 2025. Updated main dashboard and advisors page to display only verified advisors (kycVerified=true) for regular users
- July 10, 2025. Enhanced admin dashboard with verify/reject advisor actions, detailed statistics showing verified/pending/rejected advisor counts
- July 10, 2025. Fixed verified advisors display system: updated API to use verification_status field, enabled admin users to view verified advisors on main dashboard, cleaned up admin interface by removing wallet/sessions/watchlist features and pilot phase banners
- July 10, 2025. **PRODUCTION LAUNCH PREPARATION**: Cleared all test data, reset database sequences, prepared clean production environment with only admin user, removed seed data for live deployment
- July 10, 2025. **DEPLOYMENT FIX**: Added missing bcrypt package dependency to resolve production deployment issues. Bcrypt is now properly included as a production dependency for password hashing functionality
- July 10, 2025. **PRODUCTION BUILD FIX**: Fixed deployment build configuration to properly include bcrypt and other critical dependencies. Created alternative build scripts that resolve module resolution errors and ensure all production dependencies are available at runtime
- July 11, 2025. **TRACTION WEBSITE SETUP**: Restructured authentication page with left sidebar navigation layout, added "Express Interest" tab for email lead generation, hidden login/register functionality and call-to-action buttons for clean traction website recording
- July 12, 2025. **ADMIN ADVISOR MANAGEMENT**: Fixed admin routes integration, created comprehensive advisor management system with accept/reject functionality for pending advisors, updated advisor display to show actual names instead of user IDs, added admin credentials (username: admin, password: AdminPass2025!). Removed admin dashboard - admins now go directly to advisor management page upon login.
- July 12, 2025. **VIDEO CALL INTERFACE DEMO**: Created comprehensive video call interface demo at /call-demo route. Features interactive dual video feeds, real-time session tracking, cost calculation display, audio/video controls, connection quality indicators, and professional dark theme. Made publicly accessible for demonstration purposes.
- July 12, 2025. **DATABASE PERSISTENCE CONFIRMED**: Confirmed PostgreSQL database is fully operational with persistent data storage. Fixed session booking timestamp validation issues. All advisor applications, user data, and sessions now properly persist in database. System ready for production use with complete data integrity.
- July 12, 2025. **TAB-SPECIFIC AUTHENTICATION SYSTEM**: Implemented complete tab isolation for independent user sessions. Each browser tab now maintains its own authentication state using unique tab IDs and localStorage. Users can login as different roles (client/advisor) in separate tabs simultaneously. Added visual tab indicators showing current user and tab ID. Replaced Agora video calling with direct WebRTC implementation for immediate functionality without API authentication requirements.
- July 12, 2025. **AUTHENTICATION SIMPLIFICATION & VIDEO CALLING FIX**: Removed tab-specific authentication system to return to standard session-based authentication. Fixed Agora video calling connection issues by implementing proper token generation with server-side agora-service.ts, enhanced error handling with detailed logging, improved connection state monitoring, and added credentials validation for authenticated video calls. Video calling now uses official Agora SDK with proper channel-based communication for real peer-to-peer functionality.
- July 12, 2025. **COMPLETE VIDEO CALLING REMOVAL**: Completely removed all video calling functionality from the platform as requested. Removed Agora SDK integration, WebSocket signaling code, all call-related components (AgoraVideoCall, P2PVideoCall, CallButton, CallInterface), use-call-service hook, server-side agora-service, and related dependencies. Cleaned up all imports and references across the codebase. The platform now focuses solely on session booking and advisor management without video calling capabilities.
- July 12, 2025. **VIDEO CALLING RE-IMPLEMENTATION**: Re-implemented comprehensive video calling system using Agora SDK based on user's sample code. Added agora-rtc-sdk-ng and agora-token packages, created VideoCall and CallButton components with proper authentication flow. Integrated call buttons into appointments and advisor sessions pages. Video calling now works with session-based channels where users book appointments that appear in upcoming section with "Start Call" buttons. When user initiates call, advisor receives notification to join the same channel. System includes proper video/audio controls, connection monitoring, duration tracking, and cost calculation.
- July 12, 2025. **VIDEO CALLING OPTIMIZATION**: Fixed video display issues to ensure both participants can see each other properly. Enhanced remote video subscription handling with improved error logging and video track management. Client-side now shows both local and remote video correctly, working on advisor-side remote video display for complete bidirectional video communication.
- July 12, 2025. **VIDEO CALLING COMPLETION**: Successfully completed full bidirectional video calling system. Both client and advisor can now see each other's video feeds properly. Added user-joined event handlers and enhanced connection detection logic. System now correctly displays participant counts (2 participants) and video labels ("Client Video" / "Advisor Video") on both sides. Video calling is fully functional with proper Agora SDK integration, real-time video/audio transmission, and session-based channel management.
- July 12, 2025. **VIDEO CALLING SYSTEM FINALIZED**: All video calling functionality confirmed working perfectly. Enhanced remote video playback with immediate retry logic, added fallback mechanisms for video display failures, and improved debugging. Both participants can successfully see each other's video feeds with proper connection detection and participant tracking. System is production-ready with complete bidirectional video communication.

## User Preferences

Preferred communication style: Simple, everyday language.