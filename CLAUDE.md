# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Selvadentro Dashboard IA** - A React-based AI-powered dashboard for managing GoHighLevel CRM data with Claude AI integration for Selvadentro Tulum real estate development. Built with React 18, TypeScript, Vite, Supabase for authentication, and deployed on EasyPanel/Docker.

**Tech Stack**: React 18 + TypeScript + Vite + Supabase + GoHighLevel MCP + Claude AI + PWA

## Development Commands

### Local Development
```bash
# Start dev server (with HMR on port 5173)
npm run dev

# Type check without emitting files
npm run typecheck

# Lint the codebase
npm run lint

# Build for production
npm run build

# Preview production build locally
npm preview
```

### Build Notes
- Build outputs to `dist/` directory
- Environment variables prefixed with `VITE_` are embedded at build time
- Build time: ~6-7 seconds with Vite

## Environment Variables

Required variables (all prefixed with `VITE_`):
```bash
VITE_SUPABASE_URL=            # Supabase project URL
VITE_SUPABASE_ANON_KEY=       # Supabase anon/public key
VITE_GHL_API_KEY=             # GoHighLevel API key (JWT)
VITE_GHL_ACCESS_TOKEN=        # GoHighLevel access token
VITE_GHL_LOCATION_ID=         # GoHighLevel location ID
VITE_ANTHROPIC_API_KEY=       # Anthropic Claude API key (for direct calls, optional)
```

**Important**: The Anthropic API key in environment is optional since AI calls are proxied through Supabase Edge Function `ai-chat` to avoid exposing keys client-side.

## Architecture

### High-Level Structure

```
Frontend (React SPA)
├── Presentation Layer (src/components/)
│   ├── Dashboard routing & navigation
│   ├── 26 feature components
│   └── Views: Executive, Pipeline, Contacts, Chat, Automations, Reports
│
├── Service Layer (src/lib/)
│   ├── metrics-service.ts      # Metrics with 5-min caching
│   ├── contact-service.ts      # Contact 360° & scoring
│   ├── automation-service.ts   # Hot lead detection & follow-ups
│   ├── reports-service.ts      # Report generation & scheduling
│   └── conversation-context.ts # AI conversation memory (20 messages)
│
└── Integration Layer (src/lib/)
    ├── supabase.ts             # Auth & session management
    ├── ghl-mcp.ts              # GoHighLevel MCP API client
    └── ai-service.ts           # Claude AI proxy
```

### Key Integration Points

**1. GoHighLevel MCP Integration** (`src/lib/ghl-mcp.ts`)
- Endpoint: `https://services.leadconnectorhq.com/mcp/`
- Authentication: Bearer token + API Key + locationId header
- Role-based filtering: Brokers see only their assigned contacts/opportunities
- Available tools: 21 MCP tools for contacts, opportunities, tasks, notes, etc.

**2. Supabase Integration** (`src/lib/supabase.ts`)
- Authentication only (no database tables used)
- User type extends with: `role: 'admin' | 'broker'`, `location_id`, `user_id` (GHL user ID)
- Session management with auto-refresh

**3. Claude AI Integration** (`src/lib/ai-service.ts`)
- **Primary**: Proxied through Supabase Edge Function at `supabase/functions/ai-chat/index.ts`
- Model: `claude-3-5-sonnet-20241022`
- Max tokens: 8096
- Context integration: Last 20 messages stored in `conversation-context.ts`

**4. PWA Support**
- Service Worker: `public/service-worker.js`
- Manifest: `public/manifest.json`
- Cache strategy: Network-first for navigation, Cache-first for assets
- Offline indicator: `src/components/OfflineIndicator.tsx`

## Important Implementation Details

### State Management
- No Redux/MobX - uses React hooks only
- Component local state for UI
- Service-layer in-memory caching (Map-based, 5-min TTL for metrics)
- Props drilling limited to 2-3 levels max

### Caching Strategy
```typescript
// metrics-service.ts - 5 minute cache
const CACHE_DURATION = 5 * 60 * 1000;

// conversation-context.ts - Last 20 messages only
const MAX_MESSAGES = 20;
```

### Role-Based Data Filtering
Admin users see all data; broker users see only their assigned data:
```typescript
// Applied in ghl-mcp.ts
if (userRole === 'broker' && userId) {
  input.assignedTo = userId; // Filter by GHL user_id
}
```

### Hot Lead Detection Algorithm
5-factor scoring system in `automation-service.ts`:
1. VIP tags (40 points)
2. Recent activity (25 points)
3. Active opportunities (20 points)
4. Contact quality - email/phone (10 points)
5. High-value source (5 points)

Leads with score >= 60 are flagged as "hot".

### Deal Score Predictor
Multi-factor algorithm in `contact-service.ts`:
- Historical win rate (30%)
- Recent activity (25%)
- Deal value normalized (20%)
- Pipeline stage weight (15%)
- Time in pipeline (10%)

## Deployment

