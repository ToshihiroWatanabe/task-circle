FROM node:14
WORKDIR /home/node
COPY . .
COPY --chown=node:node package.json .
RUN npm i -g npm@7
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY --chown=node:node . .
USER node
RUN npm run build
RUN BROWSER=none
ENTRYPOINT ["npm","start"]