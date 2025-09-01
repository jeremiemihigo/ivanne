"use client";

import moment from "moment";
import React from "react";
import Header from "../Header/Header";
import Loading from "../Tools/Loading";
import Popup from "../Tools/Popup";
import Taux from "./Taux";

interface ITaux {
  taux: number;
  updateBy: string;
  updatedAt: Date;
}

function TauxEchange() {
  const [data, setData] = React.useState<ITaux>();
  const [load, setLoad] = React.useState<boolean>(false);
  const loadingData = async () => {
    try {
      setLoad(true);
      const res = await fetch("/api/taux", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setData(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    const intialize = async () => {
      await loadingData();
      setLoad(false);
    };
    intialize();
  }, []);
  return (
    <Header title="Taux de change">
      <Popup
        title="Taux de change"
        component={<Taux />}
        btnname="Mettre à jour le taux de change"
      />
      {load && <Loading />}
      <div className="flex justify-center align-center h-full">
        {data && (
          <div>
            <p
              className="p-0 m-0 "
              style={{
                fontSize: "100px",
                fontWeight: "bolder",
                color: "green",
              }}
            >
              {data?.taux} CDF
            </p>
            <p>Modifier par : {data.updateBy} </p>
            <p>
              Dernière mise à jour :{" "}
              {moment(data.updatedAt).format("dddd DD-MM-YYYY à HH:MM")}{" "}
            </p>
          </div>
        )}
      </div>
    </Header>
  );
}

export default TauxEchange;
