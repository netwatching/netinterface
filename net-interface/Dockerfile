FROM nodesolidserver/node-solid-server As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN sudo chmod -R 777 /usr/src/app

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx

COPY --from=builder /usr/src/app/dist/net-interface/ /usr/share/nginx/html
