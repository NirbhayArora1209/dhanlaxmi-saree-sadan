# Troubleshooting Guide

## Common Issues and Solutions

### 1. Webpack Module Resolution Errors

**Error Message:**
```
Error: Cannot find module './XXX.js'
```

**Solution:**
```bash
# Method 1: Clean cache and restart
npm run clean
npm run dev:clean

# Method 2: Clear Next.js cache only
rm -rf .next
npm run dev

# Method 3: Full clean install
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### 2. TypeScript Compilation Errors

**Solution:**
```bash
# Check TypeScript configuration
npm run type-check

# Fix common issues
npm run lint:fix
```

### 3. Hot Reload Not Working

**Solution:**
```bash
# Use the clean development command
npm run dev:clean

# Or manually clear cache
npm run clean
npm run dev
```

### 4. Build Failures

**Solution:**
```bash
# Clean build
npm run build:clean

# Check for errors
npm run type-check
npm run lint
```

### 5. Development Server Performance Issues

**Solution:**
1. Close unnecessary browser tabs
2. Clear browser cache
3. Use clean development mode: `npm run dev:clean`
4. Check for circular dependencies
5. Restart VS Code / IDE

## Best Practices

1. **Always use path aliases** (`@/`) instead of relative imports
2. **Clear cache regularly** when experiencing module resolution issues
3. **Use ErrorBoundary** components to catch and handle errors gracefully
4. **Monitor console** for webpack warnings and errors
5. **Keep dependencies updated** to avoid compatibility issues

## Emergency Reset

If nothing else works:
```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```