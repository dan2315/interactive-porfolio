import style from './AdminLoginPage.module.css'
import { useState } from "react";
import { useAdminStore } from "../stores/AdminStore";

function AdminLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState(null);
  const login = useAdminStore((s) => s.login);

  const handleLogin = async () => {
    const valid = await login(key);
    console.log(valid)
    if (!valid) setError("Invalid API key");
  };

  return (
    <div className={style.container}>
      <h3>Restricted Section</h3>
      <input
        type="password"
        placeholder="Enter admin API key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <button onClick={handleLogin}>Enter</button>
      {error && <p style={{ color: "darkred" }}>{error}</p>}
    </div>
  );
}

export default AdminLoginPage;