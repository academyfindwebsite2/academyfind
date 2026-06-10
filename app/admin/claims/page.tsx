
import Loading from "@/components/layout/Loader";
import { getInstituteClaims, updateClaimStatus } from "@/lib/User/admin/adminClaim";
//import { useEffect, useState } from "react";

interface Claim {
  id: string;
  role: string;
  instituteId: string;
  userId: string;
  updatedAt: Date;
  status: string;
  message?: string | null;
  fullName: string;
  email: string;
  phone: string;
  institute: {
    name: string;
    phone: string | null;
    address: string;
  };
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  // Add the remaining 6 properties here if needed
}

export default async function  AdminClaimPage() {
//   const [claims, setClaims] = useState<Claim[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function getClaim() {
//       try {
//         const response = await getInstituteClaims();
//         setClaims(response?.data || []);
//       } catch (error) {
//         console.error("Failed to fetch claims:", error);
//       } finally {
//         setLoading(false);
//       }
//     }
//     getClaim();
//   }, []);

//   if (loading) {
//     return <><Loading /></>;
//   }

const response = await getInstituteClaims()
const claims = response.data;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Institute Claims Dashboard</h1>
        <p className="text-sm text-muted-foreground">Total Requests: {claims?.length}</p>
      </div>

      {claims?.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No claim requests found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-muted text-muted-foreground font-medium border-b">
              <tr>
                <th className="p-4">Institute</th>
                <th className="p-4">Claimer Details</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {claims?.map((claim: any) => (
                <tr key={claim.id} className="hover:bg-muted/50 transition-colors">
                  {/* Institute Details */}
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{claim.institute.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{claim.institute.address}</div>
                  </td>

                  {/* Claimer Details */}
                  <td className="p-4">
                    <div className="font-medium">{claim.fullName}</div>
                    <div className="text-xs text-muted-foreground">{claim.email}</div>
                    <div className="text-xs text-muted-foreground">{claim.phone}</div>
                    <span className="inline-block mt-1 text-[10px] bg-secondary px-1.5 py-0.5 rounded font-mono">
                      Role: {claim.role}
                    </span>
                  </td>

                  {/* Message */}
                  <td className="p-4 max-w-xs">
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      {claim.message || "No message provided."}
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      claim.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      claim.status === "APPROVED" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {claim.status}
                    </span>
                  </td>

                  {/* Actions Buttons */}
                  <td className="p-4 text-right">
                    {claim.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        {/* Reject Button Form */}
                        <form action={async () => {
                          "use server"
                          await updateClaimStatus(claim.id, "REJECTED")
                        }}>
                          <button className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition">
                            Reject
                          </button>
                        </form>

                        {/* Approve Button Form */}
                        <form action={async () => {
                          "use server"
                          await updateClaimStatus(claim.id, "APPROVED")
                        }}>
                          <button className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition">
                            Approve
                          </button>
                        </form>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
