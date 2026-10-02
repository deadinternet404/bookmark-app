import { cookies } from 'next/headers';
import { tokenIsValid, AUTH_COOKIE } from '@/lib/auth';
import LoginForm from './components/LoginForm';
import BookmarksApp from './components/BookmarksApp';

export default function Home() {
  const authed = tokenIsValid(cookies().get(AUTH_COOKIE)?.value);
  return authed ? <BookmarksApp /> : <LoginForm />;
}
