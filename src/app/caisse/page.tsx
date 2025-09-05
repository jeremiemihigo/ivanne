"use client";
import React from "react";
import Header from "../Header/Header";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import AjoutezCaisse from "./AjoutezCaisse";

interface ICaisse {
  actif: boolean;
  agent: string;
  designation: string;
  updatedAt: string;
  idCaisse: string;
}

function Caisse() {
  const [data, setData] = React.useState<ICaisse[]>([]);
  const [load, setLoad] = React.useState<boolean>(true);
  const loadingData = async () => {
    const result = await fetch("/api/caisse", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await result.json();

    if (result.status === 200) {
      setData(response.data);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
      setLoad(false);
    };
    initialize();
  }, []);
  return (
    <Header title="Caisse">
      {load ? (
        <Loading />
      ) : (
        <>
          <Popup
            title="Ajoutez une caisse"
            description=""
            component={<AjoutezCaisse />}
            btnname="Ajoutez une caisse"
          />
          <div></div>
        </>
      )}
    </Header>
  );
}

export default Caisse;
