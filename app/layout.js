import './globals.css';

export const metadata = {
  title: 'bookmarks',
  description: 'Simple directory-style bookmark manager',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
