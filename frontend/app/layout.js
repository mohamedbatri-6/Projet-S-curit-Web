import './globals.css';

export const metadata = {
  title: 'Support Tickets',
  description: 'Version securisee pour projet securite web'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
