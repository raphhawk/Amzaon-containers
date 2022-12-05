FROM node:15-alpine
WORKDIR /app
COPY package.json .
#RUN npm install --only=production
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
      then npm install; \
      else npm install --only=production; \
    fi

COPY . ./
ENV PORT 8080
EXPOSE $PORT
CMD ["node", "app.js"]
