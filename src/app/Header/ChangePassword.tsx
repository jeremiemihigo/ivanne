"use client";
import ResetPassword from "@/components/ResetPassword";
function ChangePassword() {
  return (
    <form>
      <div>
        <p className="mb-5 text-justify">
          Pour des raisons de sécurité, vous devez changer votre mot de passe
          par défaut. Un mot de passe personnalisé vous permettra de protéger
          votre compte et vos données de manière plus sécurisée. Veuillez
          choisir un mot de passe fort et unique.
        </p>
      </div>
      <div className="grid gap-4">
        <ResetPassword />
      </div>
    </form>
  );
}

export default ChangePassword;
