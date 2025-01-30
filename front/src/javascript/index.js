$(document).ready(function () {

    // Solicitud GET para obtener los productos
    $.get('http://localhost:1234/api/partidos', function (data) {
        // Llenar la tabla con los datos obtenidos
        data.forEach(function (partido) {

            let fila = `<tr>
            <td>${partido.nombre}</td>
            <td>${partido.descripcion}</td>
            <td>${partido.deporte}</td>
            <td>${partido.resultado}</td>
            <td>${partido.apuesta}</td>
            </tr>`;

            $('#tabla tbody').append(fila);
        });
    });
});