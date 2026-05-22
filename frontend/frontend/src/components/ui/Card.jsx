import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hoverable = false, ...props }) => {
  const baseClasses = 'glass-panel';
  const combinedClasses = `${baseClasses} ${className}`;

  if (hoverable) {
    return (
      <motion.div
        className={combinedClasses}
        whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ padding: '1.5rem' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses} style={{ padding: '1.5rem' }} {...props}>
      {children}
    </div>
  );
};
