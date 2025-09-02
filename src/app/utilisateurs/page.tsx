"use client";

import Header from "../Header/Header";
import TableUnite from "./unite/Table";
import Utilisateurs from "./utilisateur/page";

function Utilisateur() {
  return (
    <Header title="Parametrage">
      <div className="flex gap-3">
        <div style={{ width: "50%" }}>
          <Utilisateurs />
        </div>
        <div style={{ width: "50%" }}>
          <TableUnite />
        </div>
      </div>
    </Header>
  );
}

export default Utilisateur;
