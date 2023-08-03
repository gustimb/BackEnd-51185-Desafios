const socket = io();

const divProductos = document.getElementById('divProductos');

const inputProductName = document.getElementById('productName');
const inputProductDescription = document.getElementById('productDescription');
const inputProductCode = document.getElementById('productCode');
const inputProductPrice = document.getElementById('productPrice');
const inputProductStatus = document.getElementById('productStatus');
const inputProductStock = document.getElementById('productStock');
const inputProductCategory = document.getElementById('productCategory');
const inputProductThumbnail = document.getElementById('productThumbnail');
const inputIdToDelete = document.getElementById('idToDelete');

const btnAddProducts = document.getElementById('btnAddProducts');
const btnDeleteProduct = document.getElementById('btnDeleteProduct');

socket.on('showAllProducts', data => {
    divProductos.innerHTML = data
})

btnAddProducts.onclick = (e) => {
    e.preventDefault()

    if (!inputProductName.value || !inputProductDescription.value || !inputProductCode.value || !inputProductPrice.value || !inputProductStatus.value || !inputProductStock.value || !inputProductCategory.value || !inputProductThumbnail.value) {
        alert('Faltan datos')
        return
    }

    let nvoProducto =
    {
        "title": `${inputProductName.value}`,
        "description": `${inputProductDescription.value}`,
        "code": `${inputProductCode.value}`,
        "price": `${inputProductPrice.value}`,
        "status": `${inputProductStatus.value}`,
        "stock": `${inputProductStock.value}`,
        "category": `${inputProductCategory.value}`,
        "thumbnail": `${inputProductThumbnail.value}`
    }
    data = nvoProducto
    socket.emit('newProduct', data)

    inputProductName.value = '';
    inputProductDescription.value = '';
    inputProductCode.value = '';
    inputProductPrice.value = '';
    inputProductStatus.value = '';
    inputProductStock.value = '';
    inputProductCategory.value = '';
    inputProductThumbnail.value = '';
}

btnDeleteProduct.onclick = () => {
    if (!inputIdToDelete.value) {
        alert('Ingrese el ID a eliminar')
        return
    }
    let idToDelete = inputIdToDelete.value
    data = idToDelete
    socket.emit('deleteProduct', data)
    inputIdToDelete.value = ''
}