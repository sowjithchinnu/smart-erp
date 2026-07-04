import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CompanyProvider } from "../context/CompanyContext";
import KeyboardShortcutsProvider from "../components/global/KeyboardShortcutsProvider";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <KeyboardShortcutsProvider />
                <AuthProvider>
                    <CompanyProvider>
                        {children}
                    </CompanyProvider>
                </AuthProvider>
            </body>
        </html>
    );
}