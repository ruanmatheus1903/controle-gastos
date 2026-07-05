'use client';

import { useEffect, useState, type FormEvent } from 'react';

type Person = {
  id: number;
  name: string;
  age: number;
};

type Transaction = {
  id: number;
  description: string;
  value: number;
  type: string;
  personId: number;
  personName: string;
};

type Summary = {
  pessoas: Array<{
    name: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
  }>;
  totalReceitas: number;
  totalDespesas: number;
  saldoGeral: number;
};

const API_URL = 'http://localhost:5224/api';

// Página principal responsável por gerenciar pessoas, transações e resumo financeiro.
export default function HomePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [personName, setPersonName] = useState('');
  const [personAge, setPersonAge] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [transactionValue, setTransactionValue] = useState('');
  const [transactionType, setTransactionType] = useState('Receita');
  const [transactionPersonId, setTransactionPersonId] = useState('');
  const [message, setMessage] = useState('');

  // Formata a entrada de valor para moeda, facilitando a digitação no formulário.
  const formatCurrencyInput = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    if (!onlyNumbers) return '';
    const numericValue = (Number(onlyNumbers) / 100).toFixed(2);
    return numericValue.replace('.', ',');
  };

  const handleValueChange = (value: string) => {
    setTransactionValue(formatCurrencyInput(value));
  };

  // Carrega os dados da API para atualizar a tela com pessoas, transações e resumo.
  const loadData = async () => {
    const [peopleResponse, transactionsResponse, summaryResponse] = await Promise.all([
      fetch(`${API_URL}/people`),
      fetch(`${API_URL}/transactions`),
      fetch(`${API_URL}/summary`),
    ]);

    if (peopleResponse.ok) setPeople(await peopleResponse.json());
    if (transactionsResponse.ok) setTransactions(await transactionsResponse.json());
    if (summaryResponse.ok) setSummary(await summaryResponse.json());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cadastra uma nova pessoa e atualiza a lista após o sucesso.
  const createPerson = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${API_URL}/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: personName, age: Number(personAge) }),
    });

    if (response.ok) {
      setPersonName('');
      setPersonAge('');
      setMessage('Pessoa cadastrada com sucesso.');
      loadData();
    } else {
      const error = await response.text();
      setMessage(error || 'Não foi possível cadastrar a pessoa.');
    }
  };

  // Remove uma pessoa e atualiza a tela após a exclusão.
  const deletePerson = async (id: number) => {
    const response = await fetch(`${API_URL}/people/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setMessage('Pessoa removida com sucesso.');
      loadData();
    } else {
      setMessage('Não foi possível remover a pessoa.');
    }
  };

  // Cadastra uma nova transação e envia o valor já convertido para decimal.
  const createTransaction = async (event: FormEvent) => {
    event.preventDefault();
    const numericValue = Number(transactionValue.replace(/\./g, '').replace(',', '.'));
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: transactionDescription,
        value: numericValue,
        type: transactionType,
        personId: Number(transactionPersonId),
      }),
    });

    if (response.ok) {
      setTransactionDescription('');
      setTransactionValue('');
      setTransactionType('Receita');
      setTransactionPersonId('');
      setMessage('Transação cadastrada com sucesso.');
      loadData();
    } else {
      const error = await response.text();
      setMessage(error || 'Não foi possível cadastrar a transação.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_35%),linear-gradient(135deg,_#020617,_#0f172a_60%,_#111827)] p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold sm:text-4xl">Controle de Gastos Residenciais</h1>
          <p className="mt-2 text-sm text-slate-300 sm:text-base">
            Organize pessoas, transações e acompanhe seu saldo em uma interface moderna.
          </p>
        </header>

        {message ? (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${message.includes('sucesso') ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/40 bg-rose-500/10 text-rose-200'}`}>
            <strong>{message}</strong>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold">Cadastrar Pessoa</h2>
            <form onSubmit={createPerson} className="flex flex-col gap-3">
              <input className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none ring-0 focus:border-sky-400" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="Nome" required />
              <input className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none focus:border-sky-400" value={personAge} onChange={(e) => setPersonAge(e.target.value)} placeholder="Idade" type="number" min="0" required />
              <button className="rounded-2xl bg-sky-500 px-4 py-3 font-semibold transition hover:bg-sky-400" type="submit">Salvar Pessoa</button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold">Pessoas</h2>
            {people.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma pessoa cadastrada ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {people.map((person) => (
                  <div key={person.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3">
                    <div>
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-slate-400">{person.age} anos</div>
                    </div>
                    <button onClick={() => deletePerson(person.id)} className="rounded-xl bg-rose-500/15 px-3 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/25">Excluir</button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold">Cadastrar Transação</h2>
            <form onSubmit={createTransaction} className="flex flex-col gap-3">
              <input className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none focus:border-sky-400" value={transactionDescription} onChange={(e) => setTransactionDescription(e.target.value)} placeholder="Descrição" required />
              <input className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none focus:border-sky-400" value={transactionValue} onChange={(e) => handleValueChange(e.target.value)} placeholder="Valor" inputMode="numeric" required />
              <select className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none focus:border-sky-400" value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
              </select>
              <select className="rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-3 text-sm outline-none focus:border-sky-400" value={transactionPersonId} onChange={(e) => setTransactionPersonId(e.target.value)} required>
                <option value="">Selecione a pessoa</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
              <button className="rounded-2xl bg-sky-500 px-4 py-3 font-semibold transition hover:bg-sky-400" type="submit">Salvar Transação</button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold">Transações</h2>
            {transactions.length === 0 ? (
              <p className="text-sm text-slate-400">Nenhuma transação cadastrada ainda.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-slate-400">{transaction.personName}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${transaction.type === 'Receita' ? 'text-emerald-400' : 'text-rose-400'}`}>R$ {transaction.value.toFixed(2)}</div>
                      <div className="text-sm text-slate-400">{transaction.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
          <h2 className="mb-4 text-xl font-semibold">Resumo Financeiro</h2>
          {summary ? (
            <>
              <div className="mb-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="text-sm text-slate-400">Receitas</div>
                  <div className="mt-2 text-2xl font-semibold text-emerald-400">R$ {summary.totalReceitas.toFixed(2)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="text-sm text-slate-400">Despesas</div>
                  <div className="mt-2 text-2xl font-semibold text-rose-400">R$ {summary.totalDespesas.toFixed(2)}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-4">
                  <div className="text-sm text-slate-400">Saldo Geral</div>
                  <div className={`mt-2 text-2xl font-semibold ${summary.saldoGeral >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>R$ {summary.saldoGeral.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {summary.pessoas.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-800/60 px-4 py-3">
                    <div className="font-medium">{item.name}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      Receitas R$ {item.totalReceitas.toFixed(2)} • Despesas R$ {item.totalDespesas.toFixed(2)} • Saldo R$ {item.saldo.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">Carregando resumo...</p>
          )}
        </section>
      </div>
    </main>
  );
}
