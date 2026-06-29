import { Lock } from "lucide-react"; 
import { Button } from "@/components/ui/button"; // Correct path as per your project
import Link from "next/link";

export const LockedOverlay = ({ title, instituteId, slug }: { title: string, instituteId: string, slug: string }) => (
  // z-30 aur backdrop-blur-md ensure karega ki ye top par rahe aur mast blur de
  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/50 p-6 text-center">
    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-200">
      <Lock className="w-6 h-6 text-slate-400" />
    </div>
    <h4 className="text-xl font-bold text-slate-800">{title} Locked</h4>
    <p className="text-sm text-slate-600 mt-2 max-w-sm">
      This feature is available for Premium Institutes. If you are the owner of this institute, claim or upgrade the institute profile to showcase this section to students.
    </p>
    <Link href={`/institute/${instituteId}-${slug}/claim`}>
      <Button className="mt-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 font-bold shadow-md transition-all">
        Unlock Feature
      </Button>
    </Link>
  </div>
);