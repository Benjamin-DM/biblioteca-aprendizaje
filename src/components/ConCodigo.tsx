/** Muestra el texto con los tramos entre comillas invertidas como código. */
export default function ConCodigo({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('`').map((parte, i) => (i % 2 === 1 ? <code key={i}>{parte}</code> : parte))}
    </>
  );
}
