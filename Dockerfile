# ========================================
# Production Dockerfile for Rentverse Backend
# Using Node.js with npm
# ========================================
FROM node:20-slim

# Install OpenSSL and other required dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs expressjs

# Copy package files
COPY --chown=expressjs:nodejs package*.json ./

# Copy prisma schema (needed before install for generation)
COPY --chown=expressjs:nodejs prisma ./prisma

# Install dependencies
RUN npm ci --only=production=false

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY --chown=expressjs:nodejs src ./src
COPY --chown=expressjs:nodejs index.js ./
COPY --chown=expressjs:nodejs templates ./templates

# Set ownership for application files
RUN chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Expose ports (3000 for app, 5555 for Prisma Studio)
EXPOSE 3000 5555

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "index.js"]
