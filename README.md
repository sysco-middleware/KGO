... is a web UI that enables you to govern your Kafka clusters. When connected to the [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html) are you additionally able to track changes and store information.

Currently does ... support the following Kafka APIs:

- [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html)
- [Confluent schema registry](https://docs.confluent.io/current/schema-registry/docs/index.html)

## Getting Started

...

## Config options

Listed below are all available config options and their default values.

```json
{
  "kafka.rest.api": "127.0.0.1:8082",
  "schema.registry.api": "127.0.0.1:8081"
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
