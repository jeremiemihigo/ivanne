"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "../../Header/Header";
import { ICaisse } from "../../Interfaces/ICaisse";
import Loading from "../../Tools/Loading";
import Popup from "../../Tools/Popup";
import AjoutezCaisse from "./AjoutezCaisse";
import Fermeture from "./Fermeture";
import Ouverture from "./Ouverture";

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
  const router = useRouter();
  const readIdCaisse = (row: ICaisse) => {
    router.push(`/detail_caisse/${row.idCaisse}`);
  };
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
          <div className="mt-4 space-y-2">
            {data.length === 0 ? (
              <p>Aucune caisse trouvée.</p>
            ) : (
              data.map((caisse) => (
                <div
                  key={caisse.idCaisse}
                  onClick={() => readIdCaisse(caisse)}
                  className="flex cursor-pointer items-center justify-between gap-4 p-4 border rounded-lg shadow-sm bg-white"
                >
                  <div>
                    <h2 className="font-semibold text-lg">
                      {caisse.designation}
                    </h2>
                    <p>👤 Responsable : {caisse.agent}</p>
                    <p>📅 Dernière mise à jour : {caisse.updatedAt}</p>
                    <p>
                      Caisse
                      <span
                        className={
                          caisse.statut === "Ouvert"
                            ? "text-green-600 font-extrabold"
                            : "text-red-600 font-extrabold"
                        }
                      >
                        {" " + caisse.statut.toLowerCase()}
                      </span>
                    </p>
                  </div>
                  <div className="gap-3">
                    <Popup
                      title={
                        caisse.statut === "Fermer"
                          ? `Ouverture ${caisse.designation}`
                          : `Fermeture ${caisse.designation}`
                      }
                      description=""
                      component={
                        caisse.statut === "Fermer" ? (
                          <Ouverture />
                        ) : (
                          <Fermeture />
                        )
                      }
                      btnname={
                        caisse.statut === "Fermer" ? "Ouverture" : "Fermeture"
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Header>
  );
}

export default Caisse;
