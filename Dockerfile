# Stage 1 - the build process
FROM node:17.1.0-alpine3.14 as builder

# Create app directory
WORKDIR /app

COPY yarn.lock ./
COPY package*.json ./
COPY prisma ./prisma/
COPY .docker ./.docker/

# Install app dependencies
RUN yarn install --production --frozen-lockfile

COPY . .

RUN yarn build

# Stage 2 - the production environment
FROM node:17.1.0-alpine3.14

RUN apk add --no-cache bash

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.docker ./.docker

RUN yarn remove bcrypt && yarn add bcrypt

EXPOSE 3000
EXPOSE 5555

ENTRYPOINT [ ".docker/entrypoint.sh" ]
