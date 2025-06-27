FROM node:18.20.3-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package*.json ./
RUN pnpm install

# Copy source code
COPY . .

# 🛠️ Compile TypeScript to JavaScript
RUN pnpm build

EXPOSE 8000

# 🔥 Start app from compiled dist
CMD ["pnpm", "dev"]