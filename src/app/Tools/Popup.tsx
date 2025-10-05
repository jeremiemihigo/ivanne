import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type Props = {
  title: string;
  btnname: string | ReactNode;
  description?: string;
  component: ReactNode;
};

export default function Popup({
  title,
  description,
  component,
  btnname,
}: Props) {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default">{btnname}</Button>
        </DialogTrigger>
        <DialogContent className="sm:min-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div>{component}</div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
