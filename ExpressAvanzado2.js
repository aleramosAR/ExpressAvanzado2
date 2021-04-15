import express from 'express';

const app = express();
const router = express.Router();
router.use(express.json());

// Incorporo el Router para las llamadas desde la ruta '/api/productos'
app.use('/api/productos', router);
app.use(express.urlencoded({ extended: true }));

// Creo el espacio publico desde la carpeta /public para mostrar el formuulario de index.html
app.use(express.static('public'));

// Conexion a server con callback avisando de conexion exitosa
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Ya me conecte al puerto ${PORT}.`);
})
server.on('error', (error) => console.log('Hubo un error inicializando el servidor.'));


// CLASE - Genero la clase "Products" para administrar el listado de productos y su logica
class Products {
  constructor() {
    this.PRODUCTS = [];
    this.prodID = 0;
  }

  // Devuevo el listado completo, si el listado esta vacio devuelvo false para hacer el chequeo
  getProds() {
    if (this.PRODUCTS.length == 0) {
      return false;
    }
    return this.PRODUCTS;
  }

  // Devuelvo un producto seleccionado del listado
  selectProd(id) {
    return this.PRODUCTS.filter(prod => prod.id === parseInt(id))[0];
  }

  // Agrego un producto al listado
  addProd(product) {
    product.id = this.prodID++;
    this.PRODUCTS.push(product);
  }

  // Actualizo un producto
  updateProd(id, product) {
    // Chequeo que item del array tiene el mismo ID para seleccionarlo
    let index;
    for (let i = 0; i < this.PRODUCTS.length; i++) {
      if (this.PRODUCTS[i].id === id) {
        index = i;
        break;
      }
    };
    // Si el item existe lo reenmplazo.
    // Al product que recibo desde el body le agrego el ID correspondiente y lo grabo
    if (index != undefined) {
      product.id = id;
      this.PRODUCTS[index] = product;
      return product;
    };
  }

  // Elimino un producto
  deleteProd(id) {
    // Chequeo que item del array tiene el mismo ID para seleccionarlo
    let index;
    for (let i = 0; i < this.PRODUCTS.length; i++) {
      if (this.PRODUCTS[i].id === id) {
        index = i;
        break;
      }
    };
    // Si el item existe lo elimino del array.
    if (index != undefined) {
      const product = this.PRODUCTS[index];
      this.PRODUCTS.splice(index, 1);
      return product;
    };
  }
}

// Inicializo la variable stock que es una instancia de Products
const stock = new Products();

// Cargo el listado de productos, devuelvo un mensajes si el listado esta vacio (devuelve false)
router.get("/", (req, res) => {
  if (!stock.getProds()) {
    return res.status(404).json({
      error: "No hay productos cargados.",
    });
  }
  res.json(stock.getProds());
});

// Devuelvo un determinado producto
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const prod = stock.selectProd(id);
  if (prod) {
    return res.json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});

// Agrego un producto
router.post("/", (req, res) => {
  const product = req.body;
  stock.addProd(product);
  res.status(201).json(product);
});

// Actualizo un producto
router.put("/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const product = req.body;

  // Ejecuto el update y recibo la respuesta en una variable.
  // Si el producto que intente actualizar existe lo devuelvo con un status 200.
  // Si el producto que intente actualizar no existe devuelvo un error con un status 404.
  const prod = stock.updateProd(parseInt(id), product);
  if (prod) {
    return res.status(200).json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});

// Elimino un producto
router.delete("/borrar/:id", (req, res) => {
  const { id } = req.params;

  // Elimino el producto segun el id que se paso y recibo la respuesta en una variable.
  // Si el producto que intente eliminar existe lo devuelvo con un status 200.
  // Si el producto que intente eliminar no existe devuelvo un error con un status 404.
  const prod = stock.deleteProd(parseInt(id));
  if (prod) {
    return res.status(200).json(prod);
  }
  res.status(404).json({
    error: "Producto no encontrado."
  });
});



// EJEMPLOS de Productos para cargar en Postman
/*
{
  "title": "Zapatillas para Dama",
  "price": 8900,
  "thumbnail": "zapatillas-dama"
}
{
  "title": "Paletas de Ping Pong",
  "price": 2500,
  "thumbnail": "paletas"
}
{
  "title": "Pelota de Futbol",
  "price": 12500,
  "thumbnail": "pelota"
}
{
  "title": "Par de medias",
  "price": 1400,
  "thumbnail": "medias"
}
*/