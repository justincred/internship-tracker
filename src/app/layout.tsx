export const metadata = {
    title: "Internship tracker",
    description: "Your internship tracker",
};
console.log("Next.js server starting...");
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-claude">{children}</body>
        </html>
    );
}
