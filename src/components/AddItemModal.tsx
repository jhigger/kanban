import { type UniqueIdentifier } from "@dnd-kit/core";
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
  currentContainerId: UniqueIdentifier;
};

const AddItemModal = ({
  containers,
  setContainers,
  currentContainerId,
}: AddContainerModalProps) => {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const handleAddItem = () => {
    if (!itemName) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);

    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });

    setContainers([...containers]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
          <DialogDescription>
            Add a new item to &quot;
            {containers.find((item) => item.id === currentContainerId)?.title}
            &quot; container
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
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddItem}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
