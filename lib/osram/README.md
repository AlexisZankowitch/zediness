### Config
A file **config.yaml** must be created here:

```yaml
api:
  token:
    type: string
    value: 
  userID:
    type: string
    value: 
  uri:
    type: string
    value: 
  deviceID:
    type: string
    value: 
  deviceTypeID:
    type: string
    value: 
  dali1ID:
    type: string
    value: 
  dali1_cert:
    type: file
    value: 
  tenants:
    type: list
    values:
      test_az_concept:
        type: string
        value: 
  applications:
    type: list
    values:
      zed-lightelligence_id:
        type: string
        value: 
      zed-lightelligence_auth_client_id:
        type: string
        value: 
      zed-lightelligence_auth_client_secret:
        type: string
        value: 
mqtt:
  uri: 
  port: 
  protocol: 
  topics:
    bulb: 
    dali1: 
    data-ingest: 
``` 