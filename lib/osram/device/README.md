## CERTIFICATES

### Create a Unique Private/Private Key Pair for Your Device Certificate:
```bash
openssl ecparam -out device_key.pem -name prime256v1 -genkey
```
### Create the Device Certificate
```
openssl req -new -key device_key.pem -x509 -days 365 -out device_cert.pem -subj '/O=My-Tenant/CN=My-Device'
```