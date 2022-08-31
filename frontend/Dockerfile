FROM node:14
WORKDIR /home/node
COPY --chown=node:node package.json .
RUN npm i -g npm@7
RUN npm install
COPY --chown=node:node . .
USER node
RUN npm run build
RUN BROWSER=none
ENTRYPOINT ["npm","start"]