import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <div className="page">
      <h1>Kuum Tool</h1>
      <p>Mäng, kus kõik vastavad sinu eest.</p>
      <Link className="btn" to="/loo">
        Loo mäng
      </Link>
      <Link className="btn btn-secondary" to="/liitu">
        Liitu mänguga
      </Link>
      <Link className="btn btn-secondary" to="/reeglid">
        Vaata reegleid
      </Link>
    </div>
  );
}
