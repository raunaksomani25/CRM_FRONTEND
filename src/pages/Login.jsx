import React, { useState } from "react";
import Layout from "./Layout";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    try {
      setIsLoading(true);
      window.location.href = "https://crm-backend-fsez.onrender.com/auth/google";
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong while redirecting to Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div
          className="card shadow-lg border-0"
          style={{ width: "400px", maxWidth: "90vw" }}
        >
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h1 className="h3 fw-bold text-dark mb-2">Welcome</h1>
              <p className="text-muted">Sign in to continue</p>
            </div>
            {error && (
              <div
                className="alert alert-danger alert-dismissible fade show"
                role="alert"
              >
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                ></button>
              </div>
            )}

            <button
              className="btn btn-outline-dark btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                transition: "all 0.2s ease",
                border: "2px solid #dee2e6",
              }}
            >
              {!isLoading && (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Signing in...
                </>
              ) : (
                "Continue with Google"
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">
            &copy; 2025 Mini CRM. Built with ❤️ for better customer engagement.
          </p>
        </div>
      </footer>
    </Layout>
  );
}

export default Login;
