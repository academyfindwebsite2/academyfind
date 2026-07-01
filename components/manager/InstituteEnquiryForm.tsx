"use client";

import { useState } from "react";
import { MapPin, IndianRupee, CheckCircle2 } from "lucide-react";
import SmartButton from "@/components/ui/SmartButton";
import { submitStudentEnquiry } from "@/lib/User/user/user-enquiry";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

type Props = {
  instituteId: string;
  feeInfo?: string | null;
  mapsUrl?: string | null;
};

export default function InstituteEnquiryForm({ instituteId, feeInfo, mapsUrl }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name,setName] = useState("");
  const [mobile,setMobile] = useState("");
  const [email,setEmail] = useState("");
  const [msg,setmsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("instituteId", instituteId);
    console.log("Button clicked")
    if(!name || !mobile){
        toast.error("Please fill name and mobile to get a callback")
        setLoading(false);
        return;
    }
    try {
      const res = await submitStudentEnquiry(formData);
      if (res.success) {
        setSuccess(true);
        toast.success("You will soon get a callback from the institute");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl border bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold">Get Admission Guidance</h3>
      <p className="mt-2 text-sm text-slate-600">
        Connect directly with the institute for admission details.
      </p>

      {feeInfo && (
        <div className="mt-4 p-3 bg-slate-50 border rounded-xl flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Fees</span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-0.5">
            <IndianRupee className="w-3.5 h-3.5" />{feeInfo}
          </span>
        </div>
      )}

      {success ? (
        <div className="mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center flex flex-col items-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
          <h4 className="font-bold text-emerald-900 text-lg">Enquiry Sent!</h4>
          <p className="text-sm text-emerald-700 mt-1">The institute will contact you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
          <input 
            required 
            name="name" 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name*" 
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300" 
          />
          <input 
            required 
            name="phone" 
            maxLength={10} 
            type="tel" 
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Mobile*" 
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300" 
          />
          <input 
            name="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (Optional)" 
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300" 
          />
          <textarea 
            name="message" 
            rows={3} 
            value={msg}
            onChange={(e) => setmsg(e.target.value)}
            placeholder="Your Query (Optional)" 
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 outline-none transition-all duration-300 resize-none"
          ></textarea>
          
          <Button disabled={loading} type="submit" className="w-full rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-white transition hover:bg-amber-500 shadow-xs cursor-pointer mt-2">
            {loading ? "Sending..." : "Get CallBack"}
          </Button>
        </form>
      )}

      {mapsUrl && (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
          <button className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer">
            <MapPin className="h-4 w-4 text-slate-400" /> View on Maps
          </button>
        </a>
      )}
    </div>
  );
}