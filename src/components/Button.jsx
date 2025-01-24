import React from 'react';

function Button({text, onClick, className})
{
  return (
    <button className={`w-[90%] text-base py-4 bg-[#176332] hover:bg-green-700 border border-[#0f3912] rounded-[25px] text-white ${className}`} onClick={onClick}>{text}</button>
  );
}

export default Button;