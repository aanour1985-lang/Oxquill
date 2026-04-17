export const metadata = {
  title: "OxQuill — Every Writer Deserves a Superbrain",
  description:
    "AI writing tool that crafts brilliant content in seconds. 29 languages, 31 historical eras, 10 AI tools. Built for writers who demand more.",
  keywords: [
    "AI writing",
    "content generator",
    "OxQuill",
    "AI content",
    "writing assistant",
    "Arabic AI",
  ],
  metadataBase: new URL("https://oxquill.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://oxquill.com",
    siteName: "OxQuill",
    title: "OxQuill — Every Writer Deserves a Superbrain",
    description:
      "AI writing tool that crafts brilliant content in seconds. 29 languages, 31 historical eras, 10 AI tools.",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "OxQuill — Every Writer Deserves a Superbrain",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OxQuill — Every Writer Deserves a Superbrain",
    description:
      "AI writing tool that crafts brilliant content in seconds. 29 languages, 31 historical eras.",
    images: ["/og-banner.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
