export const metadata = {
  title: "Oxquill - AI-Powered Content Engine",
  description: "Write brilliant content with AI. 28 languages, credits system, world-first tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
