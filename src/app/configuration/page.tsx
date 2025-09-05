"use client";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import Header from "../Header/Header";
import { IShop } from "../Interfaces/Shop";

function Configuration() {
  const [data, setData] = React.useState<IShop | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<IShop | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const loadingData = async () => {
    try {
      const res = await fetch("/api/configuration", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.status === 200) {
        setData(result.data);
        setFormData(result.data);
        if (result.data.filename) {
          setPreviewUrl(result.data.filename);
        }
      } else {
        toast(JSON.stringify(result.data));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputChange = (field: keyof IShop, value: string) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const logoData = formData?.filename || "";
      // If a new file is selected, convert it to base64 string
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          submitFormWithLogo(base64String);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        submitFormWithLogo(logoData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };
  const submitFormWithLogo = async (logoString: string) => {
    try {
      const submitData = {
        ...formData,
        filename: logoString,
      };

      const res = await fetch("/api/configuration", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });
      const result = await res.json();
      if (result.status === 200) {
        setIsEditing(false);
        setSelectedFile(null);
        toast.success("Informations mises à jour avec succès");
      } else {
        toast.error(JSON.stringify(result.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour");
    }
  };
  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
    setSelectedFile(null);
    if (data?.filename) {
      setPreviewUrl(data.filename);
    } else {
      setPreviewUrl(null);
    }
  };
  React.useEffect(() => {
    const initialize = async () => {
      await loadingData();
    };
    initialize();
  }, []);

  return (
    <Header title="Configuration">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Informations de la Pharmacie
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Modifier
            </button>
          )}
        </div>

        {data ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de la pharmacie
                      </label>
                      <input
                        type="text"
                        value={formData?.shop || ""}
                        onChange={(e) =>
                          handleInputChange("shop", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        NIF
                      </label>
                      <input
                        type="text"
                        value={formData?.nif || ""}
                        onChange={(e) =>
                          handleInputChange("nif", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        RCCM
                      </label>
                      <input
                        type="text"
                        value={formData?.rccm || ""}
                        onChange={(e) =>
                          handleInputChange("rccm", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Adresse
                      </label>
                      <textarea
                        value={formData?.adresse || ""}
                        onChange={(e) =>
                          handleInputChange("adresse", e.target.value)
                        }
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={formData?.contact || ""}
                        onChange={(e) =>
                          handleInputChange("contact", e.target.value)
                        }
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Logo de la pharmacie
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {previewUrl && (
                        <div className="mt-2">
                          <Image
                            src={previewUrl}
                            width={200}
                            height={200}
                            alt="Aperçu du logo"
                            className="h-16 w-auto object-contain border border-gray-200 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom de la pharmacie
                      </label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {data.shop}
                      </p>
                    </div>

                    {data.nif && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          NIF
                        </label>
                        <p className="mt-1 text-gray-900">{data.nif}</p>
                      </div>
                    )}

                    {data.rccm && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          RCCM
                        </label>
                        <p className="mt-1 text-gray-900">{data.rccm}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {data.adresse && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Adresse
                        </label>
                        <p className="mt-1 text-gray-900">{data.adresse}</p>
                      </div>
                    )}

                    {data.contact && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Contact
                        </label>
                        <p className="mt-1 text-gray-900">{data.contact}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {data.filename && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Logo
                        </label>
                        <div className="mt-1">
                          <Image
                            src={data.filename}
                            width={200}
                            height={200}
                            alt="Logo de la pharmacie"
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-500 text-center">
              Aucune information de pharmacie disponible
            </p>
          </div>
        )}
      </div>
    </Header>
  );
}

export default Configuration;
