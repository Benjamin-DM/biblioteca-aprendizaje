const texto = (nodo) => nodo.value ?? (nodo.children ?? []).map(texto).join('');

/** Da nombre accesible a los checkbox de `- [ ]`: GFM los genera sin etiqueta. */
export function rehypeChecklist() {
  const recorrer = (nodo) => {
    if (nodo.tagName === 'li') {
      const hijos = (nodo.children ?? []).flatMap((h) => (h.tagName === 'p' ? h.children : [h]));
      const casilla = hijos.find((h) => h.tagName === 'input');
      if (casilla) casilla.properties.ariaLabel = texto(nodo).trim();
    }
    nodo.children?.forEach(recorrer);
  };
  return recorrer;
}
