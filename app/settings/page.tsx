import React from 'react';
import ThemeSwitcher from '@/components/Settings/ThemeSwitcher';
import ModelSelector from '@/components/Settings/ModelSelector';

const SettingsPage: React.FC = () => {
  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="sr-only">Settings</h1>
      <div className="mx-auto flex max-w-lg flex-col gap-8">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Theme</h2>
          <ThemeSwitcher />
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Model</h2>
          <ModelSelector />
        </div>
        {/* Add more settings toggles here */}
      </div>
    </section>
  );
};

export default SettingsPage;
