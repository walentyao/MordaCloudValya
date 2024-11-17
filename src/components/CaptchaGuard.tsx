import { SmartCaptcha } from '@yandex/smart-captcha';
import { useState } from 'react';

interface CaptchaGuardProps {
  children?: React.ReactNode;
}
export const CaptchaGuard = ({ children }: CaptchaGuardProps) => {
  const [acces, setAcces] = useState(false);

  if (!acces)
    return (
      <SmartCaptcha
        sitekey={import.meta.env.VITE_CLIENT_KEY}
        onSuccess={() => {
          setAcces(true);
        }}
      />
    );

  return children;
};
