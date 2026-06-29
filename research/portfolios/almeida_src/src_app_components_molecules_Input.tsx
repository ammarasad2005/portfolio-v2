import AnimatedComponent from "./AnimatedComponent";

interface InputProps {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  id,
  label,
  placeholder,
  required,
  value,
  onChange,
}: InputProps) {
  return (
    <AnimatedComponent HTMLtag="div">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-200"
      >
        <span>{label}</span> {required && "*"}
      </label>
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-2 py-2 rounded-md border-2 border-[var(--color-foreground)]/25 bg-[var(--color-background)]/60 text-gray-200 placeholder:text-[var(--color-foreground)]/40 backdrop-blur-3xl shadow-sm focus:outline-none focus:border-[var(--action)] transition-colors duration-300"
      />
    </AnimatedComponent>
  );
}
