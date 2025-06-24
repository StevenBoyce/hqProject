FROM node:18-alpine

# Install dependencies for Prisma and networking tools
RUN apk add --no-cache openssl netcat-openbsd

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the development server with database wait
CMD ["sh", "-c", "echo 'Waiting for PostgreSQL...' && while ! nc -z postgres 5432; do sleep 1; done && echo 'PostgreSQL ready!' && npx prisma db push && npm run dev"] 