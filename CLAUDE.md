# Claude Code Instructions

## Running the Application

This project runs as a systemd service. Use these commands to manage it:

```bash
# Start the service
sudo systemctl start homa-dashboard.service

# Stop the service
sudo systemctl stop homa-dashboard.service

# Restart the service (rebuilds and restarts)
sudo systemctl restart homa-dashboard.service

# Check status
sudo systemctl status homa-dashboard.service

# View logs
sudo journalctl -u homa-dashboard.service -f

# View recent logs
sudo journalctl -u homa-dashboard.service -n 100 --no-pager
```

The service automatically:
1. Runs `npm run build` to compile the Next.js application
2. Runs `npm run start` to serve on port 3000
3. Restarts on failure
4. Starts on system boot

For development, you can also run:
```bash
npm run dev    # Development mode with hot reload
npm run build  # Build for production
npm run start  # Start production server
```

**Related Service**: The backend API runs as `homa-backend.service` on port 8033.

## Project Guidelines

**IMPORTANT**: When working on this Next.js dashboard project, you MUST follow the comprehensive guidelines documented in `docs/guideline.md`.

## Learning and Documentation Policy

**CRITICAL**: This project uses a continuous learning approach. Every interaction should be treated as training for future context:

1. **Document Solutions**: When implementing a specific method or fix that works, immediately document it in the appropriate location:
   - Add to `docs/solutions.md` for bug fixes and problem solutions
   - Update `docs/patterns.md` for new development patterns
   - Enhance `docs/guideline.md` for general best practices

2. **Capture Context**: When the user asks for a change using a specific method:
   - Document the method used
   - Record why it was chosen
   - Note any gotchas or special considerations
   - Include code examples

3. **Build Knowledge Base**: Treat each conversation as training data:
   - Learn from user preferences and corrections
   - Document accepted patterns and rejected approaches
   - Maintain a record of what works in this specific project context

4. **Reference Previous Solutions**: Before implementing something new:
   - Check existing documentation for similar problems
   - Apply previously successful methods when applicable
   - Build upon established patterns in the codebase

## Key Requirements

### 1. Code Structure
- **ALWAYS** split code into small, individual, separate blocks in separate files
- **NEVER** create large single files with all logic inside
- Each file should have a single, clear responsibility
- Follow the component structure defined in the guidelines

### 2. File Organization
When creating new components or features:
- Place components in their own directories under `src/components/`
- Separate types, styles, and logic into different files
- Use the prescribed folder structure for services, hooks, and utilities

### 3. Best Practices to Follow
- Use TypeScript for all new files
- Implement proper error handling
- Follow the service pattern for API integration
- Use React Query or SWR for data fetching
- Implement proper state management with Zustand
- Keep components small and focused
- Separate presentational and container components

### 4. API Integration
- All API calls should go through the service layer
- Never make direct API calls from components
- Use the centralized API client configuration
- Implement proper error handling and loading states

### 5. Testing
- Write tests for new features
- Follow the testing strategy outlined in the guidelines
- Ensure critical paths have test coverage

### 6. Performance
- Implement code splitting for heavy components
- Use memoization where appropriate
- Follow the performance targets specified in the guidelines

### 7. Before Committing
Always run these commands before suggesting code is complete:
```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Project Structure Reference
Refer to `docs/guideline.md` for the complete project structure and detailed implementation patterns.

## Important Notes
- This is a Next.js 13+ project using the App Router
- The backend APIs are written in Go
- Focus on creating a clean, maintainable, and scalable codebase
- Prioritize developer experience and code readability

Remember: The goal is to create a professional, enterprise-grade dashboard that is easy to understand, maintain, and extend.