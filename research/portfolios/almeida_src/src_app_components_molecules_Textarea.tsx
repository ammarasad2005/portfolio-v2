import AnimatedComponent from "./AnimatedComponent";

interface TextareaProps {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Textarea({
  id,
  label,
  placeholder,
  required,
  value,
  onChange,
}: TextareaProps) {
  return (
    <AnimatedComponent HTMLtag="div">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-200"
      >
        <span>{label}</span> {required && "*"}
      </label>
      <textarea
        id={id}
        name={id}
        rows={6}
        value={value}
        placeholder={placeholder}
        maxLength={500}
        onChange={onChange}
        className="w-full px-2 py-2 rounded-md border-2 border-[var(--color-foreground)]/25 bg-[var(--color-background)]/60 text-gray-200 placeholder:text-[var(--color-foreground)]/40 backdrop-blur-3xl shadow-sm focus:outline-none focus:border-[var(--action)] transition-colors duration-300 resize-none  custom-scrollbar"
      ></textarea>
    </AnimatedComponent>
  );
}
