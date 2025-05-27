import React from 'react';

export default function Footer() {
  return (
    <footer className="footer has-background-primary has-text-white-ter">
      <div className="content has-text-centered">
        <p>
          &copy; {new Date().getFullYear()} Projeto ELLP. Todos os direitos reservados.
        </p>
        <p>
          Desenvolvido por Gabriel
        </p>
      </div>
    </footer>
  );
}