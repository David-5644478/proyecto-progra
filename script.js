document.addEventListener('DOMContentLoaded', () => {
    configurarMenuMovil();
    configurarBotonArriba();
    configurarFiltrosLugares();
    configurarBuscadorMenu();
    configurarGaleria();
    configurarFormulario();
});

function configurarMenuMovil() {
    const boton = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-list');

    if (!boton || !menu) return;

    boton.addEventListener('click', () => {
        const abierto = menu.classList.toggle('open');
        boton.setAttribute('aria-expanded', String(abierto));
        boton.textContent = abierto ? '✕ Cerrar menú' : '☰ Abrir menú';
    });
}

function configurarBotonArriba() {
    const boton = document.getElementById('back-top');
    if (!boton) return;

    window.addEventListener('scroll', () => {
        boton.classList.toggle('show', window.scrollY > 420);
    });

    boton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function configurarFiltrosLugares() {
    const botones = document.querySelectorAll('[data-filter]');
    const tarjetas = document.querySelectorAll('[data-category]');
    const mensaje = document.getElementById('places-empty');

    if (!botones.length || !tarjetas.length) return;

    botones.forEach((boton) => {
        boton.addEventListener('click', () => {
            const filtro = boton.dataset.filter;
            let visibles = 0;

            botones.forEach((b) => {
                b.classList.remove('active');
            });

            boton.classList.add('active');

            tarjetas.forEach((tarjeta) => {
                const categorias = tarjeta.dataset.category.split(' ');
                const mostrar =
                    filtro === 'todos' || categorias.includes(filtro);

                tarjeta.classList.toggle('is-hidden', !mostrar);

                if (mostrar) {
                    visibles += 1;
                }
            });

            if (mensaje) {
                mensaje.classList.toggle('show', visibles === 0);
            }
        });
    });
}

function configurarBuscadorMenu() {
    const buscador = document.getElementById('menu-search');
    const secciones = document.querySelectorAll('.menu-section');
    const mensaje = document.getElementById('menu-empty');

    if (!buscador || !secciones.length) return;

    buscador.addEventListener('input', () => {
        const texto = normalizar(buscador.value);
        let visibles = 0;

        secciones.forEach((seccion) => {
            const contenido = normalizar(seccion.textContent);
            const mostrar = contenido.includes(texto);

            seccion.classList.toggle('is-hidden', !mostrar);

            if (mostrar) {
                visibles += 1;
            }
        });

        if (mensaje) {
            mensaje.classList.toggle('show', visibles === 0);
        }
    });
}

function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function configurarGaleria() {
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const imagen = document.getElementById('modal-image');
    const texto = document.getElementById('modal-caption');
    const cerrar = document.getElementById('modal-close');

    if (!items.length || !modal || !imagen || !texto || !cerrar) return;

    const abrir = (item) => {
        const foto = item.querySelector('img');

        if (!foto || !foto.complete || foto.naturalWidth === 0) return;

        const caption = item.querySelector('figcaption');

        imagen.src = foto.src;
        imagen.alt = foto.alt;

        texto.textContent = caption
            ? caption.innerText.replace(/\n/g, ' — ')
            : foto.alt;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');

        document.body.style.overflow = 'hidden';
    };

    const cerrarModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');

        document.body.style.overflow = '';
    };

    items.forEach((item) => {
        item.setAttribute('tabindex', '0');

        item.addEventListener('click', () => {
            abrir(item);
        });

        item.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                abrir(item);
            }
        });
    });

    cerrar.addEventListener('click', cerrarModal);

    modal.addEventListener('click', (evento) => {
        if (evento.target === modal) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (
            evento.key === 'Escape' &&
            modal.classList.contains('open')
        ) {
            cerrarModal();
        }
    });
}

function configurarFormulario() {
    const formulario = document.getElementById('contact-form');
    const botonEnviar = document.getElementById('form-submit');
    const mensajeEstado = document.getElementById('form-feedback');

    if (!formulario || !botonEnviar || !mensajeEstado) return;

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const url = formulario.getAttribute('action') || '';

        if (!url.startsWith('https://script.google.com/macros/s/')) {
            mensajeEstado.textContent =
                'El formulario todavía no está conectado con Google Apps Script.';

            mensajeEstado.className = 'form-feedback error';
            return;
        }

        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando...';

        mensajeEstado.textContent = 'Enviando comentario...';
        mensajeEstado.className = 'form-feedback';

        try {
            const datos = new FormData(formulario);

            await fetch(url, {
                method: 'POST',
                body: datos,
                mode: 'no-cors'
            });

            mensajeEstado.textContent =
                '¡Mensaje enviado correctamente! Gracias por tu comentario.';

            mensajeEstado.className = 'form-feedback ok';

            formulario.reset();

        } catch (error) {
            console.error(error);

            mensajeEstado.textContent =
                'No se pudo enviar el mensaje. Intentá nuevamente.';

            mensajeEstado.className = 'form-feedback error';

        } finally {
            botonEnviar.disabled = false;
            botonEnviar.textContent = 'Enviar comentario';
        }
    });
}