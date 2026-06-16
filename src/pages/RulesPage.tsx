import { Link } from "react-router-dom";

export function RulesPage() {
  return (
    <div className="page">
      <h1>Mängu reeglid</h1>
      <p>
        Igas voorus on üks mängija kuumal toolil. Kõik mängijad kirjutavad vastuse tema vaatenurgast.
        Vastused segatakse ja teised mängijad hääletavad, milline vastus on tõeline.
      </p>
      <p>
        Kuumal toolil olev mängija saab 1 punkti iga mängija eest, kes arvas tema vastuse ära.
        Õigesti arvanud mängija saab 2 punkti. Eksitava vastuse autor saab 1 punkti iga ekslikult
        antud hääle eest.
      </p>
      <p>Mäng lõppeb, kui mängija jõuab sihtskoorini (vaikimisi 21 punkti).</p>
      <Link className="btn" to="/">
        Tagasi avalehele
      </Link>
    </div>
  );
}
