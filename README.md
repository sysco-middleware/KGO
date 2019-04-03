KGO (Kafka governance) is a web UI that enables you to govern your Kafka clusters.
Currently does KGO support the following Confluent APIs:

- [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html)
- [Confluent schema registry](https://docs.confluent.io/current/schema-registry/docs/index.html)

## Getting Started

> 🚧 Before getting started make sure that Confluent schema registry or proxy [is setup](#prerequisites-confluent).

In order to get started do you need to have [`docker`](https://docs.docker.com/install/) installed.
You could pull the docker image from docker hub or build the application yourself.

**Docker**

```bash
$ ...
```

**Locally**

```bash
$ git clone git@github.com:sysco-middleware/KGO.git
$ cd KGO
```

Modify or set the configuration [options](#config-options) at `/public/config.js`.
You could create a docker image or run the application locally.

```bash
$ npm install
$ npm run serve
```

## Updating

When wanting to update KGO, pull the latest changes from git or docker hub.

## Config options

Listed below are all available config options and their default values.
If a API url is not given will that module be disabled.

The `config.js` file should be located in the public directory (`/public/config.js`).

Multiple clusters could be defined inside the config.
This allowes to quickly switch between clusters.

```javascript
window.config = [{
  "name": "cluster 1", // Kafka cluster name
  "kafka.rest.proxy.api": "http://127.0.0.1:8082", // Confluent Kafka REST Proxy
  "schema.registry.api": "http://127.0.0.1:8081" // Confluent Schema Registry
}, {
  "name": "cluster 2",
  "kafka.rest.proxy.api": "http://127.0.0.1:8082",
  "schema.registry.api": "http://127.0.0.1:8081"
}]
```

## Prerequisites Confluent

An example [docker compose file](https://github.com/sysco-middleware/KGO/blob/develop/docker-compose.yaml) is included inside this project.

You will need to enable CORS in your schema registry service.
Open and modify the schema registry properties file.

`confluent-x.x.x/etc/(schema-registry|kafka-rest)/(schema-registry|kafka-rest).properties`

Set the allow origin to any hostname (`*`) or to the hostname where the UI will be hosted (`http://example.com`).
You can read more about CORS at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

```
access.control.allow.methods=GET,POST,PUT,OPTIONS
access.control.allow.origin=*
```

## Contributing

Please read through our [contributing guidelines](./CONTRIBUTING.md).

## Versioning

This project will be maintained under the Semantic Versioning guidelines as much as possible. Releases will be numbered
with the following format:

`<major>.<minor>.<patch>`
