"use client";

import QRCode from "react-qr-code";
import { QrCode, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InstituteQRCode({ slug }: { slug: string }) {
  const url = `https://academyfind.com/institute/${slug}`;

  const downloadQR = () => {
    const svg = document.getElementById("InstituteQRCode");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `${slug}-qr-code.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="rounded-2xl border-slate-100 p-6 flex flex-col justify-between space-y-4 shadow-sm bg-white">
      <div className="space-y-2">
        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-4">
          <QrCode className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-lg text-slate-800">Institute QR Code</h3>
        <p className="text-slate-500 text-sm leading-relaxed pb-4">
          Print this QR code for your front desk. Students can scan it to view your profile directly.
        </p>
        
        <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm mx-auto w-fit">
          <QRCode
            id="InstituteQRCode"
            value={url}
            size={120}
            level="H"
            className="rounded-lg"
          />
        </div>
      </div>
      
      <Button onClick={downloadQR} variant="outline" className="w-full justify-center mt-2 rounded-xl border-slate-200">
        <Download className="w-4 h-4 mr-2" /> Download QR
      </Button>
    </Card>
  );
}
