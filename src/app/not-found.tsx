import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <h1>404 — Not Found</h1>
        <Link href="/tr">Ana sayfaya dön</Link>
      </body>
    </html>
  );
}
