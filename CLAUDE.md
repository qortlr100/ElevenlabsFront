# CLAUDE.md - AI Assistant Guide for ElevenlabsFront

## Project Overview

**Project Name**: ElevenlabsFront
**Type**: Frontend Application
**Status**: Initial Setup Phase
**Last Updated**: 2025-12-10

This is a frontend application for ElevenLabs. The repository is currently in its initial setup phase.

## Repository Structure

```
ElevenlabsFront/
├── .git/              # Git version control
├── README.md          # Project documentation
└── CLAUDE.md          # This file - AI assistant guide
```

### Expected Future Structure

As this project develops, expect the following structure:

```
ElevenlabsFront/
├── src/               # Source code
│   ├── components/    # React/UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── services/      # API services and integrations
│   ├── types/         # TypeScript type definitions
│   ├── styles/        # Global styles and themes
│   └── assets/        # Static assets (images, fonts, etc.)
├── public/            # Public static files
├── tests/             # Test files
├── .gitignore         # Git ignore rules
├── package.json       # Node.js dependencies
├── tsconfig.json      # TypeScript configuration
└── [build config]     # Vite/Webpack/Next.js config
```

## Technology Stack

### Anticipated Stack (To Be Confirmed)

Based on the project name and modern frontend best practices:

- **Framework**: React.js / Next.js / Vue.js (TBD)
- **Language**: TypeScript (recommended)
- **Build Tool**: Vite / Webpack / Next.js (TBD)
- **Package Manager**: npm / yarn / pnpm (TBD)
- **Styling**: CSS Modules / Tailwind CSS / styled-components (TBD)
- **State Management**: React Context / Redux / Zustand (TBD)
- **Testing**: Jest / Vitest + React Testing Library (recommended)

## Development Workflow

### Initial Setup

When setting up the project for the first time:

1. **Choose a Framework**: Decide on React, Next.js, or another framework
2. **Initialize Package Manager**: Run `npm init` or equivalent
3. **Install Core Dependencies**: Add framework and essential libraries
4. **Setup TypeScript**: Configure `tsconfig.json` for type safety
5. **Configure Linting**: Setup ESLint and Prettier for code quality
6. **Setup Testing**: Configure Jest/Vitest for unit testing
7. **Add Git Hooks**: Use husky for pre-commit checks

### Standard Development Commands

Once the project is initialized, typical commands will be:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Git Workflow

- **Main Branch**: `main` - production-ready code
- **Development Branch**: `develop` - integration branch
- **Feature Branches**: `feature/[feature-name]` - new features
- **Bug Fix Branches**: `bugfix/[bug-name]` - bug fixes
- **Claude Branches**: `claude/[session-id]` - AI assistant work

**Commit Message Convention**:
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add user login component
```

## Coding Conventions

### General Principles

1. **Type Safety**: Always use TypeScript with strict mode enabled
2. **Component Structure**: Use functional components with hooks
3. **File Naming**:
   - Components: PascalCase (e.g., `UserProfile.tsx`)
   - Utilities: camelCase (e.g., `formatDate.ts`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
4. **Import Order**:
   - External libraries
   - Internal modules
   - Relative imports
   - Styles

### Code Style

```typescript
// Component Example
import React, { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';
import styles from './ComponentName.module.css';

interface ComponentNameProps {
  title: string;
  onAction?: () => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction
}) => {
  const [data, setData] = useState<DataType | null>(null);

  useEffect(() => {
    // Effect logic
  }, []);

  return (
    <div className={styles.container}>
      <h1>{title}</h1>
    </div>
  );
};
```

### Best Practices

1. **Props**: Always define TypeScript interfaces for component props
2. **State**: Use appropriate hooks (useState, useReducer) based on complexity
3. **Side Effects**: Manage with useEffect and cleanup properly
4. **Error Handling**: Always handle errors gracefully with try-catch or error boundaries
5. **Accessibility**: Follow WCAG 2.1 guidelines, use semantic HTML
6. **Performance**: Memoize expensive computations, lazy load components
7. **Security**: Sanitize user input, avoid XSS vulnerabilities

## API Integration

### ElevenLabs API

This frontend likely integrates with ElevenLabs' text-to-speech API:

- **Base URL**: `https://api.elevenlabs.io/v1`
- **Authentication**: API key via headers
- **Key Endpoints**:
  - `/text-to-speech` - Convert text to speech
  - `/voices` - Get available voices
  - `/user` - User information

