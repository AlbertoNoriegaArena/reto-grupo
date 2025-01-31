$(document).ready(function () {

    let resultado = 0; 

    // Ocultar el formulario al iniciar
    $("#formulario").hide();

    // Cargar partidos al cargar la página
    cargarPartidos();

    function cargarPartidos() {
        $.get('http://localhost:1234/api/partidos', function (data) {
            $('#tabla tbody').empty(); // Limpiar la tabla antes de agregar nuevos datos

            data.forEach(function (partido) {
                let fila = `<tr data-id="${partido.id}">
                    <td>${partido.nombre}</td>
                    <td>${partido.descripcion}</td>
                    <td>${partido.deporte}</td>
                    <td>${partido.resultado}</td>
                    <td>${partido.apuesta}</td>
                    <td>
                        <button type="button" class="editarPartido" data-id="${partido.id}">Ver</button>
                        <button type="button" class="borrarPartido" data-id="${partido.id}">Borrar</button>
                    </td>
                </tr>`;

                $('#tabla tbody').append(fila);
            });
        });
    }

    // Botón "Crear Partido" muestra el formulario
    $('#btnNuevo').click(function () {
        limpiarFormulario();
        $('.botonesGanaPierde').addClass('oculto');
        $("#formTitulo").text("Crear Partido");
        $("#formulario").slideDown(); // Mostrar formulario con animación
    });

    // Guardar o modificar un partido
    $('#guardar').click(function (event) {
        event.preventDefault();

        let id = $('#partidoId').val();
        let resultado = $('#resultado').val();
        let apuesta = $('#apuesta').val();

        // Validaciones
        if (resultado < -1 || resultado > 1) {
            alert("El resultado solo puede ser -1, 0 o 1.");
            return;
        }
        if (apuesta < 0) {
            alert("La apuesta debe ser un número positivo.");
            return;
        }

        let partido = {
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
            deporte: $('#deporte').val(),
            resultado: resultado,
            apuesta: apuesta
        };

        if (id) {
            // Modificar partido (PUT)
            $.ajax({
                url: `http://localhost:1234/api/partidos/${id}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(partido),
                success: function () {
                    alert('Partido modificado correctamente');
                    limpiarFormulario();
                    cargarPartidos();
                }
            });
        } else {
            // Crear partido (POST)
            $.ajax({
                url: 'http://localhost:1234/api/partidos',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(partido),
                success: function () {
                    alert('Partido agregado correctamente');
                    limpiarFormulario();
                    cargarPartidos();
                }
            });
        }
    });

    // Borrar partido (DELETE)
    $(document).on('click', '.borrarPartido', function () {
        let id = $(this).data('id');

        if (confirm('¿Seguro que quieres eliminar este partido?')) {
            $.ajax({
                url: `http://localhost:1234/api/partidos/${id}`,
                type: 'DELETE',
                success: function () {
                    alert('Partido eliminado');
                    cargarPartidos();
                }
            });
        }
    });

    // Editar partido (cargar datos en el formulario)
    $(document).on('click', '.editarPartido', function () {
        let id = $(this).data('id');

        $.get(`http://localhost:1234/api/partidos/${id}`, function (data) {
            $('#partidoId').val(data.id);
            $('#nombre').val(data.nombre);
            $('#descripcion').val(data.descripcion);
            $('#deporte').val(data.deporte);
            $('#resultado').val(data.resultado);
            $('#apuesta').val(data.apuesta);

            resultado = parseInt(data.resultado); 

            $('.botonesGanaPierde').removeClass('oculto');
            $('#formTitulo').text('Editar ' + data.nombre);
            $("#formulario").slideDown(); // Mostrar formulario con animación
        });

        // Botón "Gana"
        $("#gana").click(function () {
            if (resultado < 1) {
                resultado++;
                actualizarResultado();
            } else {
                alert("El resultado no puede ser mayor que 1");
            }
        });

        // Botón "Pierde"
        $("#pierde").click(function () {
            if (resultado > -1) {
                resultado--;
                actualizarResultado();
            } else {
                alert("El resultado no puede ser menor que -1");
            }
        });

        // Actualizar el resultado en el formulario
        function actualizarResultado() {
            console.log("Resultado actualizado:", resultado); 
            $("#resultado").val(resultado); 
        }
    });

    // Cancelar edición o creación
    $('#cancelar').click(function () {
        limpiarFormulario();
    });

    // Función para limpiar el formulario y ocultarlo
    function limpiarFormulario() {
        $('#formTitulo').text('Crear Partido');
        $('#partidoId').val('');
        $('#nombre, #descripcion, #deporte, #resultado, #apuesta').val('');
        $("#formulario").slideUp(); // Ocultar formulario con animación
    }

});