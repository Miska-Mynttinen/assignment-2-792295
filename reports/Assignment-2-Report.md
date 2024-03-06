# Assignment Report

# Part 1

## 1. Schemas for a set of constraints for tenant service agreement:
### tentant1_schema_constraints:
```json
{
    "tenant_id": "1",
    "data_file_constraints": {
        "file_format": "JSON",
        "max_num_of_files": 10,
        "max_file_size": "10MB"
    },
    "service_agreement_constraints": {
        "agreement_duration_months": 12,
        "cost_per_MB_in_euro": 0.01,
        "service_availability_in_percent": 99
    }
}
```

### tentant2_schema_constraints:
```json
{
    "tenant_id": "2",
    "data_file_constraints": {
        "file_format": "JSON",
        "max_num_of_files": 10,
        "max_file_size": "10MB"
    },
    "service_agreement_constraints": {
        "agreement_duration_months": 6,
        "cost_per_MB_in_euro": 0.01,
        "service_availability_in_percent": 95
    }
}
```


## 2. clientbatchingestapp:
- read_input_files: read input files in client-staging-input-directory
- data_wrangler: add a new properties "client_id" and "client_name"
- ingestion: start ingesting to mysimbd-coredms by informing mysimbdp-batchingestmanager about the data to be sent.
- Data used for testing: null


## 3. mysimbdp-batchingestmanager bounded:
- Tenant registry (either api paths in the database OR a configuration file within the program OR "tenant_id" in service-agreement.json)
- Scheduler (Per tentant to schedule: Round-robin, Priority-based or Resource aware scheduling)
- Executor (Execute ingestion pipeline for chosen tenants data)

- Uses Apache Kafka: The cluster of brokers and api to create producers and consumers in mysimbdp developed in assignment one.
- Tenants can can send their data to be ingested and the mysimbdp-batchingestmanager schedules the ingestion jobs and calls mysimbdp-daas ingestion api.
- Data sent as large batches at specific times somehow.
- Mysimbdp-daas creates the producers and consumers based on the mysimbdp-batchingestmanager scheduling in order to ingest data into mysimbdp-coredms (MongoDB).
- (Maybe batchProcessor with Spark or Hadoop after Kafka brokers to ingest processed data to into mysimbdp-coredms (MongoDB).)



## 4. Multi-tenancy model in mysimbdp:
#### Shared:
- Mysimbdp-coredms shared between all tenants.
- Mysimbdp-batchingestmanager is used to manage all tenants mysimbdp-clientbatchingestingapp.
#### Individual:
- Tenants will have individual staging input directories defined in mysimbdp-clientbatchingestapp.
- Tenants will have individual nodes in the database for their data.
- Tenants will have individual kafka producers and consumers that are created when they send data to be ingested and the mysimbdp-batchingestmanager calls the api mysimbdp-daas.
- Tenants have individual service agreement contracts that define schemas for the client data.

Performance for ingestion tests for both tenants individually and together (with failures).
With different constraints.
Show example of data not being ingested due to violation of constraints in the service agreement.
Maximum amount of data per second in tests (Max system load capacity).
Should have excellent data processing speeds, efficient scaling, high fault tolerance, and minimal disruptions. 

##### Test performance for:
- Data ingestion and Throughout (how fast and how much data can be stored per second and more)
- Data Processing speed (Hadoop or Spark), how long transformation takes. For example MapReduce job metrics.
(- Component tests)

##### Possible tools:
- NoSQL: MongoDb, Zookeeper, HBase
- MapReduce: Hadoop, Hive, Pig, Cascading, Oozie, Kafka, S4, MapR, Flume
- Ingestion: 
    - Apache Kafka Performance Tool (kafka-producer-perf-test)
    - Apache JMeter, Apache Spark PerfTest
    - Apache Hadoop Benchmarks
    - Stream Bench
    - HiBench
    - YCSB (Yahoo! Cloud Serving Benchmark)
    - Tsung
- Metrics: Prometheus, Granatha

