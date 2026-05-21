const Card = ({ title, value, subtitle, color = "text-white", icon, trend, trendUp }) => {
  return (
    <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group">

      <div className="flex items-start justify-between mb-3">
        {icon && (
          <span className="text-xl">{icon}</span>
        )}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trendUp
              ? "bg-green-500/15 text-green-400"
              : "bg-red-500/15 text-red-400"
          }`}>
            {trend}
          </span>
        )}
      </div>

      <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{title}</p>

      <h2 className={`text-3xl font-bold mt-1.5 ${color} group-hover:scale-[1.02] transition-transform origin-left`}>
        {value}
      </h2>

      {subtitle && (
        <p className="text-xs text-white/25 mt-2 leading-relaxed">{subtitle}</p>
      )}

    </div>
  );
};

export default Card;