import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, MessageSquareQuote } from "lucide-react";

export default async function ContactMessageDetail({ params }: { params: Promise<{ messageId: string }> }) {
    const {messageId} = await params;

    const message = await prisma.contactMessage.findUnique({
        where: { id: messageId }
    });

    if (!message) notFound();

    if (!message.isRead) {
        await prisma.contactMessage.update({
            where: { id: messageId },
            data: { isRead: true }
        });
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans animate-in fade-in duration-300">
            
            {/* Back Button */}
            <Link href="/af-ass-manage/contactmessages" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Inbox
            </Link>

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                
                {/* Email Header Style */}
                <div className="bg-slate-50 p-6 md:p-8 border-b border-slate-200">
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-6">
                        {message.subject || "(No Subject Provided)"}
                    </h1>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                                {message.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-slate-800 text-lg leading-tight">{message.name}</div>
                                <div className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                    <Mail className="w-3.5 h-3.5" /> 
                                    <a href={`mailto:${message.email}`} className="hover:text-blue-600 hover:underline">{message.email}</a>
                                </div>
                            </div>
                        </div>

                        <div className="text-left sm:text-right text-sm text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                            <div className="flex items-center sm:justify-end gap-1.5 font-medium text-slate-700">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {format(new Date(message.createdAt), "MMMM dd, yyyy")}
                            </div>
                            <div className="mt-0.5 text-xs">
                                {format(new Date(message.createdAt), "hh:mm a")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional Phone Number Strip */}
                {message.phone && (
                    <div className="bg-blue-50/50 px-6 py-3 border-b border-slate-100 flex items-center gap-2 text-sm text-slate-700">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <strong>Phone Number Provided:</strong> 
                        <a href={`tel:${message.phone}`} className="text-blue-600 hover:underline font-mono">{message.phone}</a>
                    </div>
                )}

                {/* Message Body */}
                <div className="p-6 md:p-8">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                        <MessageSquareQuote className="w-4 h-4" /> User Message
                    </div>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {message.message}
                    </div>
                </div>

                {/* Action Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
                    <a 
                        href={`mailto:${message.email}?subject=Reply to: ${message.subject || 'Your Inquiry on AcademyFind'}`}
                        className="inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        <Mail className="w-4 h-4 mr-2" /> Reply via Email
                    </a>
                </div>
            </div>

        </div>
    );
}