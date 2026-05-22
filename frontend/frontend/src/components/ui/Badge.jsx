import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success-color)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
        };
      case 'warning':
        return {
          backgroundColor: 'var(--warning-bg)',
          color: 'var(--warning-color)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
        };
      case 'danger':
      case 'high':
        return {
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger-color)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
        };
      case 'accent':
      case 'medium':
        return {
          backgroundColor: 'var(--accent-glow)',
          color: 'var(--accent-color)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        };
      case 'neutral':
      case 'low':
      default:
        return {
          backgroundColor: 'var(--bg-panel)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-color)',
        };
    }
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    ...getStyles(),
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
