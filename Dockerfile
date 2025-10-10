# stage 1 : build frontend

FROM node:18 AS build-frontend

# set working directory 
WORKDIR /app/frontend


#copy frontend dependcies and install 
COPY frontend/package*.json ./
RUN npm install 

#copy fronntend code 
COPY frontend/. . 

#Build static files (Vite)
RUN npm run build 



#stage 2 : build-backend 

FROM node:18 as build-backend 

WORKDIR /app/backend 

COPY  backend/package*.json ./
RUN npm install 



COPY --from=build-frontend  /app/frontend/build /app/backend/public 


EXPOSE 3000

CMD [""]


