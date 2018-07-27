### BUILD STAGE ###
FROM node:10-alpine as builder

# Create and navigate to working directory
WORKDIR /ui
COPY . .
ARG environment
RUN echo Environment mode set to: ${environment}

# Install deps and build project
RUN npm set progress=false && npm config set depth 0 && \
    npm i && \
    npm run build -- --modern --mode ${environment} && \
    npm run lint && \
    npm cache clean --force

### STAGE 2: Setup ###
FROM nginx:1.14-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ui/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]