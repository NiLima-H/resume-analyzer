import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import { signupUser } from "../../services/authService";

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialForm: SignupForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] =
    useState<SignupForm>(initialForm);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
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
    setSuccessMessage("");

    if (!form.fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("Please enter your email.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await signupUser({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      if (data.session) {
        navigate("/dashboard");
        return;
      }

      setSuccessMessage(
        "Account created. Check your email and confirm your account before logging in.",
      );

      setForm(initialForm);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start improving your resume today."
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkTo="/login"
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div className="auth-alert auth-alert-error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="auth-alert auth-alert-success">
            {successMessage}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="fullName">Full name</label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Maheya Jannat Nilima"
            autoComplete="name"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="signupEmail">
            Email address
          </label>

          <input
            id="signupEmail"
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
          <label htmlFor="signupPassword">
            Password
          </label>

          <input
            id="signupPassword"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter the password again"
            autoComplete="new-password"
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

        <p className="auth-terms">
          By creating an account, you agree to use the
          platform responsibly. Read our{" "}
          <Link to="/privacy">privacy policy</Link>.
        </p>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}