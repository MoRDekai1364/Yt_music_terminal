import React from 'react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ title, children, isActive = false }) => {
  const borderColor = isActive ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]';
  const titleColor = isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]';

  return (
    <div className={`relative border ${borderColor} p-2 h-full flex flex-col`}>
      <h2 className={`absolute -top-3 left-3 px-2 bg-[var(--color-background)] ${titleColor}`}>
        {title}
      </h2>
      <div className="overflow-y-auto flex-grow pr-2">
          {children}
      </div>
    </div>
  );
};

export default TerminalWindow;