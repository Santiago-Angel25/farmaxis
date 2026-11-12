import { Link } from "react-router-dom";

const helpPages = {
  faq: { eyebrow: "AYUDA", title: "Preguntas frecuentes", intro: "Encuentra respuestas rápidas sobre tus compras, pedidos y productos en Farmaxis.", sections: [["¿Cómo realizo una compra?", "Busca el producto que necesitas, agrégalo al carrito y revisa el resumen antes de finalizar tu compra."], ["¿Cómo sé si mi pedido fue registrado?", "Al finalizar recibirás una confirmación en pantalla y podrás consultar o descargar la factura de tu compra."], ["¿Puedo cambiar la cantidad de un producto?", "Sí. Desde el carrito puedes aumentar, disminuir o eliminar productos antes de finalizar la compra."], ["¿Dónde puedo ver el costo del envío?", "El valor y las condiciones de envío se confirman durante el proceso de compra, según la dirección de entrega."]] },
  shipping: { eyebrow: "AYUDA", title: "Envíos y entregas", intro: "Te acompañamos para que recibas tu pedido de manera clara y segura.", sections: [["Confirmación del envío", "Al finalizar tu compra confirmaremos la disponibilidad, el valor del envío y la información de entrega de tu pedido."], ["Dirección de entrega", "Verifica que los datos de contacto y la dirección estén completos. Esto nos ayuda a coordinar la entrega correctamente."], ["Seguimiento del pedido", "Conserva tu factura y los datos de confirmación. Nuestro equipo podrá ayudarte a consultar el estado de tu compra."], ["Productos con condiciones especiales", "Algunos productos pueden requerir cuidados adicionales durante el transporte. Te informaremos cualquier condición aplicable antes del despacho."]] },
  terms: { eyebrow: "INFORMACIÓN LEGAL", title: "Términos y privacidad", intro: "Queremos que compres con tranquilidad y que sepas cómo tratamos tu información.", sections: [["Uso del sitio", "Al usar Farmaxis aceptas utilizar la información y los servicios del sitio de manera responsable y conforme a la normativa aplicable."], ["Información de la compra", "Usamos los datos necesarios para procesar tu pedido, emitir la factura, coordinar la entrega y brindarte atención relacionada con tu compra."], ["Protección de datos", "Protegemos tu información personal y no la compartimos para fines ajenos a la gestión de tu compra, salvo cuando sea requerido para prestarte el servicio o por ley."], ["Actualizaciones", "Podemos actualizar estos términos para mejorar el servicio. Las modificaciones estarán disponibles en esta misma sección."]] },
};

function NotFound({ page }) {
  const content = helpPages[page];
  if (content) return <section className="help-page" aria-labelledby="help-page-title"><header className="help-page__hero"><p>{content.eyebrow}</p><h1 id="help-page-title">{content.title}</h1><span>{content.intro}</span></header><div className="help-page__content"><div className="help-page__cards">{content.sections.map(([heading, body]) => <article className="help-page__card" key={heading}><h2>{heading}</h2><p>{body}</p></article>)}</div><aside className="help-page__contact"><h2>¿Necesitas más ayuda?</h2><p>Comunícate con nuestra línea de atención o escríbenos para orientarte con tu compra.</p><a href="tel:+573000000000">+57 300 000 0000</a><a href="mailto:contacto@farmaxis.co">contacto@farmaxis.co</a><Link to="/">Volver al inicio</Link></aside></div></section>;
  return (
    <section className="route-not-found">
      <h1>Página no encontrada</h1>
      <p>La página que buscas todavía no está disponible.</p>
    </section>
  );
}

export default NotFound;
