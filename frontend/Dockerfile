FROM node:18.18.0-alpine as angular

WORKDIR /app

ENV CHARGERPOINTS_API_URL $CHARGERPOINTS_API_URL
ENV LOGIN_API_URL $LOGIN_API_URL
ENV USERS_API_URL $USERS_API_URL
ENV VEHICLES_API_URL $VEHICLES_API_URL

COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=angular /app/dist/charlie-client /usr/share/nginx/html
COPY --from=angular /app/nginx.conf /etc/nginx/conf.d/default.conf
