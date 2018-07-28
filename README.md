... is a web UI that enables you to govern your Kafka clusters. When connected to the [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html) are you additionally able to track changes and store information.

Currently does ... support the following Kafka APIs:

- [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html)
- [Confluent schema registry](https://docs.confluent.io/current/schema-registry/docs/index.html)

## Getting Started

> 🚧 When you want to connect ... to the Confluent schema registry [make sure](#prerequisites-confluent-schema-registry) to set the required CORS settings.

In order to get started do you need to have [`docker`](https://docs.docker.com/install/) installed.
You could pull the docker image from docker hub or build the application yourself.

**Docker**

```bash
$ ...
```

**Locally**

```bash
$ git clone ...
$ cd ...
```

Modify or set the configuration [options](#config-options) at `/public/config.js`.
You could create a docker image or run the application locally.

```bash
$ npm i
$ npm run serve
```

## Updating

When wanting to update ..., pull the latest changes from git or docker hub.

## Config options

Listed below are all available config options and their default values.
If a API url is not given will that module be disabled.

The `config.js` file should be located in the public directory.

```javascript
window.config = {
  'kafka.rest.proxy.api': 'http://127.0.0.1:8082', // Confluent Kafka REST Proxy
  'schema.registry.api': 'http://127.0.0.1:8081' // Confluent Schema Registry
}

```

## Prerequisites Confluent schema registry

You will need to enable CORS in your schema registry service.
Open and modify the schema registry properties file.

`confluent-x.x.x/etc/schema-registry/schema-registry.properties`

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
