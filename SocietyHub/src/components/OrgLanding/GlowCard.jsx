import React from "react";

const GlowCard = ({ children, className = "", glowColor = "blue" }) => {
  const shadowMap = {
    blue: "group-hover:shadow-blue-500/10",
    green: "group-hover:shadow-emerald-500/10",
    purple: "group-hover:shadow-purple-500/10",
  };

  const gradientMap = {
    blue: "from-blue-400 via-blue-600 to-blue-400",
    green: "from-emerald-400 via-teal-500 to-emerald-400",
    purple: "from-purple-400 via-indigo-500 to-purple-400",
  };

  const shadowClass = shadowMap[glowColor] || shadowMap.blue;
  const gradientClass = gradientMap[glowColor] || gradientMap.blue;

  return (
    <div className={`relative group h-full rounded-3xl p-[2px] bg-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}>
      {/* Card Content Surface */}
      <div className="relative h-full w-full bg-white rounded-[22px] p-8 sm:p-10 z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
