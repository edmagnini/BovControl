# Milk Production

## Primeiros Passos

- Clonar este repositório
- Executar `npm install` para adicionar as dependências
- Criar um arquivo .env na raiz do projeto e preencher as chaves a seguir com os valores apropriados:
  ```
  JWT_KEY =
  JWT_EXPIRES_IN =
  

  BCRYPT_COST = 

  PORT = 

  MONGO_URI=
  MONGO_DATABASE=
  ```


## Sobre o projeto

Controle de produção de leite digitalizada.

Possui 4 entidades importantes:

Farm

Farmer

MilkProduction

Factory

As funcionalidades são:

→ Criar Farmer;

→ Criar Farm;

→ Cadastro de produção diária de leite;

→ Consultar produção de leite diária e mensal;

→ Consultar média do preço do litro de leite mensal;

→ Consultar média do preço do litro de leite anual;

→ Cadastrar fábrica;

→ Consultar fábrica

📋 Documentação:
https://localhost:3003/api-docs/

🛠️ Tecnologias utilizadas:

→ MongoDB;

→ Express;

→ Node.js:

→ Dotenv;

→ BCRYPT;

→ Swagger;
```
