import { actualizar, ahora, instantanea, suscribir } from './almacen';

type Mapa = 'checklists' | 'roadmap';

/** Activa los checkbox estáticos y los sincroniza con el almacén. Devuelve la función para desconectarlos. */
export function enlazarCasillas(casillas: HTMLInputElement[], mapa: Mapa, claveDe: (c: HTMLInputElement) => string) {
  const pintar = () => {
    const doc = instantanea();
    for (const c of casillas) c.checked = Boolean(doc[mapa][claveDe(c)]?.hecho);
  };
  const alCambiar = (e: Event) => {
    const c = e.currentTarget as HTMLInputElement;
    try {
      actualizar((doc) => {
        doc[mapa][claveDe(c)] = { hecho: c.checked, actualizado: ahora() };
      });
    } catch {
      c.checked = !c.checked; // No se guardó: la casilla vuelve a mostrar lo que hay guardado.
    }
  };
  for (const c of casillas) {
    c.disabled = false;
    c.addEventListener('change', alCambiar);
  }
  pintar();
  const desuscribir = suscribir(pintar);
  return () => {
    desuscribir();
    for (const c of casillas) c.removeEventListener('change', alCambiar);
  };
}
