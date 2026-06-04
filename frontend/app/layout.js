import './globals.css';

export const metadata = {
  title: 'Support Tickets',
  description: 'Version vulnerable pour projet securite web'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

