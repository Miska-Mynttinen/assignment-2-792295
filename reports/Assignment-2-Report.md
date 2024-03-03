# Assignment Report

1. Schemas for a set of constraints for tenant service agreement:
# tentant1_schema_constraints:
```json
{
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

# tentant2_schema_constraints:
```json
{
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


2. clientbatchingestapp:
- read_input_files: read input files in client-staging-input-directory
- data_wrangler: add a new properties "client_id" and "client_name"
- ingestion: start ingesting to mysimbd-coredms


3. mysimbdp-batchingestmanager:
- Tenant registry
- Scheduler
- Executor