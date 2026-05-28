import { Button, Input, Label, VokadashHead } from '@/core/libs';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { FormEventHandler, useState } from 'react';
import { InputSecure, useAlert } from '@/features/_global';
import { lang } from '@/core/libs';
import { APP_CONFIG } from '@/core/configs';

export const LoginPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const alert = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit: FormEventHandler = async (e) => {
    e?.preventDefault?.();
    try {
      const res = await auth.login({ email, password });

      if (Number(res?.data?.isActive) !== 2) {
        throw new Error(lang.text('needActiovation'));
      }

      // Simpan token di localStorage
      const token = res?.data?.token; // Pastikan token ada di response
      if (token) {
        localStorage.setItem('token', token); // Simpan token ke localStorage
        console.log('Token berhasil disimpan di localStorage:', token); // Log untuk verifikasi
      } else {
        console.log('Token tidak ditemukan dalam response');
      }

      alert.success('Selamat datang kembali');
      
      navigate('/', { replace: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert.error(err?.message || lang.text('errSystem'));
    }
  };

  return (
    <form onSubmit={submit}>
      <VokadashHead>
        <title>{`${lang.text('login')} | ${APP_CONFIG.appName}`}</title>
      </VokadashHead>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">{lang.text('email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={lang.text('inputEmail')}
            required
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{lang.text('password')}</Label>
          </div>
          <InputSecure
            id="password"
            required
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
            placeholder={lang.text('inputPassword')}
          />
          <div className="text-right">
            <Link to="/auth/forget-password" className="text-xs underline">
              {lang.text('forgetPassword') + '?'}
            </Link>
          </div>
        </div>
        <Button type="submit" disabled={auth.isLoading} className="w-full">
          {auth.isLoading ? lang.text('pleaseWait') : lang.text('login')}
        </Button>
        <div>
          <p className="text-sm">
            {lang.text('schoolNotRegistered')}{' '}
            <Link to="/schools/register" className="underline">
              {lang.text('registerHere')}
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};
