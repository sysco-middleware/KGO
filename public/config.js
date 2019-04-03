window.config = {
  'clusters': [{
    'name': 'cluster 1',
    'kafka.rest.proxy.api': 'http://kafka-rest:8082', // Confluent Kafka REST Proxy
    'schema.registry.api': 'http://schema-registry:8081' // Confluent Schema Registry
  },
  {
    'name': 'cluster 2',
    'kafka.rest.proxy.api': 'http://kafka-rest:8082', // Confluent Kafka REST Proxy
    'schema.registry.api': 'http://schema-registry:8081' // Confluent Schema Registry
  }]
}
