# Ultra-Mega Dockerfile with many stages and tools

###############################################
# Stage 0 — Base Node environment
###############################################
FROM node:20-bullseye AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
COPY . .

###############################################
# Stage 1 — Linting + Code Quality
###############################################
FROM base AS code_quality
RUN npm install -g eslint prettier
RUN eslint . || true
RUN prettier --check . || true

###############################################
# Stage 2 — TypeScript Build
###############################################
FROM base AS ts_builder
RUN npm install -g typescript
RUN tsc --build

###############################################
# Stage 3 — Unit Tests
###############################################
FROM base AS test_runner
RUN npm install -g mocha jest
RUN npm test || echo "Tests failed but continuing (demo)."

###############################################
# Stage 4 — Clone another repo inside Docker (demo)
###############################################
FROM node:20-bullseye AS repo_cloner
RUN apt-get update && apt-get install -y git
WORKDIR /external
RUN git clone https://github.com/vercel/next.js.git
RUN ls -la next.js

###############################################
# Stage 5 — Build an external tool inside Docker
###############################################
FROM repo_cloner AS external_builder
WORKDIR /external/next.js
RUN npm install
RUN npm run build || true

###############################################
# Stage 6 — Python utilities layer
###############################################
FROM python:3.11-slim AS pytools
RUN pip install --no-cache-dir boto3 ffmpeg-python requests numpy

###############################################
# Stage 7 — FFmpeg binary layer
###############################################
FROM jrottenberg/ffmpeg:6.0-scratch AS ffmpeg_layer

###############################################
# Stage 8 — Golang tool to generate extra binary
###############################################
FROM golang:1.22 AS go_builder
WORKDIR /go_app
RUN cat <<EOF > main.go
package main
import "fmt"
func main(){ fmt.Println("Hello from Go tool built inside Docker!") }
EOF
RUN go build -o go_tool

###############################################
# Stage 9 — Alpine utility layer (curl, bash)
###############################################
FROM alpine:3.19 AS alpine_utils
RUN apk add --no-cache curl bash jq

###############################################
# Stage 10 — Final Production Image
###############################################
FROM node:20-bullseye
WORKDIR /app

# Copy Node build
COPY --from=ts_builder /app/dist ./dist
COPY --from=ts_builder /app/node_modules ./node_modules

# Copy Python runtime
COPY --from=pytools /usr/local /usr/local

# Copy FFmpeg binary
COPY --from=ffmpeg_layer /usr/local/bin/ffmpeg /usr/local/bin/
COPY --from=ffmpeg_layer /usr/local/bin/ffprobe /usr/local/bin/

# Copy Go tool
COPY --from=go_builder /go_app/go_tool /usr/local/bin/go_tool

# Copy utils
COPY --from=alpine_utils /usr/bin/curl /usr/local/bin/
COPY --from=alpine_utils /usr/bin/jq /usr/local/bin/

# Install extra utilities
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    postgresql-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Supervisor config
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]