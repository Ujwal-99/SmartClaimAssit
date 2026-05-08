import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.com$/i;

    if (!emailPattern.test(email)) {
      alert("Enter valid email (example@gmail.com)");
      return;
    }

    setLoading(true);

    try {

      // GET USER FROM LOCAL STORAGE
      const savedUser = localStorage.getItem(email);

      if (!savedUser) {

        alert("User not found");
        setLoading(false);
        return;

      }

      const userData = JSON.parse(savedUser);

      // CHECK PASSWORD
      if (userData.password !== password) {

        alert("Invalid password");
        setLoading(false);
        return;

      }

      // SAVE LOGIN SESSION
      localStorage.setItem("currentUser", email);

      alert("Login Successful");

      navigate("/dashboard");

    } 
    catch (error) {

      console.error("Login error:", error);

      alert("Login failed");

    }

    setLoading(false);

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)"
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          width: "320px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >

        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "600"
          }}
        >
          Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email (example@gmail.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px"
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2563eb",
              fontWeight: "500",
              textDecoration: "none"
            }}
          >
            Register
          </Link>
        </p>

      </form>

    </div>

  );

}
}
