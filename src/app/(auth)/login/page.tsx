import { LoginForm } from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { message?: string };
}) {
  const message =
    typeof searchParams?.message === "string" ? searchParams.message : undefined;

  return <LoginForm resetMessage={message} />;
}
