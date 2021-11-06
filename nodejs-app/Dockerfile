FROM node:14-alpine3.14
WORKDIR /app
COPY . /app
RUN npm ci --only=production && npm cache clean --force
ENV PORT 4000
EXPOSE 4000
CMD node index.js
