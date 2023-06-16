FROM docker.io/library/node:19-alpine3.16 as builder
WORKDIR /app
ADD ./ /app/
RUN npm install
RUN npm run build

FROM docker.io/library/nginx:1.23.3-alpine as prod
RUN adduser -DH executor
COPY --from=builder --chown=executor /app/build /usr/share/nginx/html
