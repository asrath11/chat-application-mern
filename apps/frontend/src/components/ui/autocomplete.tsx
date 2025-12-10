import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Input } from './input';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  onSelect?: (value: string) => void;
  renderOption?: (option: string) => React.ReactNode;
  className?: string;
}

export function Autocomplete({
  options = [],
  value,
  onChange,
  placeholder = 'Type to search...',
  emptyMessage = 'No results found.',
  onSelect,
  renderOption,
  className,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  };

  return (
    <div className={cn('relative w-full', className)} ref={dropdownRef}>
      <div className='relative'>
        <Input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role='combobox'
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-accent p-1 rounded-2xl'
            aria-label='Clear search'
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {open && filteredOptions.length > 0 && (
        <ul
          id='autocomplete-list'
          role='listbox'
          className='absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg max-h-64 overflow-y-auto'
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              id={`option-${index}`}
              role='option'
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'flex w-full items-center px-3 py-2 text-sm cursor-pointer text-left gap-2',
                index === highlightedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {renderOption ? renderOption(option) : option}
            </li>
          ))}
        </ul>
      )}

      {open && inputValue && filteredOptions.length === 0 && (
        <div className='absolute z-50 mt-1 w-full rounded-md border shadow-lg bg-background'>
          <div className='py-6 text-center text-sm'>{emptyMessage}</div>
        </div>
      )}
    </div>
  );
}
