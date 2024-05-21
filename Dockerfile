FROM node:20-alpine3.19 as builder
WORKDIR /usr/src/app
COPY package-lock.json .
COPY package.json .
RUN npm ci
COPY tsconfig.json .
COPY src/ src/
RUN npm run build

FROM node:20-alpine3.19
WORKDIR /root/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
CMD [ "node", "dist/index.js" ]