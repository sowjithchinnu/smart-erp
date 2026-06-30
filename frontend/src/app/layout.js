import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CompanyProvider } from "../context/CompanyContext";
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CompanyProvider>
                        {children}
                    </CompanyProvider>
                </AuthProvider>
            </body>
        </html>
    );
}