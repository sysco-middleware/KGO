... is a web UI that enables you to govern your Kafka clusters. When connected to the [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html) are you additionally able to track changes and store information.

Currently does ... support the following Kafka APIs:

- [Confluent rest proxy](https://docs.confluent.io/current/kafka-rest/docs/intro.html)
- [Confluent schema registry](https://docs.confluent.io/current/schema-registry/docs/index.html)

## Getting Started

In order to get started do you need to have [`docker`](https://docs.docker.com/install/) and [`docker-compose`](https://docs.docker.com/compose/install/) installed.
Clone the master branch of this repository and pull the latest docker images.

```
$ git clone ...
$ cd ...
$ docker-compose pull
```

Modify the configuration [options](#config-options).

> 🚧 When you want to connect ... to the Confluent schema registry [make sure](#prerequisites-confluent-schema-registry) to set the required CORS settings.

`$ nano config.json`

By default is ... running on port `8080` if you want to change the default port, update the `docker-compose.yml` file.
Once you have set the configuration options, run the docker compose containers.
The `-d` flag runs the docker containers in demonised mode.

```
$ docker-compose up -d
```

## Updating

When wanting to update ..., pull the latest changes from git and images from docker hub.

```
$ git pull
$ docker-compose pull
```

## Config options

Listed below are all available config options and their default values.
If a API url is not given will that module be disabled.

```
{
  kafka.rest.proxy.api: http://127.0.0.1:8082,
  schema.registry.api: http://127.0.0.1:8081
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
