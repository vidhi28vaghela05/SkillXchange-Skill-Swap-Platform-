const Input = ({ icon: Icon, label, className = '', ...props }) => {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />}
        <input
          className={`w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 px-3 text-sm ${Icon ? 'pl-9' : ''} input-focus placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-700 dark:text-slate-200 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
