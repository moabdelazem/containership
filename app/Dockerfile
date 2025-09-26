# Use specific Node.js version with Alpine for smaller image size
FROM node:22.16-alpine AS base

# Install security updates and dumb-init for proper signal handling
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./

# Build stage - install all dependencies
FROM base AS builder
RUN npm ci --include=dev

# Copy source code
COPY . .

# Production stage - install only production dependencies
FROM base AS production

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code from builder (excludes dev dependencies)
COPY --from=builder --chown=nodeuser:nodejs /app/src ./src

# Change ownership of the app directory to non-root user
RUN chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Make port configurable with default
ENV PORT=3000
ENV NODE_ENV=production
ENV LOG_LEVEL=info
ENV SERVICE_NAME=containership
ENV SERVICE_VERSION=1.0.0
ENV LOG_TO_FILE=true

# Expose the port
EXPOSE $PORT

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "http.get('http://localhost:$PORT/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Run the application 
CMD ["node", "src/index.js"]

