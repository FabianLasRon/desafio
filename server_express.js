const express = require("express");
const ProductManager = require("./manejodeArchivos");

const productManager = new ProductManager("products.json");

async function agregarProductos() {
    try {
        for (let i = 1; i <= 10; i++) {
            await productManager.addProduct(
                `Producto ${i}`,
                `Descripción del producto ${i}`,
                10.99,
                `thumbnail${i}.jpg`,
                `00${i}`,
                100
            );
        }
    } catch (error) {
        console.log("Ocurrió un error al agregar los productos:", error);
    }
}

agregarProductos()

const app = express();

app.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit >= 1) {
            const productosLimit = products.slice(0, limit);
            return res.send(productosLimit);
        } else {
            return res.send(products);
        }
    } catch (err) {
        console.log("Error al obtener los productos:", err);
        return res.send("Error al obtener los productos");
    }
});

app.get("/products/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            return res.send(product);
        } else {
            return res.send({ error: "El producto no existe" });
        }
    } catch (err) {
        console.log("Error al obtener el producto:", err);
        return res.send("Error al obtener el producto");
    }
});

app.listen(8080, () => {
    console.log("Escuchando en el puerto 8080");
});