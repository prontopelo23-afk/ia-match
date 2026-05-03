import React from 'react';

function Routes() {
  return (
    <div>
      <nav>
        <a href="/">Accueil</a>
        <a href="/match">Match</a>
        <a href="/categories">Catégories</a>
        <a href="/actu">Actu</a>
        <a href="/profil">Profil</a>
        <a href="/builder" style={{ display: "none" }}>Builder</a>
      </nav>
    </div>
  );
}

export default Routes;