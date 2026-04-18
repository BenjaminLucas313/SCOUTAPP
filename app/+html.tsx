import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* Polyfill Node.js globals que algunos paquetes usan pero el browser no tiene */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window.__dirname === 'undefined') window.__dirname = '/';
              if (typeof window.__filename === 'undefined') window.__filename = '';
              if (typeof window.global === 'undefined') window.global = window;
              if (typeof window.process === 'undefined') window.process = { env: {} };
            `,
          }}
        />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
