const texto = (nodo) => nodo.value ?? (nodo.children ?? []).map(texto).join('');

/**
 * Ajustes de accesibilidad sobre el HTML del Markdown:
 * - los checkbox de `- [ ]` reciben un nombre (GFM los genera sin etiqueta);
 * - las tablas, que se desplazan en pantallas angostas, reciben foco de teclado.
 */
export function rehypeAccesible() {
  const recorrer = (nodo) => {
    if (nodo.tagName === 'li') {
      const hijos = (nodo.children ?? []).flatMap((h) => (h.tagName === 'p' ? h.children : [h]));
      const casilla = hijos.find((h) => h.tagName === 'input');
      if (casilla) casilla.properties.ariaLabel = texto(nodo).trim();
    }
    if (nodo.tagName === 'table') nodo.properties = { ...nodo.properties, tabIndex: 0 };
    nodo.children?.forEach(recorrer);
  };
  return recorrer;
}