### Service Layer Pattern

```typescript
// services/elevenlabs.ts
class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  async textToSpeech(text: string, voiceId: string): Promise<Blob> {
    // Implementation
  }
}
```

## Testing Guidelines

### Test Structure

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleAction = jest.fn();
    render(<ComponentName title="Test" onAction={handleAction} />);
    // Test interaction
  });
});
```

### Coverage Goals

- **Minimum Coverage**: 80% for critical paths
- **Unit Tests**: All utility functions and hooks
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical business processes

## AI Assistant Guidelines

### When Working on This Project

1. **Always Check Before Creating**: Read existing files before making changes
2. **Follow TypeScript**: Use strict typing, avoid `any` types
3. **Component Patterns**: Use functional components with hooks
4. **File Organization**: Place files in appropriate directories
5. **Import Paths**: Use path aliases (e.g., `@/components`) if configured
6. **Error Handling**: Always implement proper error boundaries and try-catch
7. **Accessibility**: Ensure WCAG compliance in all UI components
8. **Security**:
   - Never expose API keys in frontend code
   - Sanitize all user inputs
   - Validate data from external sources
   - Use environment variables for configuration

### Common Tasks

#### Adding a New Component

1. Create component file in `src/components/[ComponentName]/`
2. Define TypeScript interface for props
3. Implement functional component with hooks
4. Add styles (CSS Module or styled-component)
5. Create test file `[ComponentName].test.tsx`
6. Export from index file if using barrel exports

#### Adding a New Page

1. Create page component in `src/pages/`
2. Setup routing configuration
3. Add page-level data fetching
4. Implement SEO metadata
5. Add to navigation if needed

#### Integrating an API

1. Create service class in `src/services/`
2. Define TypeScript interfaces for responses
3. Implement error handling
4. Add loading states
5. Create custom hook for component usage

#### Fixing a Bug

1. Reproduce the issue
2. Write a failing test that captures the bug
3. Implement the fix
4. Verify the test passes
5. Check for related issues

### Performance Considerations

1. **Code Splitting**: Use dynamic imports for large components
2. **Image Optimization**: Use Next.js Image or similar optimization
3. **Bundle Size**: Monitor and minimize third-party dependencies
4. **Lazy Loading**: Load components and data on demand
5. **Memoization**: Use React.memo, useMemo, useCallback appropriately

### Security Checklist

- [ ] API keys stored in environment variables
- [ ] User input sanitized before rendering
- [ ] XSS protection in place
- [ ] CSRF tokens for mutations
- [ ] Secure HTTP headers configured
- [ ] Dependencies regularly updated
- [ ] No sensitive data in localStorage without encryption

## Environment Variables

Store sensitive configuration in `.env` files (never commit these):

```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.elevenlabs.io/v1
```

Access in code:
```typescript
const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
```

## Deployment

### Production Checklist

- [ ] Build completes without errors
- [ ] All tests pass
- [ ] Linting passes with no errors
- [ ] Bundle size is optimized
- [ ] Environment variables configured
- [ ] Error tracking setup (e.g., Sentry)
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] SEO metadata complete

### Deployment Platforms

Recommended platforms for frontend deployment:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Cloudflare Pages**

## Troubleshooting

### Common Issues

1. **Build Failures**: Check TypeScript errors, missing dependencies
2. **API Errors**: Verify API keys, check CORS configuration
3. **Performance Issues**: Profile with React DevTools, check bundle size
4. **Style Issues**: Verify CSS module imports, check specificity

## Resources

### Documentation Links

- [ElevenLabs API Documentation](https://docs.elevenlabs.io/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Project-Specific Notes

This section will be updated as the project develops with:
- Architecture decisions and rationale
- Known issues and workarounds
- Performance optimization notes
- Team conventions and preferences

## Update History

- **2025-12-10**: Initial CLAUDE.md creation for empty repository
- Future updates should be logged here with date and description

---

**Note for AI Assistants**: This file should be updated as the project evolves. When significant changes are made to the codebase structure, technology stack, or conventions, update this file accordingly to maintain accuracy.