### Docker Build (EasyPanel/Production)
```bash
# Multi-stage Dockerfile with nginx
docker build \
  --build-arg VITE_SUPABASE_URL="..." \
  --build-arg VITE_SUPABASE_ANON_KEY="..." \
  --build-arg VITE_GHL_API_KEY="..." \
  --build-arg VITE_GHL_ACCESS_TOKEN="..." \
  --build-arg VITE_GHL_LOCATION_ID="..." \
  --build-arg VITE_ANTHROPIC_API_KEY="..." \
  -t selvadentro-dashboard .
```

Build args are REQUIRED because Vite embeds environment variables at build time.

### Supabase Edge Function
Deploy the AI proxy function:
```bash
cd supabase/functions/ai-chat
supabase functions deploy ai-chat --no-verify-jwt
```

Set the secret:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

## Common Patterns & Conventions

### Component Structure
```typescript
// Functional components with TypeScript
interface ComponentProps {
  user: User;
  // ... props
}

export default function Component({ user }: ComponentProps) {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    async function loadData() {
      const result = await serviceFunction(user);
      setData(result);
    }
    loadData();
  }, [user]);

  return <div>...</div>;
}
```

### Service Functions
```typescript
// Always handle errors gracefully
export async function fetchData(user: User): Promise<DataType[]> {
  try {
    const response = await callMCPTool('tool_name', {
      locationId: user.location_id
    }, user.role, user.user_id);

    if (!response || !response.success) {
      return []; // Return empty array on error
    }

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}
```

### MCP API Calls
```typescript
// Use the callMCPTool helper
const response = await callMCPTool(
  'contacts_get-contacts',
  {
    locationId: user.location_id,
    limit: 100
  },
  user.role,
  user.user_id // For broker filtering
);
```

## Troubleshooting

### Build Issues
- **TypeScript errors**: Run `npm run typecheck` before build
- **Missing environment variables**: Build will succeed but app won't work - verify all `VITE_*` vars are set

### Runtime Issues
- **406 errors from GHL**: Check that all three auth headers are sent (Bearer token, X-API-Key, locationId)
- **Empty data arrays**: Check role-based filtering - brokers need valid `user_id` from Supabase auth
- **AI not responding**: Verify Supabase Edge Function is deployed and ANTHROPIC_API_KEY secret is set
- **Metrics not updating**: Clear cache with `clearMetricsCache(userId)` or wait 5 minutes

### Service Worker Issues
- **Not registering**: Must be served over HTTPS (except localhost)
- **Old cache**: Unregister old SW via DevTools → Application → Service Workers → Unregister

## File Structure

```
src/
├── components/          # 26 React components
│   ├── Dashboard.tsx           # Main container with view routing
│   ├── Sidebar.tsx             # Navigation with 8 menu items
│   ├── ExecutiveDashboard.tsx  # KPIs & metrics
│   ├── PipelineView.tsx        # Kanban-style pipeline
│   ├── ContactsView.tsx        # Contact search & list
│   ├── ContactDetailView.tsx   # 360° contact view
│   ├── ChatInterface.tsx       # AI chat with context
│   ├── AutomationsView.tsx     # Hot leads, follow-ups, auto-assign
│   ├── ReportsView.tsx         # Report generation & scheduling
│   └── OfflineIndicator.tsx    # PWA offline detection
│
├── lib/                # 9 service files
│   ├── supabase.ts
│   ├── ghl-mcp.ts
│   ├── ai-service.ts
│   ├── ai-processor.ts
│   ├── metrics-service.ts
│   ├── contact-service.ts
│   ├── automation-service.ts
│   ├── reports-service.ts
│   └── conversation-context.ts
│
├── App.tsx             # Root with auth logic
├── main.tsx            # Entry point with React 18
└── index.css           # Global styles + Tailwind

public/
├── service-worker.js   # PWA offline support
├── manifest.json       # PWA manifest
└── selva.jpg          # Logo/icon

supabase/functions/
└── ai-chat/
    └── index.ts        # Claude AI proxy (Deno)
```

## Domain Knowledge

**Selvadentro Tulum** - Real estate development context embedded in `ghl-mcp.ts`:
- Eco-friendly residential development in Tulum, Mexico
- Features: 9 natural cenotes, jungle integration, wellness areas
- Price range: 300K-2M MXN
- Investment: 18% annual ROI, 12% appreciation, 8-12% rental yield

This context can be used by AI to provide intelligent responses about the property.

## Testing

### Manual Testing Checklist
- Login/logout flow
- Dashboard metrics loading
- Pipeline view with role filtering
- Contact search and detail view
- AI chat with context memory
- Hot lead detection
- Report generation
- PWA install prompt
- Offline functionality

### Browser Compatibility
- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ❌ IE 11 (not supported)

## Performance Notes

- Vite HMR is fast (~100ms updates)
- Build time: 6-7 seconds
- Bundle size: ~428 KB JS (gzipped: ~116 KB)
- Lighthouse scores: 92+ performance, 100 PWA
- Metrics cached for 5 minutes to reduce API calls
