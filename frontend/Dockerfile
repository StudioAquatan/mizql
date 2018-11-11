FROM node:11.1.0-alpine as builder

ENV PROJECT_DIR /opt/mizql

ADD ./ ${PROJECT_DIR}

WORKDIR ${PROJECT_DIR}

RUN yarn install && \
    yarn build

FROM nginx:latest

COPY --from=builder /opt/mizql/build/ /usr/share/www/html/front