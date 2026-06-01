# VoxTech 🖥️🔴

> Plataforma de e-commerce para hardware, periféricos e produtos gamer desenvolvida como Projeto Integrado Multidisciplinar (PIM) do curso de Análise e Desenvolvimento de Sistemas da UNIP.

---

# 📋 Sobre o Projeto

A VoxTech é uma plataforma de comércio eletrônico especializada em hardware, periféricos e acessórios para gamers e profissionais de tecnologia.

O projeto foi desenvolvido com foco em:

- Experiência do usuário (UX)
- Interface moderna e responsiva
- Acessibilidade digital
- Integração entre Front-end, API REST e Banco de Dados
- Segurança e gerenciamento de usuários
- Simulação completa do fluxo de compra

---

# 🚀 Funcionalidades

## 👤 Gestão de Usuários

- Cadastro de usuários
- Login de usuários
- Validação de credenciais
- Persistência de sessão
- Área de perfil personalizada
- Exibição dinâmica dos dados do usuário

## 🛍️ Catálogo de Produtos

- Listagem dinâmica de produtos
- Busca de produtos em tempo real
- Página individual para cada produto
- Exibição dinâmica de:
  - Nome
  - Descrição
  - Preço
  - Categoria
  - Imagem
- Navegação por categorias

## 🛒 Carrinho e Compra

- Adição de produtos ao carrinho
- Simulação de checkout
- Opções de pagamento:
  - Cartão de Crédito
  - Pix
- Cálculo de frete via API ViaCEP

## ♿ Recursos de Acessibilidade

- Integração com VLibras
- Ajuste global de tamanho de fonte
- Leitor de tela desenvolvido em JavaScript
- Interface adaptada para diferentes perfis de usuários

## 📱 Responsividade

- Desktop
- Tablet
- Smartphone

---

# 🛠 Tecnologias Utilizadas

## Front-end

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Font Awesome

## Back-end

- ASP.NET Core Web API
- C#

## Banco de Dados

- SQL Server

## APIs Externas

- ViaCEP
- VLibras

---

# 🗄 Estrutura do Banco de Dados

### Usuários

- Id
- Nome
- Sobrenome
- CPF
- Email
- Senha

### Produtos

- Id
- Nome
- Descrição
- Preço
- Estoque
- Categoria
- ImagemUrl

---

# 🔗 Principais Endpoints

## Usuários

### Cadastro

```http
POST /api/Usuarios
```

### Login

```http
POST /api/Usuarios/login
```

---

## Produtos

### Listar todos

```http
GET /api/Produtos
```

### Buscar por ID

```http
GET /api/Produtos/{id}
```
# ⚙️ Como Executar

## Banco de Dados

1. Criar o banco SQL Server
2. Executar os scripts de criação das tabelas

## API

```bash
dotnet restore
dotnet run
```

Swagger:

```url
http://localhost:5132/swagger
```

## Front-end

Abrir:

```bash
index.html
```

ou utilizar:

```bash
Live Server
```

---

# 🎓 Projeto Acadêmico

Projeto desenvolvido para a disciplina Projeto Integrado Multidisciplinar (PIM) do curso de Análise e Desenvolvimento de Sistemas da Universidade Paulista (UNIP).

---

# 👨‍💻 Desenvolvedores

- Leonardo Oliveira Gomes da Silva
- Gustavo Henrique

---

# 📄 Licença

Projeto acadêmico desenvolvido exclusivamente para fins educacionais.
