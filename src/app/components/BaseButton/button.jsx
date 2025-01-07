import { memo } from 'react';

const Button = memo(function Button({ className = '', text = 'Label' }) {
  return (
    <button className={`px-16 py-3 bg-black text-white rounded-lg ${className}`}>
      {text}
    </button>
  );
});

export default Button;