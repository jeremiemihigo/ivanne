import { CheckCircle, XCircle } from "lucide-react";

type AlertProps = {
  type: "success" | "error";
  message: string;
};

export default function Alert({ type, message }: AlertProps) {
  const styles =
    type === "success"
      ? "bg-green-50 border-green-400 text-green-700"
      : "bg-red-50 border-red-400 text-red-700";

  const Icon = type === "success" ? CheckCircle : XCircle;

  return (
    <div
      className={`flex items-center gap-2 p-3 border rounded-lg shadow-sm ${styles} animate-fade-in`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
