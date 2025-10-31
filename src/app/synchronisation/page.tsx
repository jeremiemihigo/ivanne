"use client";
import Header from "@/app/Header/Header";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Backpack } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { lien } from "../Tools/Lien";

function Push() {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);

  const loadingMessages = [
    "Connexion au serveur...",
    "Préparation des données...",
    "Envoi des fichiers...",
    "Vérification de l'intégrité...",
    "Finalisation...",
    "Presque terminé...",
    "Dernière étape...",
    "Sauvegarde terminée !",
  ];

  useEffect(() => {
    // Set initial online status after component mounts
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showLoader) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) =>
          prevIndex < loadingMessages.length - 1 ? prevIndex + 1 : prevIndex
        );
      }, 1000);
    } else {
      setLoadingMessageIndex(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showLoader, loadingMessages.length]);

  const PushData = async (id: string) => {
    try {
      setSending(true);
      setShowLoader(true);
      setLoadingMessageIndex(0);
      const response = await axios.get(`${lien}/${id}`);
      if (response.status === 200) {
        setTimeout(() => {
          setSending(false);
          setShowLoader(false);
          setLoadingMessageIndex(0);
        }, 3000);
        toast("Synchronisation effectuée avec succès");
      } else {
        toast(JSON.stringify(response.data));
        setSending(false);
        setShowLoader(false);
      }
    } catch (error) {
      console.log(error);
      setSending(false);
      setShowLoader(false);
      setLoadingMessageIndex(0);
    }
  };

  // Loader plein écran
  if (showLoader) {
    return (
      <div className="fixed inset-0 bg-green bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p className="text-lg font-semibold text-gray-700">
            {loadingMessages[loadingMessageIndex]}
          </p>
          <p className="text-sm text-gray-500">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  return (
    <Header title="Synchronisation">
      <div className="text-center mt-4 mb-6 max-w-2xl mx-auto"></div>

      <div className="flex justify-center items-center min-h-[60vh] gap-2">
        <div className="space-y-8">
          <div className="text-center">
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-700 text-lg leading-relaxed">
                Le bouton <strong>Backup</strong> permet de sauvegarder vos
                données locales vers un serveur distant. Cela garantit la
                sécurité de vos informations en créant une copie de sauvegarde
                accessible depuis n&apos;importe où.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={() => PushData("backup")}
                disabled={sending || !isOnline}
                className="flex items-center space-x-3 px-12 py-4 text-xl font-semibold"
                size="lg"
              >
                {sending && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                )}
                <Backpack />
                <span>
                  {sending ? "Sauvegarde en cours..." : "Synchronisation"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
}

export default Push;
