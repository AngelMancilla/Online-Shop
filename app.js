
const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let car = {}

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if(localStorage.getItem("car")) {
        car = JSON.parse(localStorage.getItem("car"))
        paintCar()
    }
})

cards.addEventListener("click", e => {
    addCar(e)
})

items.addEventListener("click", e => {
    btnAccion(e)
})

const fetchData = async () => {
    try {
        const res = await fetch("api.json")
        const data = await res.json()
        paintCards(data)
    } catch (error) {
        console.log(error);
    }
}

const paintCards = data => {
    data.forEach(product => {
        templateCard.querySelector("h5").textContent = product.title
        templateCard.querySelector("p").textContent = product.precio
        templateCard.querySelector("img").setAttribute("src", product.thumbnailUrl)
        templateCard.querySelector(".btn").dataset.id = product.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCar = e => {
    if(e.target.classList.contains("btn")) {
        setCar(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCar = object => {
    const product = {
        id: object.querySelector(".btn").dataset.id,
        title: object.querySelector("h5").textContent,
        precio: object.querySelector("#precio").textContent,
        cantidad: 1
    }
    if(car.hasOwnProperty(product.id)) {
        product.cantidad = car[product.id].cantidad + 1
    }
    car[product.id] = {...product}
    paintCar()
}

const paintCar = () => {
    items.innerHTML = " "
Object.values(car).forEach(product => {
    templateCarrito.querySelector("th").textContent = product.id
    templateCarrito.querySelectorAll("td")[0].textContent = product.title
    templateCarrito.querySelectorAll("td")[1].textContent = product.cantidad
    templateCarrito.querySelector(".btn-info").dataset.id = product.id
    templateCarrito.querySelector(".btn-danger").dataset.id = product.id
    templateCarrito.querySelector("span").textContent = product.cantidad * product.precio
    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)

})
    items.appendChild(fragment)
    paintFooter()

    localStorage.setItem('car', JSON.stringify(car))
}

const paintFooter = () => {
    footer.innerHTML = " "
    if(Object.keys(car).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }

    const nCantidad = Object.values(car).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(car).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click", () => {
        car = {}
        paintCar()
    })
}

const btnAccion = e => {
    if(e.target.classList.contains("btn-info")) {
        car[e.target.dataset.id]
        const producto = car[e.target.dataset.id]
        producto.cantidad ++
        car[e.target.dataset.id] = {...producto}
        paintCar()
    }
    if(e.target.classList.contains("btn-danger")) {
        const producto = car[e.target.dataset.id]
        producto.cantidad --
        car[e.target.dataset.id] = {...producto}
        if(producto.cantidad === 0 ) {
            delete car[e.target.dataset.id]
        }
        paintCar()
    }
    e.stopPropagation()
}
