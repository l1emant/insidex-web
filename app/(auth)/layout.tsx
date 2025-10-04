import Image from "next/image";
import InsideXLogo from "@/components/InsideXLogo";
import {getAuth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

export const dynamic = 'force-dynamic';

const Layout = async ({ children }: { children : React.ReactNode }) => {
    try {
        const auth = await getAuth();
        const session = await auth.api.getSession({ headers: await headers() })

        if(session?.user) redirect('/')

        return (
            <main className="auth-layout">
                <section className="auth-left-section scrollbar-hide-default">
                    <div className="auth-logo">
                        <InsideXLogo />
                    </div>

                    <div className="pb-6 lg:pb-8 flex-1">{children}</div>
                </section>

                <section className="auth-right-section">
                    <div className="flex-1 relative">
                        <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
                    </div>
                </section>
            </main>
        )
    } catch (error) {
        console.error('Auth layout error:', error);
        // Show auth layout even if there's an error
        return (
            <main className="auth-layout">
                <section className="auth-left-section scrollbar-hide-default">
                    <div className="auth-logo">
                        <InsideXLogo />
                    </div>

                    <div className="pb-6 lg:pb-8 flex-1">{children}</div>
                </section>

                <section className="auth-right-section">
                    <div className="flex-1 relative">
                        <Image src="/assets/images/dashboard.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0" />
                    </div>
                </section>
            </main>
        )
    }
}
export default Layout
