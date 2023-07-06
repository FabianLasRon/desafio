const fs = require("fs");

class ProductManager {
    static id = 1;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        return new Promise((resolve, reject) => {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                return reject("Todos los parámetros son obligatorios");
            }

            const productExists = this.products.findIndex(
                (product) => product.code === code
            );

            if (productExists !== -1) {
                return reject("El código del producto ya está en uso");
            }

            const product = {
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                id: ProductManager.id,
            };

            this.products.push(product);
            ProductManager.id++;

            this.guardarProductos()
                .then(() => {
                    resolve("Producto agregado correctamente.");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    guardarProductos() {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.stringify(this.products, null, 2);
                fs.writeFile(this.path, data, "utf-8", (err) => {
                    if (err) {
                        console.log("Error al guardar los productos");
                        reject(err);
                    } else {
                        console.log("Productos guardados correctamente");
                        resolve();
                    }
                });
            } catch (err) {
                console.log("Error al guardar los productos");
                reject(err);
            }
        });
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, "utf-8", (err, contenido) => {
                if (err) {
                    console.log("Error al leer los productos");
                    return reject(err);
                }
                if (contenido === "") {
                    return resolve([]);
                }

                const products = JSON.parse(contenido);
                return resolve(products);
            });
        });
    }

    getProductById(id) {
        return new Promise((resolve, reject) => {
            this.getProducts()
                .then((products) => {
                    const product = products.find((product) => product.id === id);
                    resolve(product);
                })
                .catch((e) => {
                    console.log("Error al obtener el producto:", e);
                    reject(e);
                });
        });
    }

    updateProduct(id, updateProduct) {
        return new Promise((resolve, reject) => {
            this.getProducts()
                .then((products) => {
                    const productIndex = products.findIndex((product) => product.id === id);

                    if (productIndex === -1) {
                        return reject("Producto no encontrado");
                    }

                    products[productIndex].title = updateProduct.title;
                    products[productIndex].description = updateProduct.description;
                    products[productIndex].price = updateProduct.price;
                    products[productIndex].thumbnail = updateProduct.thumbnail;
                    products[productIndex].code = updateProduct.code;
                    products[productIndex].stock = updateProduct.stock;

                    this.guardarProductos()
                        .then(() => {
                            resolve("Producto actualizado");
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((e) => {
                    console.log("Error al obtener el producto:", e);
                    reject(e);
                });
        });
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const productIndex = this.products.findIndex((p) => p.id === id);
            if (productIndex === -1) {
                return reject("Producto no encontrado");
            }

            this.products.splice(productIndex, 1);

            this.guardarProductos()
                .then(() => {
                    resolve("Producto eliminado");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}




module.exports = ProductManager;


