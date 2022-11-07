# base image
FROM node:latest
# set working directory
WORKDIR /app
# install and cache app dependencies
COPY package.json /app/package.json
#RUN npm install -g @angular/cli@13.1.2

# add app
COPY . /app
RUN npm install
# start app
CMD ng serve --host 0.0.0.0
