# NestJS Clean Architecture Forum API

Uma API RESTful robusta para um sistema de Fórum (Q&A), desenvolvida com foco em alto rigor arquitetural. Este projeto aplica os conceitos de **Clean Architecture**, **Domain-Driven Design (DDD)** e princípios **SOLID** para garantir uma base de código testável, manutenível e escalável, isolando completamente a lógica de negócios de frameworks externos e detalhes de infraestrutura.

---

## 💻 Tecnologias e Ferramentas

* **Framework:** NestJS (Node.js)
* **Linguagem:** TypeScript
* **Banco de Dados:** PostgreSQL (Relacional)
* **ORM:** Prisma
* **Cache:** Redis (via `node-redis` v5)
* **Testes:** Vitest & Supertest
* **Autenticação:** JWT (JSON Web Token) e Criptografia com Bcryptjs
* **Infraestrutura:** Docker & Docker Compose

---

## 🏗️ Arquitetura do Projeto

O projeto é estritamente dividido em camadas concêntricas, onde as camadas internas não conhecem as camadas externas (Regra de Dependência).



### 1. Domain (Enterprise Business Rules)
Contém as **Entidades** puras (`Question`, `Answer`, `User`), **Value Objects** (`Slug`, `QuestionWithAuthor`) e os **Domain Events**. Não possui nenhuma dependência externa, nem mesmo do NestJS.

### 2. Application (Application Business Rules)
Contém os **Use Cases** (Casos de Uso) do sistema. Cada ação do usuário é uma classe isolada. Também define os **Contratos (Interfaces)** de dependências externas, como Repositórios de Banco de Dados, provedores de Hash e Cache.

### 3. Infrastructure (Frameworks & Drivers)
A camada mais externa. É onde o NestJS opera, lidando com:
* **Controllers:** Recebem chamadas HTTP, validam dados (Pipes/Zod) e repassam para os Use Cases.
* **Presenters:** Transformam as Entidades de Domínio no formato visual (JSON) esperado pela API.
* **Mappers:** Traduzem dados brutos do Prisma para Entidades de Domínio e vice-versa.
* **Database:** Implementações concretas dos repositórios utilizando o Prisma Client.
* **Cache:** Implementação do padrão *Cache-Aside* utilizando o Redis para aliviar o banco de dados principal.

---

## 🏛️ Princípios SOLID Aplicados

O projeto foi construído respeitando os 5 princípios do SOLID. Abaixo, exemplos reais da aplicação:

1.  **S - Single Responsibility Principle (SRP):**
    A abolição de "Services" gigantes (ex: `QuestionService`). Cada ação é isolada em um Caso de Uso específico (ex: `CreateQuestionUseCase`, `EditQuestionUseCase`). Cada classe tem apenas um motivo para mudar.
2.  **O - Open/Closed Principle (OCP):**
    O sistema de **Domain Events** (ex: `OnAnswerCreated`). Podemos adicionar novas reações ao evento de "Resposta Criada" (como enviar um SMS, além da Notificação no app) criando um novo *Subscriber*, sem precisar modificar o código do caso de uso `AnswerQuestionUseCase`.
3.  **L - Liskov Substitution Principle (LSP):**
    A capacidade de substituir a implementação real do repositório (`PrismaQuestionsRepository`) por uma versão em memória (`InMemoryQuestionsRepository`) durante os testes unitários, sem que o Caso de Uso perceba a diferença ou quebre, pois ambos respeitam o mesmo contrato.
4.  **I - Interface Segregation Principle (ISP):**
    Contratos de repositórios específicos. O `QuestionsRepository` possui apenas métodos relacionados a perguntas, enquanto o `AnswersRepository` lida com respostas. Não forçamos uma classe a implementar métodos que não utiliza.
5.  **D - Dependency Inversion Principle (DIP):**
    Os Casos de Uso (Application) não importam o Prisma ou frameworks externos. Eles dependem de classes abstratas (ex: `abstract class CacheRepository`). A injeção da implementação concreta (`RedisCacheRepository`) é feita via Inversão de Controle (IoC) pelo container do NestJS.

---

## ⚙️ Funcionalidades (Casos de Uso)

O sistema de fórum suporta as seguintes operações interativas:

### 👤 Usuários (Students/Authors)
* `RegisterStudent`: Criação de uma nova conta com senha criptografada.
* `AuthenticateStudent`: Autenticação e geração de token JWT.

### ❓ Perguntas (Questions)
* `CreateQuestion`: Cria uma pergunta com título, conteúdo e anexos.
* `EditQuestion`: Edita os dados de uma pergunta e sincroniza anexos.
* `DeleteQuestion`: Remove a pergunta.
* `FetchRecentQuestions`: Lista perguntas recentes (com implementação de **Cache no Redis**).
* `GetQuestionBySlug`: Busca os detalhes de uma pergunta específica e seu autor.
* `ChooseQuestionBestAnswer`: Autor da pergunta marca uma resposta como a "Melhor Resposta" (Gera Evento de Domínio).

### 💡 Respostas (Answers)
* `AnswerQuestion`: Cria uma resposta para uma pergunta específica.
* `EditAnswer`: Atualiza o conteúdo e anexos da resposta.
* `DeleteAnswer`: Remove a resposta.
* `FetchQuestionAnswers`: Lista todas as respostas de uma pergunta, paginadas.

### 💬 Comentários (Comments)
* `CommentOnQuestion`: Adiciona um comentário a uma pergunta.
* `CommentOnAnswer`: Adiciona um comentário a uma resposta.
* `DeleteQuestionComment` / `DeleteAnswerComment`: Remove o comentário específico.
* `FetchQuestionComments` / `FetchAnswerComments`: Lista comentários associados.

### 📎 Anexos (Attachments)
* `UploadAndCreateAttachment`: Recebe arquivos via `multipart/form-data` (Upload) e persiste a referência lógica.

### 🔔 Notificações (Notifications)
* `SendNotification`: Disparado automaticamente em background via Domain Events (ex: quando alguém responde sua pergunta).
* `ReadNotification`: Marca uma notificação como lida.

---

## 🧪 Estratégia de Testes

A garantia de qualidade da API é mantida através de duas camadas rigorosas de testes automatizados com o **Vitest**:

* **Testes Unitários:** Cobrem 100% dos Casos de Uso. Utilizam o padrão de **In-Memory Repositories** para validar as regras de negócio em milissegundos, sem necessidade de banco de dados ou framework, atestando a pureza do Domínio.
* **Testes End-to-End (E2E):** Validam a integração completa partindo das rotas HTTP até o Banco de Dados. Utiliza o `Supertest` junto com o NestJS Testing Module. Possui um setup automatizado que isola cada suíte de testes em um *Schema* do PostgreSQL exclusivo gerado por UUID dinâmico, garantindo execução paralela sem condições de corrida (*race conditions*).