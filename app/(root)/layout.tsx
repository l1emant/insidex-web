import Header from "@/components/Header";
import {getAuth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children : React.ReactNode }) => {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() });

        if(!session?.user) redirect('/sign-in');

        const user = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
        }

        return (
            <main className="min-h-screen text-gray-400">
                <Header user={user} />

                <div className="container py-10">
                    {children}
                </div>
            </main>
        )
    } catch (error) {
        console.error('Layout error:', error);
        // Redirect to sign-in if there's an auth error
        redirect('/sign-in');
    }
}
export default Layout
