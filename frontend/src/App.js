import React, { useState } from 'react'
import styled from "styled-components";
import { useGlobalContext } from './context/globalContext';
import Sidebar from './Components/Layout/Sidebar';
import Dashboard from './Components/Dashboard/Dashboard';
import Transactions from './Components/Transactions/Transactions';
import TransactionForm from './Components/Transactions/TransactionForm';
import Budgets from './Components/Budgets/Budgets';
import Toasts from './Components/ui/Toasts';
import { Button } from './Components/ui/Button';
import { Card } from './Components/ui/Card';
import Icon from './Components/ui/Icon';
import EmptyState from './Components/ui/EmptyState';

const PAGES = {
  dashboard: {title: 'Dashboard', subtitle: 'Your financial overview'},
  transactions: {title: 'Transactions', subtitle: 'Search, filter and manage every entry'},
  budgets: {title: 'Budgets', subtitle: 'Set monthly spending limits by category'},
}

function App() {
  const {loading, loadError, refresh, transactions} = useGlobalContext()
  const [page, setPage] = useState('dashboard')
  // {type, transaction?} while the add/edit dialog is open
  const [form, setForm] = useState(null)

  const openAdd = (type) => setForm({type})
  const openEdit = (transaction) => setForm({type: transaction.type, transaction})

  const navigate = (next) => {
    setPage(next)
    window.scrollTo(0, 0)
  }

  const renderPage = () => {
    // Only block the page on the first load; later refreshes keep showing data
    if (loading && !transactions.length) {
      return <Card><EmptyState icon="spinner fa-spin" title="Loading your data…" /></Card>
    }
    if (loadError && !transactions.length) {
      return (
        <Card>
          <EmptyState
            icon="triangle-exclamation"
            title="Couldn't load your data"
            message={loadError}
            action={<Button onClick={refresh}><Icon name="rotate-right" /> Try again</Button>}
          />
        </Card>
      )
    }
    switch (page) {
      case 'transactions':
        return <Transactions onAdd={openAdd} onEdit={openEdit} />
      case 'budgets':
        return <Budgets />
      default:
        return <Dashboard onAdd={openAdd} onEdit={openEdit} onNavigate={navigate} />
    }
  }

  const {title, subtitle} = PAGES[page]

  return (
    <Shell>
      <Sidebar page={page} onNavigate={navigate} />
      <main>
        <header className="page-header">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="actions">
            <Button $variant="secondary" onClick={() => openAdd('income')}>
              <Icon name="plus" /> Income
            </Button>
            <Button onClick={() => openAdd('expense')}>
              <Icon name="plus" /> Expense
            </Button>
          </div>
        </header>

        {loadError && transactions.length > 0 && (
          <div className="banner" role="alert">
            <Icon name="triangle-exclamation" />
            <span>{loadError}</span>
            <Button $variant="secondary" $size="sm" onClick={refresh}>Retry</Button>
          </div>
        )}

        {renderPage()}
      </main>

      {form && <TransactionForm {...form} onClose={() => setForm(null)} />}
      <Toasts />
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  min-height: 100vh;

  main{
    flex: 1;
    min-width: 0;
    max-width: 1400px;
    padding: 2rem;
  }

  .page-header{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    h1{
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -.02em;
    }
    p{
      color: var(--text-muted);
    }
    .actions{
      display: flex;
      gap: .5rem;
    }
  }

  .banner{
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: 1rem;
    padding: .75rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--warning-soft);
    color: #92400e;
    font-size: .875rem;
    span{
      flex: 1;
    }
  }

  @media (max-width: 900px){
    flex-direction: column;
    main{
      padding: 1.25rem 1rem;
    }
  }
`;

export default App;
