import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { Input } from './input';
import { Button } from './button';
import { X } from 'lucide-react'

interface AutocompleteProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  onSelect?: (value: string) => void;
}

export function Autocomplete({
  options = [],
  value,
  onChange,
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  onSelect
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setOpen(newValue.length > 0);
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    onSelect?.(option);
    setOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setOpen(true)}
          placeholder={placeholder}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-accent p-1 rounded-2xl"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg max-h-64 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(option)}
              className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-left"
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {open && inputValue && filteredOptions.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border shadow-lg bg-background">
          <div className="py-6 text-center text-sm">
            {emptyMessage}
          </div>
        </div>
      )}
    </div>
  );
}
