## Desáfio Técnico

- [ ] Criar uma solução que permita enviar múltiplos arquivos do histórico de extrato em formato `.csv`.

### Como rodar o projeto

`docker-compose --env-file .env.production up --build`

### Tecnologias selecionadas

Ao se tratar de uma solução financeira, se faz necessário a IDEMPOTÊNCIA, INTEGRIDADE e CONSISTÊNCIA dos dados.

- Optamos por um banco de dados relacional `PostgreSQL`, apesar da desavantagem de ser menos flexível que um NoSQL, garantimos uma solução mais estruturada.

### Decisões Técnicas

Ao selecionar `Node.js` para lidar com operações matemáticas, devemos ter o cuidado de não utilizar o float. Devido as deficiências que o `JS` trás como linguagem.

Por exemplo:

```js
0.1 + 0.2; // -> 0.30000000000000004
0.1 + 0.2 === 0.3; // -> false
```

### Coisas que eu gostaria de implementar

#### Lazy loading

- [ ] Revisar: `React.lazy` + `Suspense`
- [ ] Exercícios:
  - [ ] Prefetch do `bundle`
  - [ ] Code-split de rotas (Quando lidamos com Next.js, acho que já incluimos isso)
- [ ] Critério de Aceite
  - [ ] Lighthouse --> Mostrando redução do bundle inicial.

#### Memoização

- [ ] `memo` em listas grandes virtualizadas. `https://react.dev/reference/react/memo`

#### React Testing Library

#### GraphQL

- [ ] Aprender com

#### Pipeline com Streams para múltiplos documentos

#### Documentação com Swagger + Orval

- [ ] Automação com Orval + Swagger
- [ ] Automação com GitHub Actions

#### Design Patterns

- [ ] Factory para gerenciamento de Classes
- [ ] Viabilidade de Adapter, Singleton, Strategy ou Observer
- [ ] Revisar principios de S.O.L.I.D
  - [x] Single Responsibility Principle
  - [ ] Open/Closed Principle
  - [ ] Liskov Substitution Principle
  - [x] Interface Segregation Principle
  - [x] Dependency Inversion Principle
