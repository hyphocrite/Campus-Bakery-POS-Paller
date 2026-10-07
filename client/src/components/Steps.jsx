const STEPS = ['Products', 'Order Summary', 'Payment', 'Receipt'];

export default function Steps({ current }) {
  return (
    <ol className="steps">
      {STEPS.map((label, i) => (
        <li key={label} className={i < current ? 'done' : i === current ? 'active' : ''}>
          <span className="step-num">{i < current ? '✓' : i + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
