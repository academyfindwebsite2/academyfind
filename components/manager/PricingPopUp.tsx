// "use client";

// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import Link from "next/link";

// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogDescription,
//   DialogHeader
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";
// import { Sparkles, ArrowRight } from "lucide-react";

// import { authClient } from "@/lib/auth/auth-client";

// export function AuthPromptModal() {
//   const pathname = usePathname();
//   const { data: session } = authClient.useSession();
//   const [open, setOpen] = useState(false);

//   const [isAnnual, setIsAnnual] = useState(false);
//     const [plan,setPlan] = useState();

//     const planPriority: Record<string, number> = {
//         BASIC: 0,
//         VERIFIED: 1,
//         PREMIUM: 2,
//         ULTRA: 3,
//     };
//     const currentPlanRank = planPriority[currentPlan] ?? 0;

//     const plans = [
//         { 
//             id: "VERIFIED", 
//             name: "Verified", 
//             pricing: {
//                 monthly: { original: 499, offer: 199 },
//                 annual: { original: 4999, offer: 1999 }
//             },
//             desc: "Build trust and start capturing student leads.", 
//             features: [
//                 "Edit Your Profile", 
//                 "Verified Badge", 
//                 "Direct Lead Generation"
//             ] 
//         },
//         { 
//             id: "PREMIUM", 
//             name: "Premium", 
//             pricing: {
//                 monthly: { original: 999, offer: 499 },
//                 annual: { original: 9999, offer: 4999 }
//             },
//             desc: "Showcase faculty, results, and track analytics.", 
//             features: [
//                 "Everything in Verified", 
//                 "Visit & Save Analytics", 
//                 "Teacher Profiles (Up to 4)", 
//                 "Videos & Results (Up to 4)"
//             ] 
//         },
//         { 
//             id: "ULTRA",
//             name: "Elite", 
//             pricing: {
//                 monthly: { original: 2999, offer: 999 },
//                 annual: { original: 29999, offer: 9999 }
//             },
//             desc: "Maximum visibility and top search rankings.", 
//             features: [
//                 "Everything in Premium", 
//                 "Top Priority Search Ranking", 
//                 "Area-Specific Visibility", 
//                 "Category-Specific Visibility"
//             ] 
//         },
//     ];

//   useEffect(() => {
//     if (session?.user) {
//       setOpen(false);
//       return;
//     }
//   },[])



//   if (!session?.user) return <>Please Login to see pricing</>;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-md rounded-3xl border-0 p-0 overflow-hidden">
        
//         {/* 🚀 FIX: Isko 'sr-only' de diya taaki Accessibility Warning na aaye aur HTML invalid na ho */}
//         <DialogHeader className="sr-only">
//           <DialogTitle></DialogTitle>
//           <DialogDescription>
//             Create your free account to save institutes, compare coaching centers, write reviews, and get personalized recommendations.
//           </DialogDescription>
//         </DialogHeader>

//         {/* 🎨 Aapka Beautiful Visual UI */}
//         <div className="bg-linear-to-br from-amber-50 via-white to-orange-50 p-8">
//           <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
//             <Sparkles className="h-7 w-7 text-amber-600" />
//           </div>

//           <h2 className="text-center text-2xl font-bold text-slate-900">
//             Want to Explore More?
//           </h2>

//           <p className="mt-3 text-center text-sm text-zinc-600">
//             Create your free account to save institutes,
//             compare coaching centers, write reviews,
//             and get personalized recommendations.
//           </p>

//           <div className="mt-6 flex flex-col gap-3">
//             {/* Added onClick to close modal instantly when navigating */}
//             <Link href="/register" onClick={() => setOpen(false)}>
//               <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold">
//                 Create Free Account
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </Link>

//             <Link href="/login" onClick={() => setOpen(false)}>
//               <Button
//                 variant="outline"
//                 className="w-full font-semibold"
//               >
//                 Login
//               </Button>
//             </Link>
//           </div>

//           <p className="mt-5 text-center text-xs text-zinc-500">
//             Join thousands of students discovering the
//             best coaching institutes.
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }