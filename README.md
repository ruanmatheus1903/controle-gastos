# Controle de Gastos Residenciais

Este projeto é uma aplicação web para controlar receitas, despesas e saldo de uma residência, com uma interface moderna e uma API backend organizada.

##  O que a aplicação faz

A plataforma permite:
- cadastrar pessoas;
- listar e remover pessoas;
- registrar transações de receita e despesa;
- visualizar o resumo financeiro por pessoa;
- acompanhar o saldo geral da residência.

##  Tecnologias utilizadas

- Backend: ASP.NET Core + C# + Entity Framework Core + SQLite
- Frontend: Next.js + TypeScript + Tailwind CSS

##  Regras de negócio implementadas

- Uma transação precisa estar vinculada a uma pessoa cadastrada.
- Menores de idade só podem registrar despesas.
- Ao excluir uma pessoa, suas transações também são removidas.
- O resumo financeiro é calculado no backend para manter consistência dos dados.

##  Interface

A interface foi criada para oferecer uma experiência mais limpa e organizada, com:
- formulário de cadastro de pessoas;
- lista de pessoas cadastradas;
- formulário de cadastro de transações;
- lista de transações registradas;
- painel com resumo financeiro.

##  Como executar localmente

### 1. Backend
```bash
dotnet run --project ControleGastos.Api
```

### 2. Frontend
```bash
cd ControleGastos.Web
npm install
npm run dev
```

A API ficará disponível em http://localhost:5224 e o frontend em http://localhost:3000.

##  Persistência

Os dados são armazenados em SQLite, então continuam salvos mesmo após reiniciar a aplicação.

## Erro de npm 

Se estiver no Windows PowerShell e o comando npm der erro de execução de scripts, rode:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass