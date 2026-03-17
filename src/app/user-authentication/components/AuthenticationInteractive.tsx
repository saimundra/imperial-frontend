'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/hooks/useAuth';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdClient {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: (callback?: (notification: {
    isNotDisplayed?: () => boolean;
    isSkippedMoment?: () => boolean;
    getNotDisplayedReason?: () => string;
    getSkippedReason?: () => string;
  }) => void) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdClient;
      };
    };
    __imperialGoogleGsiInitialized?: boolean;
    __imperialGoogleGsiCredentialHandler?: (credential: string) => void;
  }
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface AuthenticationInteractiveProps {
  initialMode?: 'login' | 'register';
}

export default function AuthenticationInteractive({ initialMode = 'login' }: AuthenticationInteractiveProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithCredentials, loginWithGoogle, registerAccount } = useAuth();
  const loginGoogleButtonRef = useRef<HTMLDivElement | null>(null);
  const registerGoogleButtonRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [serverError, setServerError] = useState('');
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const resolvePostAuthPath = useCallback(
    (isStaff?: boolean) => {
      const requestedRedirect = searchParams.get('redirect');

      if (requestedRedirect && requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')) {
        return requestedRedirect;
      }

      return isStaff ? '/admin-panel' : '/user-account-dashboard';
    },
    [searchParams],
  );

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      setServerError('');

      const result = await loginWithGoogle(credential);
      setIsLoading(false);

      if (result.success) {
        router.push(resolvePostAuthPath(result.user.isStaff));
        return;
      }

      setServerError(result.error || 'Unable to sign in with Google right now.');
    },
    [loginWithGoogle, router],
  );

  useEffect(() => {
    window.__imperialGoogleGsiCredentialHandler = (credential: string) => {
      void handleGoogleCredential(credential);
    };
  }, [handleGoogleCredential]);

  const renderGoogleButton = useCallback(() => {
    if (!googleClientId || !isGoogleReady || !window.google?.accounts?.id) {
      return;
    }

    const target = mode === 'login' ? loginGoogleButtonRef.current : registerGoogleButtonRef.current;
    if (!target) {
      return;
    }

    target.innerHTML = '';
    window.google.accounts.id.renderButton(target, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: mode === 'login' ? 'signin_with' : 'signup_with',
      shape: 'rectangular',
      width: target.clientWidth || 340,
      logo_alignment: 'left',
    });
  }, [googleClientId, isGoogleReady, mode]);

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const initializeGoogleClient = () => {
      const googleIdClient = window.google?.accounts?.id;
      if (!googleIdClient) {
        return;
      }

      if (!window.__imperialGoogleGsiInitialized) {
        googleIdClient.initialize({
          client_id: googleClientId,
          callback: (response) => {
            if (response?.credential) {
              window.__imperialGoogleGsiCredentialHandler?.(response.credential);
            }
          },
        });
        window.__imperialGoogleGsiInitialized = true;
      }

      setIsGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initializeGoogleClient();
      return;
    }

    const existingScript = document.getElementById('google-identity-services') as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        initializeGoogleClient();
        return;
      }

      const onLoad = () => {
        existingScript.dataset.loaded = 'true';
        initializeGoogleClient();
      };

      existingScript.addEventListener('load', onLoad, { once: true });
      return () => {
        existingScript.removeEventListener('load', onLoad);
      };
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      initializeGoogleClient();
    };
    script.onerror = () => {
      setServerError('Unable to load Google Sign-In right now. Please try again later.');
    };

    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    renderGoogleButton();
  }, [renderGoogleButton]);

  const validateLogin = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!loginData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    } else if (loginData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = (): boolean => {
    const errors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!registerData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!registerData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(registerData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!registerData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    setServerError('');

    const result = await loginWithCredentials(loginData.email, loginData.password);
    setIsLoading(false);

    if (result.success) {
      router.push(resolvePostAuthPath(result.user.isStaff));
      return;
    }

    setServerError(result.error || 'Unable to sign in right now.');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    setServerError('');

    const result = await registerAccount({
      fullName: registerData.fullName,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
    });
    setIsLoading(false);

    if (result.success) {
      router.push(resolvePostAuthPath(result.user.isStaff));
      return;
    }

    setServerError(result.error || 'Unable to create account right now.');
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      if (!googleClientId) {
        setServerError('Google sign-in is not configured yet. Please contact support.');
        return;
      }

      if (!isGoogleReady || !window.google?.accounts?.id) {
        setServerError('Google sign-in is loading. Please try again in a moment.');
        return;
      }

      window.google.accounts.id.prompt((notification) => {
        const notDisplayed = notification?.isNotDisplayed?.();
        const skipped = notification?.isSkippedMoment?.();

        if (notDisplayed || skipped) {
          const reason =
            notification?.getNotDisplayedReason?.() ||
            notification?.getSkippedReason?.() ||
            'Google prompt is blocked by browser or account settings.';

          const normalizedReason = reason.toLowerCase();
          if (normalizedReason.includes('origin') || normalizedReason.includes('invalid_client')) {
            setServerError(
              `Google OAuth origin is not allowed for this client ID. Add ${window.location.origin} to Authorized JavaScript origins in Google Cloud Console.`,
            );
            return;
          }

          setServerError(`Google sign-in did not open: ${reason}`);
        }
      });
      return;
    }

    setServerError(`${provider} sign-in is not available yet. Please use email/password.`);
  };

  const getPasswordStrength = (password: string): { strength: string; color: string } => {
    if (password.length === 0) return { strength: '', color: '' };
    if (password.length < 6) return { strength: 'Weak', color: 'text-error' };
    if (password.length < 10) return { strength: 'Medium', color: 'text-warning' };
    return { strength: 'Strong', color: 'text-success' };
  };

  const passwordStrength = getPasswordStrength(registerData.password);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-card rounded-lg golden-border golden-glow overflow-hidden">
          {/* Toggle Tabs */}
          <div className="flex border-b golden-border">
            <button
              onClick={() => {
                setMode('login');
                setServerError('');
              }}
              className={`flex-1 py-4 font-body font-medium transition-luxury ${
                mode === 'login' ?'text-primary bg-muted border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setServerError('');
              }}
              className={`flex-1 py-4 font-body font-medium transition-luxury ${
                mode === 'register' ?'text-primary bg-muted border-b-2 border-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {serverError && (
              <div className="mb-6 p-3 rounded-lg border border-error/30 bg-error/10 text-error text-sm font-body">
                {serverError}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block font-body text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({ ...loginData, email: e.target.value });
                      if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined });
                    }}
                    className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                      loginErrors.email ? 'border-error' : ''
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {loginErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block font-body text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined });
                      }}
                      className={`w-full px-4 py-3 pr-12 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                        loginErrors.password ? 'border-error' : ''
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-luxury"
                    >
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <span className="ml-2 font-body text-sm text-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="font-body text-sm text-primary hover:underline transition-luxury"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t golden-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground font-caption">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    ref={loginGoogleButtonRef}
                    className="w-full min-h-[44px] flex items-center justify-center"
                  />
                  {(!isGoogleReady || !googleClientId) && (
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={isLoading || !googleClientId}
                      className={`w-full flex items-center justify-center gap-2 py-3 bg-surface-elevated rounded-lg golden-border transition-luxury ${
                        isLoading || !googleClientId ? 'opacity-50 cursor-not-allowed' : 'hover:golden-glow'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-body text-sm text-foreground">Google</span>
                    </button>
                  )}
                </div>

                {!googleClientId && (
                  <p className="text-xs font-caption text-warning">
                    Google sign-in needs NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend .env.local.
                  </p>
                )}

              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="register-name" className="block font-body text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="register-name"
                    value={registerData.fullName}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, fullName: e.target.value });
                      if (registerErrors.fullName) setRegisterErrors({ ...registerErrors, fullName: undefined });
                    }}
                    className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                      registerErrors.fullName ? 'border-error' : ''
                    }`}
                    placeholder="Enter your full name"
                  />
                  {registerErrors.fullName && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-email" className="block font-body text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, email: e.target.value });
                      if (registerErrors.email) setRegisterErrors({ ...registerErrors, email: undefined });
                    }}
                    className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                      registerErrors.email ? 'border-error' : ''
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-phone" className="block font-body text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="register-phone"
                    value={registerData.phone}
                    onChange={(e) => {
                      setRegisterData({ ...registerData, phone: e.target.value });
                      if (registerErrors.phone) setRegisterErrors({ ...registerErrors, phone: undefined });
                    }}
                    className={`w-full px-4 py-3 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                      registerErrors.phone ? 'border-error' : ''
                    }`}
                    placeholder="98XXXXXXXX"
                  />
                  {registerErrors.phone && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-password" className="block font-body text-sm font-medium text-foreground mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      value={registerData.password}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, password: e.target.value });
                        if (registerErrors.password) setRegisterErrors({ ...registerErrors, password: undefined });
                      }}
                      className={`w-full px-4 py-3 pr-12 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                        registerErrors.password ? 'border-error' : ''
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-luxury"
                    >
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                    </button>
                  </div>
                  {passwordStrength.strength && (
                    <p className={`mt-1 text-sm ${passwordStrength.color}`}>
                      Password strength: {passwordStrength.strength}
                    </p>
                  )}
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-confirm-password" className="block font-body text-sm font-medium text-foreground mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      value={registerData.confirmPassword}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, confirmPassword: e.target.value });
                        if (registerErrors.confirmPassword) setRegisterErrors({ ...registerErrors, confirmPassword: undefined });
                      }}
                      className={`w-full px-4 py-3 pr-12 bg-input text-foreground rounded-lg golden-border transition-luxury focus:golden-border-focus focus:outline-none ${
                        registerErrors.confirmPassword ? 'border-error' : ''
                      }`}
                      placeholder="Re-enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-luxury"
                    >
                      <Icon name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={20} />
                    </button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerData.acceptTerms}
                      onChange={(e) => {
                        setRegisterData({ ...registerData, acceptTerms: e.target.checked });
                        if (registerErrors.acceptTerms) setRegisterErrors({ ...registerErrors, acceptTerms: undefined });
                      }}
                      className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <span className="ml-2 font-body text-sm text-foreground">
                      I accept the{' '}
                      <button type="button" className="text-primary hover:underline">
                        Terms and Conditions
                      </button>{' '}
                      and{' '}
                      <button type="button" className="text-primary hover:underline">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {registerErrors.acceptTerms && (
                    <p className="mt-1 text-sm text-error flex items-center">
                      <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
                      {registerErrors.acceptTerms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground font-body font-medium rounded-lg transition-luxury hover:scale-105 golden-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t golden-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground font-caption">Or sign up with</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    ref={registerGoogleButtonRef}
                    className="w-full min-h-[44px] flex items-center justify-center"
                  />
                  {(!isGoogleReady || !googleClientId) && (
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={isLoading || !googleClientId}
                      className={`w-full flex items-center justify-center gap-2 py-3 bg-surface-elevated rounded-lg golden-border transition-luxury ${
                        isLoading || !googleClientId ? 'opacity-50 cursor-not-allowed' : 'hover:golden-glow'
                      }`}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-body text-sm text-foreground">Google</span>
                    </button>
                  )}
                </div>

                {!googleClientId && (
                  <p className="text-xs font-caption text-warning">
                    Google sign-up needs NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend .env.local.
                  </p>
                )}

              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}