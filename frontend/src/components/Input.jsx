const Input = ({ icon: Icon, label, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
        <input
          className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 ${Icon ? 'pl-12' : ''} input-focus placeholder:text-slate-400 text-slate-700 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
