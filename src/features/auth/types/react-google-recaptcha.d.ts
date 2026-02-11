// types/react-google-recaptcha.d.ts
declare module 'react-google-recaptcha' {
  import * as React from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (value: string | null) => void;
    onExpired?: () => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
  }

  // Используем React.ComponentType вместо class, чтобы JSX корректно работал
  const ReCAPTCHA: React.ComponentType<ReCAPTCHAProps> & {
    reset: () => void;
    execute: () => void;
  };

  export default ReCAPTCHA;
}
