"use client";

import LoginForm from "@/components/auth/LoginForm";

function Login({ params: { locale } }: { params: { locale: string } }) {
  return <LoginForm locale={locale} />;
}

export default Login;
