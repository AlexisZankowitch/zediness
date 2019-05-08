### Config
A file **config.yaml** must be created here:

```yaml
api:
  tokens:
    type: list
    values:
      my_token: 
        type: string
        value: 
  tenants:
    type: list
    values:
      my_tenant:
        type: string
        value: ID
  [....]
  param2:
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