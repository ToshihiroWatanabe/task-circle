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

# docker build . -t task-circle_frontend
# docker run -p 8161:8161 -v $PWD:/usr/src task-circle_frontend