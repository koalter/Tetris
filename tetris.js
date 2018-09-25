const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const sq = 20;

function dibujarCuadrado(x, y, color)
{
    ctx.fillStyle = color;
    ctx.fillRect(x*sq, y*sq, sq, sq);
    ctx.strokeStyle = "black";
    ctx.strokeRect(x*sq, y*sq, sq, sq);
}

function dibujar(x, y, matriz, color)
{
    for (let r = 0; r < matriz.length; r++) 
    {
        for (let c = 0; c < matriz.length; c++)
        {
            if (matriz[r][c] == 1) 
            {
                dibujarCuadrado(x + c,y + r, color);
            }
        }
    }
}

/* Codigo para crear la tabla */
const filas = 20;
const columnas = 10;
const vacio = "white";

let tabla = [];
for (let r = 0; r < filas; r++) 
{
    tabla[r] = [];
    for (let c = 0; c < columnas; c++) 
    {
        dibujarCuadrado(c, r, vacio);
    }
}

/* Codigo para las piezas */
const z = [[[1, 1, 0], [0, 1, 1], [0, 0, 0]],
            [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
            [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
            [[0, 1, 0], [1, 1, 0], [1, 0, 0]]];
// let pieza = z[0];
// const length = pieza.length;
// const piezaColor = "orange";
// for (let r = 0; r < length; r++) 
// {
//     for (let c = 0; c < length; c++) 
//     {
//         if (pieza[r][c] == 1) 
//         {
//             dibujarCuadrado(c, r, piezaColor);
//         }
//     }
// }

/* Creacion del objeto */
function Pieza(tetromino, color)
{
    this.tetromino = tetromino;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.color = color;
    this.x = 3;
    this.y = -2;
    /* Coordenadas del cuadradro */
    dibujar(this.x, this.y, this.activeTetromino, this.color);

    Pieza.prototype.dibujar = function()
    {
        dibujar(this.x, this.y, this.activeTetromino, this.color);
    }
    Pieza.prototype.desDibujar = function()
    {
        dibujar(this.x, this.y, this.activeTetromino, vacio);
    }
    /* Métodos de control */
    Pieza.prototype.rotar = function()
    {
        let tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        let siguiente = this.tetromino[tetrominoN];
        if (this.colision(0, 0, siguiente) == false) 
        {
            this.desDibujar();
            this.tetrominoN = tetrominoN;
            /**
             * 0 = (0 + 1) % 4 = 1;
             * 1 = (1 + 1) % 4 = 2;
             * 2 = (2 + 1) % 4 = 3;
             * 3 = (3 + 1) % 4 = 0;
             */
            this.activeTetromino = siguiente;
            this.dibujar();
        }
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
        else 
        {
            
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
        else 
        {
            
        }
        
    }
    /* END métodos de control */

    /* Prototipo para colisión */
    Pieza.prototype.colision = function(x, y, pieza)
    {
        for (let r = 0; r < pieza.length; r++) 
        {
            for (let c = 0; c < pieza.length; c++) 
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
                // if (tabla[nuevoY][nuevoX] != vacio) 
                // {
                //     return true;
                // }
            }
        }
        return false;
    }
}

let pieza = new Pieza(z, "blue");

/* Las claves para las teclas de flechas son 37, 38, 39, 40 */

/* Códigos para teclas */
document.addEventListener("keydown", function(e)
{
    switch (e.keyCode)
    {
        case 37:
            pieza.moverIzquierda();
            break;
        case 38:
            pieza.rotar();
            break;
        case 39:
            pieza.moverDerecha();
            break;
        case 40:
            pieza.moverAbajo();
            break;
    }
});