// components/Input.tsx
interface InputProps {
    icon: React.ElementType;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    required?: boolean;
    error?: string;
  }
  
  export const Input = ({ 
    icon: Icon, 
    type, 
    placeholder, 
    value, 
    onChange,
    name,
    required = false,
    error
  }: InputProps) => (
    <div className="space-y-1">
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
          className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
            ${error ? 'border-red-500' : 'border-gray-200'}
            ${error ? 'bg-red-50' : 'bg-white'}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
    </div>
  );