/* Codigo para crear la tabla */
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const sq = 20;
const filas = 20;
const columnas = 10;
const vacio = "white";

let tabla = [];
for (let r = 0; r < filas; r++) 
{
    tabla[r] = [];
    for (let c = 0; c < columnas; c++) 
    {
        tabla[r][c] = vacio;
    }
}
dibujarTabla();
// hasta aca dibujamos la tabla

let txtPuntos = document.getElementById("puntos");
let puntos = 0;
txtPuntos.innerHTML = "Puntos: " + puntos;

let gameOver = false;
let p = generarPieza();
// instanciamos una pieza

let tirar = Date.now();
Tirar();
// hacemos que caiga

/* Objeto Pieza y funciones */
function Pieza(tetromino, color)
{
    this.tetromino = tetromino;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.color = color;
    this.x = 3;
    this.y = -2;
    /* Coordenadas del cuadradro */
    for (let r = 0; r < this.activeTetromino.length; r++) 
    {
        for (let c = 0; c < this.activeTetromino.length; c++)
        {
            if (this.activeTetromino[r][c] == 1) 
            {
                dibujarCuadrado(this.x + c,this.y + r, this.color);
            }
        }
    }
}

Pieza.prototype.llenar = function(color)
{
    for (let r = 0; r < this.activeTetromino.length; r++) 
    {
        for (let c = 0; c < this.activeTetromino.length; c++)
        {
            if (this.activeTetromino[r][c] == 1) 
            {
                dibujarCuadrado(this.x + c,this.y + r, color);
            }
        }
    }
}
Pieza.prototype.dibujar = function()
{
    this.llenar(this.color);
}
Pieza.prototype.desDibujar = function()
{
    this.llenar(vacio);
}

Pieza.prototype.moverAbajo = function()
{
    if (this.colision(0, 1, this.activeTetromino) == false)
    {
        this.desDibujar();
        this.y++;
        this.dibujar();
    }
    else
    {
        this.bloquear();
        p = generarPieza();
    }
}
Pieza.prototype.moverIzquierda = function()
{
    if (this.colision(-1, 0, this.activeTetromino) == false)
    {
        this.desDibujar();
        this.x--;
        this.dibujar();
    }
}
Pieza.prototype.moverDerecha = function()
{
    if (this.colision(1, 0, this.activeTetromino) == false)
    {
        this.desDibujar();
        this.x++;
        this.dibujar();
    }
}
Pieza.prototype.rotar = function()
{
    let siguientePatron = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let moverX = 0;
    if (this.colision(0, 0, siguientePatron) == true) 
    {
        if (this.x > columnas/2) 
        {
            moverX = -1;
        }
        else
        {
            moverX = 1;
        }
    }
    if (this.colision(moverX, 0, siguientePatron) == false) 
    {
        this.desDibujar();
        this.x += moverX;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.dibujar();
    }
}

/* Prototipo para colisión */
Pieza.prototype.colision = function(x, y, pieza)
{
    let length = pieza.length;
    for (let r = 0; r < length; r++) 
    {
        for (let c = 0; c < length; c++) 
        {
            if (pieza[r][c] == 0) { continue; }
            /*****************************************************
             * Las coordenadas de cualquier cuadro de un tetromino:
             * this.x + c
             * this.y + r
             *****************************************************/
            /*****************************************************
             * Las coordenadas de cualquier cuadro de un tetromino
             * despues de hacer un movimiento:
             * this.colision(x, y, pieza);
             * this.x + c + x
             * this.y + r + y
             *****************************************************/
            let nuevoX = this.x + c + x;
            let nuevoY = this.y + r + y;
            if (nuevoX < 0 || nuevoX >= columnas || nuevoY >= filas) 
            {
                return true;
            }
            if (nuevoY < 0) { continue; }
            if (tabla[nuevoY][nuevoX] != vacio) 
            {
                return true;
            }
        }
    }
    return false;
}

Pieza.prototype.bloquear = function()
{
    let length = this.activeTetromino.length;
    for (let r = 0; r < length; r++) 
    {
        for (let c = 0; c < length; c++) 
        {
            if (this.activeTetromino[r][c] == 0) { continue; }
            // aca termina el juego
            if (this.y + r < 0) 
            {
                gameOver = true;
                alert("El juego termino! \nHiciste " + puntos + " puntos.");
                return 0;
            }

            // bloqueamos los colores de los cuadros para que coincidan con el ultimo tetromino
            tabla[this.y + r][this.x + c] = this.color;

            /* cuando completamos una fila */
                // iteramos por todas las filas
                for (let r = 0; r < filas; r++) 
                {
                    let lineaCompleta = true;
                    // iteramos por cada columna
                    for (let c = 0; c < columnas; c++) 
                    {
                        lineaCompleta = lineaCompleta && (tabla[r][c] != vacio);
                    }
                    // si lineaCompleta == true, la linea está completa
                    if (lineaCompleta) 
                    {
                        // necesitamos mover para abajo todas las lineas que esten por encima
                        for (let y = r; y > 1; y--) 
                        {
                            for (let c = 0; c < columnas; c++) 
                            {
                                tabla[y][c] = tabla[y - 1][c];
                                dibujarCuadrado(c, y, tabla[y][c]);
                            }
                        }
                        for (let c = 0; c < columnas; c++) 
                        {
                            tabla[0][c] = vacio;
                        }
                        puntos += 10;
                        txtPuntos.innerHTML = "Puntos: " + puntos;
                    }
                }
        }
    }
}

/* Controles */
document.addEventListener("keydown", function(e)
{
    switch (e.keyCode) 
    {
        case 37:
            p.moverIzquierda();
            break;
        case 38:
            p.rotar();
            break;
        case 39:
            p.moverDerecha();
            break;
        case 40:
            p.moverAbajo();
            break;
    }
})
/* END Controles */

function dibujarTabla()
{
    for (let r = 0; r < filas; r++) 
    {
        for (let c = 0; c < columnas; c++) 
        {
            dibujarCuadrado(c, r, tabla[r][c]);
        }
    }
}

function dibujarCuadrado(x, y, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x*sq, y*sq, sq, sq);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*sq, y*sq, sq, sq);
}

function generarPieza()
{
    let numPieza = Math.floor(Math.random() * PIEZAS.length)
    return new Pieza(PIEZAS[numPieza][0], PIEZAS[numPieza][1]);
}

/* Automatizamos la caida de la pieza */
function Tirar()
{
    let ahora = Date.now();
    let intervalo = ahora - tirar;

    if (intervalo > 500) 
    {
        p.moverAbajo();
        tirar = Date.now();
    }

    if(gameOver == false)
    {
        requestAnimationFrame(Tirar);
    }
}