import { useState } from 'react';

export function useSettings() {
  const [model, setModel] = useState('gpt-4');
  // Add more settings as needed

  return {
    model,
    setModel,
    // Add more settings and setters here
  };
}

/*
Key Points:
- Manages model selection and other user settings.
- Type-safe and extendable.
*/
