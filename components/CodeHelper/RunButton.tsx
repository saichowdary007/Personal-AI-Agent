import React from 'react';

interface RunButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const RunButton: React.FC<RunButtonProps> = ({ onClick, loading, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
    disabled={disabled || loading}
    aria-disabled={disabled || loading}
  >
    {loading ? 'Running...' : 'Run'}
  </button>
);

export default RunButton;

/*
Key Points:
- Accessible button for running code.
- Shows loading state.
- Disables when running or disabled.
*/
