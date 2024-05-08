import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { type DNDType } from "~/pages";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type AddContainerModalProps = {
  containers: DNDType[];
  setContainers: (value: DNDType[]) => void;
};

const AddContainerModal = ({
  containers,
  setContainers,
}: AddContainerModalProps) => {
  const [open, setOpen] = useState(false);
  const [containerName, setContainerName] = useState("");
  const [containerDescription, setContainerDescription] = useState("");

  const handleAddContainer = () => {
    if (!containerName) return;
    const id = `container-${uuidv4()}`;

    setContainers([
      ...containers,
      {
        id,
        title: containerName,
        description: containerDescription,
        items: [],
      },
    ]);

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add Container</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Container</DialogTitle>
          <DialogDescription>
            Add a new column to your kanban board
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="username"
              className="col-span-3"
              value={containerDescription}
              onChange={(e) => setContainerDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddContainer}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddContainerModal;