##### The big V:s of big data:
- Volume: the sheer amount of data;
- Velocity: how quickly a system can create and transport the data;
- Variety: how many different types of data;
- Veracity: the data accuracy and quality;
- Variability: how data flows vary and often change; and
- Value: the data beneficial to the business.


## 5. Collect logging metrics from performance tests
- Winston in Node.js (logging library)
- Store tenant logs in individual tenant database paths.
- Also general logs for the whole system.

##### Metrics to log:
- Total number of successful ingestions per tenant.
- Total number of failed ingestions per tenant.
- Average ingestion time per tenant.
- Total data size ingested per tenant.
- Overall success/failure rate across all tenants.
- Distribution of ingestion times and data sizes across all ingested files.
- Trends over time in ingestion performance metrics.
- Data Storage: How data is stored in different nodes
- Concurrency: How many threads can perform write and read operation
- Timeouts: Values for connection timeout, query timeout, etc.
- Map reduce performance: Sorts, merge, etc.
- Message queue: Message rate, size, etc.



# Part 2

## 1. mysimbdp-messagingsystem:
- Uses Apache Kafka: The cluster of brokers and api to create producers and consumers in mysimbdp developed in assignment one.
- Tenants can can send their data to be ingested and the mysimbdp-streamingestmanager schedules the ingestion jobs and calls mysimbdp-daas ingestion api.
- Mysimbdp-daas creates the producers and consumers based on the mysimbdp-streamingingestmanager scheduling in order to ingest data into mysimbdp-coredms (MongoDB).
- Lastly Kafka brokers send data to streamprocessor (Spark or Hadoop) that does the final processing to the data and ingests into mysimbdp-coredms (MongoDB).

#### Shared:
- Mysimbdp-coredms shared between all tenants.
- Mysimbdp-streamingestmanager is used to manage all tenants clientstreamingestingapp.
#### Individual:
- Tenants will have individual staging input directories defined in clientstreamingestingapp.
- Tenants will have individual nodes in the database for their data.
- Tenants will have individual kafka producers and consumers that are created when they send data to be ingested and the mysimbdp-streamingestmanager calls the api mysimbdp-daas.
- Tenants have individual service agreement contracts that define schemas for the client data.


# 2. mysimbdp-streamingingestmanager unbounded:
    - Tenant registry (either api paths in the database OR a configuration file within the program OR "tenant_id" in service-agreement.json)
    - Scheduler (Per tentant to schedule: Round-robin, Priority-based or Resource aware scheduling)
    - Executor (Execute ingestion pipeline for chosen tenants data)


## 3. clientstreamingestapp:
- read_input_files: read input files in client-staging-input-directory
- data_wrangler: add a new properties "client_id" and "client_name"
- ingestion: start ingesting to mysimbd-coredms by informing mysimbdp-streamingestmanager about the data to be sent.
- Data used for testing: null


## 4. clientstreamingestapp report:
- Report format is logs sent as JSON.
- Report sent to mysimbdp-streamingestmonitor that performs necessary actions based on report results.
- Mechanism is calling an api (HTTP POST request) of mysimbdp-streamingestmonitor and the report is sent every 10 minutes when the clientstreamingestapp is active.
- If inactive no report is sent.
- Report JSON schema:
```json
{
    "tenant_id": "string",
    "timestamp": "UTC",
    "average_ingestion_time_ms": "number",
    "total_ingested_data_size_bytes": "number",
    "number_of_messages": "number"
}
```

## 5. mysimbdp-streamingestmonitor receives the report from clientstreamingestapp:
- Clientstreamingestapp calls an api (HTTP POST request) of mysimbdp-streamingestmonitor and the report is sent every 10 minutes when the clientstreamingestapp is active.
- Mysimbdp-streamingestmonitor checks the database api path for these reports at /test/report with specific queryparameters of UTC of the previous 10 minutes.
- Mysimbdp-streamingestmonitor informs mysimbdp-streamingestmanager about the stated of the active clientstreamingestapp:s.
- Mysimbdp-streamingestmanager updates its scheduling based on this information.




# Part 3
## No software implementation only design ideas