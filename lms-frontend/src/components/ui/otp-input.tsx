'use client';

import * as React from 'react';
import { cn } from '@/shared/libs/utils';

const OTP_LENGTH = 6;

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

export function OtpInput({ value, onChange, length = OTP_LENGTH, disabled, className, inputClassName }: OtpInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.padEnd(length, '').split('').slice(0, length);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
      const next = [...digits];
      next[index - 1] = '';
      onChange(next.join(''));
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 1) {
      const pasted = raw.slice(0, length).split('');
      const next = [...digits];
      pasted.forEach((char, i) => {
        if (index + i < length) next[index + i] = char;
      });
      onChange(next.join(''));
      focusInput(Math.min(index + pasted.length, length - 1));
      return;
    }
    const char = raw.slice(-1);
    const next = [...digits];
    next[index] = char;
    onChange(next.join(''));
    if (char && index < length - 1) focusInput(index + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const raw = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!raw) return;
    const pasted = raw.split('');
    const next = [...Array(length)].map((_, i) => pasted[i] ?? digits[i] ?? '');
    onChange(next.join(''));
    focusInput(Math.min(pasted.length, length) - 1);
  };

  return (
    <div className={cn('flex gap-2 justify-center', className)} onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          value={digits[index] ?? ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className={cn(
            'h-12 w-11 rounded-lg border border-input bg-background text-center text-lg font-semibold tabular-nums ring-offset-background transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            inputClassName
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  );
}
