import { auth } from "@/auth/auth";
import { redirect } from "next/navigation"

export default async function AuthLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const session = await auth()

   if (session) {
      return redirect("/Dashboard")
   }
   return (
      <main>
         <div className="h-screen flex flex-col items-center justify-center">
            {children}
         </div>
      </main>
   );
}