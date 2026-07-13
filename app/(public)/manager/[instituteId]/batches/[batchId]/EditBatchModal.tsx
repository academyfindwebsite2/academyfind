"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Settings2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateBatch } from "../actions";

type Batch = {
  id: string;
  name: string;
  description: string | null;
  fee: number | null;
  seatsTotal: number | null;
  duration: string | null;
  timing: string | null;
  batchType: string | null;
  mode: string | null;
};

export function EditBatchModal({ instituteId, batch }: { instituteId: string; batch: Batch }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateBatch(batch.id, instituteId, formData);
      if (res?.success === false) {
        toast.error(res.message || "Failed to update batch.");
      } else {
        toast.success("Batch updated successfully!");
        setOpen(false);
      }
    } catch (err: any) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="w-4 h-4" /> Edit Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Batch Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1">
            <Label>Batch Name</Label>
            <Input name="name" defaultValue={batch.name} required placeholder="e.g. UPSC Foundation" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Fee (₹)</Label>
              <Input name="fee" type="number" defaultValue={batch.fee?.toString() || ""} placeholder="50000" />
            </div>
            <div className="space-y-1">
              <Label>Total Seats</Label>
              <Input name="seatsTotal" type="number" defaultValue={batch.seatsTotal?.toString() || ""} placeholder="60" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Duration</Label>
              <Input name="duration" defaultValue={batch.duration || ""} placeholder="6 Months" />
            </div>
            <div className="space-y-1">
              <Label>Timing</Label>
              <Input name="timing" defaultValue={batch.timing || ""} placeholder="Mon-Fri 7AM-9AM" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea name="description" defaultValue={batch.description || ""} rows={3} placeholder="Brief description of what this batch covers..." />
          </div>
          
          <Button type="submit" disabled={loading} className="w-full bg-stone-900 text-white hover:bg-stone-800">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
