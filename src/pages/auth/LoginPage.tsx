import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import { loginUser } from "../../services/authService";

interface LoginForm {
  email: string;
  password: string;
}

const initialForm: LoginForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

const redirectPath =
  (
    location.state as {
      from?: string;
    } | null
  )?.from ?? "/dashboard";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setErrorMessage("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage("");

    if (!form.email.trim() || !form.password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      await loginUser({
        email: form.email,
        password: form.password,
      });

      navigate(redirectPath, {
       replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your resume analysis."
      footerText="Do not have an account?"
      footerLinkText="Create account"
      footerLinkTo="/signup"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="auth-alert auth-alert-error">
            {errorMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="loginEmail">Email address</label>

          <input
            id="loginEmail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <div className="label-row">
            <label htmlFor="loginPassword">Password</label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <input
            id="loginPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) =>
              setShowPassword(event.target.checked)
            }
          />

          <span>Show password</span>
        </label>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}