import React from "react";

function Loader({className})
{
  return (
    <div className={`loader ${className}`}>
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </div>
  );
};

export default Loader;