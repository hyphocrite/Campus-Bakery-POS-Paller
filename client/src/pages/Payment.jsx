import { useState } from 'react';
import { Link } from 'react-router-dom';
import Steps from '../components/Steps';
import NewTransactionButton from '../components/NewTransactionButton';
import { useCart } from '../context/CartContext';
import { centsToPeso } from '../data/format';
import { validatePayment } from '../data/payment';

const SERVER_ERROR = 'Could not save the transaction. Make sure the server is running and try again.';

export default function Payment() {
  const {
    items,
    itemCount,
    totalCents,
    paymentInput,
    setPaymentInput,
    paymentError,
    setPaymentError,
    transaction,
    completePayment,
  } = useCart();
  const [saving, setSaving] = useState(false);
  // Counts submit attempts; used as the error's key so the shake replays even for the same message.
  const [attempt, setAttempt] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempt((n) => n + 1);

    // Run the checks in order; show the first error and stop.
    const result = validatePayment({ itemCount, input: paymentInput, totalCents });
    if (!result.ok) {
      setPaymentError(result.error);
      return;
    }

    // Valid: save to SQLite. The server returns the saved transaction with its TXN number.
    setPaymentError('');
    setSaving(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          amountPaidCents: result.amountCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || SERVER_ERROR);
        return;
      }
      completePayment(data);
    } catch {
      setPaymentError(SERVER_ERROR);
    } finally {
      setSaving(false);
    }
  };

  // After a valid payment: green confirmation with the transaction number and change.
  if (transaction) {
    return (
      <div className="page">
        <Steps current={3} />
        <div className="confirm-card">
          <div className="confirm-icon">✓</div>
          <h1>Payment Successful</h1>
          <p className="confirm-txn">{transaction.txnNumber}</p>
          <div className="confirm-rows">
            <div><span>Total</span><span>{centsToPeso(transaction.totalCents)}</span></div>
            <div><span>Cash Paid</span><span>{centsToPeso(transaction.amountPaidCents)}</span></div>
          </div>
          <div className="confirm-change">
            <span>Change</span>
            <strong>{centsToPeso(transaction.changeCents)}</strong>
          </div>
          <div className="confirm-actions">
            <Link to="/receipt" className="btn btn-ghost btn-lg">View Receipt</Link>
            <NewTransactionButton className="btn btn-primary btn-lg" />
          </div>
        </div>
      </div>
    );
  }

  const quickCash =
    totalCents > 0
      ? [...new Set([totalCents, Math.ceil(totalCents / 5000) * 5000, Math.ceil(totalCents / 10000) * 10000, 50000, 100000])]
          .filter((v) => v >= totalCents)
          .slice(0, 4)
      : [];

  return (
    <div className="page">
      <Steps current={2} />
      <div className="page-header">
        <div>
          <h1>Payment</h1>
          <p className="muted">Enter the cash received from the customer.</p>
        </div>
      </div>

      <div className="two-col">
        <form className="card" onSubmit={handleSubmit} noValidate>
          <h2>Cash Payment</h2>
          <label className="field">
            Amount Paid
            {/* type="text" (not "number") so non-numeric input like "abc" reaches our validation */}
            <div className={`input-prefix ${paymentError ? 'has-error' : ''}`}>
              <span>₱</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={paymentInput}
                onChange={(e) => {
                  setPaymentInput(e.target.value);
                  if (paymentError) setPaymentError('');
                }}
                placeholder="0.00"
                aria-invalid={Boolean(paymentError)}
                aria-describedby="payment-error"
              />
            </div>
          </label>

          {quickCash.length > 0 && (
            <div className="quick-cash">
              {quickCash.map((v) => (
                <button
                  type="button"
                  key={v}
                  className="chip"
                  onClick={() => {
                    setPaymentInput((v / 100).toFixed(2));
                    setPaymentError('');
                  }}
                >
                  {centsToPeso(v)}
                </button>
              ))}
            </div>
          )}

          {paymentError && (
            <p key={attempt} id="payment-error" className="alert alert-error" role="alert">
              {paymentError}
            </p>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-lg pay-btn" disabled={saving}>
            {saving ? 'Saving…' : 'Confirm Payment'}
          </button>
        </form>

        <aside className="card summary-card">
          <h2>Amount Due</h2>
          <p className="amount-due">{centsToPeso(totalCents)}</p>
          <div className="summary-row"><span>Items</span><span>{itemCount}</span></div>
          <Link to="/order-summary" className="btn btn-ghost btn-block">← Back to Order</Link>
        </aside>
      </div>
    </div>
  );
}
