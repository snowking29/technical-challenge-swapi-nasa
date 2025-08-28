# technical-challenge-swapi-nasa

## Ejecutar localmente

### 1. Levantar DynamoDB Local

A. Levantar docker.
B. Para levantar DynamoDB en local, ejecutar:

```bash
docker run -d -p 8000:8000 amazon/dynamodb-local
```

C. Crear la tabla FusionTable:

```bash
aws dynamodb create-table \
  --table-name FusionTable \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=type,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH AttributeName=type,KeyType=RANGE \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"TimestampIndex\",
        \"KeySchema\":[
          {\"AttributeName\":\"type\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"timestamp\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\":{\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      }
    ]" \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --endpoint-url http://localhost:8000


```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Inicializar proyecto localmente

```bash
npm run start
```
