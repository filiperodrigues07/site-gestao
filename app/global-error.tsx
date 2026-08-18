"use client";

// Substitui o layout raiz inteiro se ELE MESMO quebrar (caso raríssimo) —
// por isso não depende de ThemeProvider, fontes ou outros componentes do
// app, e precisa renderizar <html>/<body> própios.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          color: "#0a0a0b",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 0.75rem" }}>Algo deu errado</h1>
          <p style={{ color: "#6b6f76", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
            Encontramos um erro inesperado carregando o site. Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              background: "#049dd4",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "0.6rem 1.25rem",
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
