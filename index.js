import { menuArray, orderArray } from "./data.js"

const modal = document.getElementById("modal")
const modalForm = document.getElementById("modal-form")

document.addEventListener("click", function(e){
    if(e.target.dataset.food){
        handleAddBtnClick(e.target.dataset.food)
    }
    else if(e.target.dataset.remove){
        handleRemoveBtnClick(e.target.dataset.remove)
    }
    else if(e.target.id === "complete-order-btn"){
        handelCompeleteOrderBtnClick()
    }
})

function handleAddBtnClick(foodId){
    updateOrderArray(foodId, "add")
    renderOrderList()
}

function handleRemoveBtnClick(foodId){
    updateOrderArray(foodId, "remove")
    renderOrderList()
}

function handelCompeleteOrderBtnClick(){
    modal.style.display = "block"
}

function updateOrderArray(foodId, action){
    const targetIndex = orderArray.findIndex( order => order.id === Number(foodId) )
    if(action === "add"){
        if(targetIndex >= 0){
            orderArray[targetIndex].quantity++
        }
        else{
            const {name, price} = menuArray.filter( item => item.id === Number(foodId) )[0]
            orderArray.push({
                name: name,
                id: Number(foodId),
                price: price,
                quantity: 1
            })
        }
    }
    else if(action === "remove"){
        if(orderArray[targetIndex].quantity > 1){
            orderArray[targetIndex].quantity--
        }
        else if(orderArray[targetIndex].quantity === 1){
            orderArray.splice(targetIndex,1)
        }
    }
    
}

function renderOrderList(){
    const orderListContainer = document.getElementById("order-list-container")
    if(orderArray.length > 0){
        let orderSum = 0
        let orderListHtml = `
<div class="order-list-heading">
    <h3>Your order</h3>
</div>
` 
        orderListHtml += orderArray.map( order => {
            orderSum += order.price * order.quantity
            return `
<div class="order-item-container">
    <h3>${order.name} (${order.quantity})</h3>
    <button class="remove-btn" data-remove="${order.id}">remove</button>
    <h5 class="flex-last-child">$${(order.price)*(order.quantity)}</h5>
</div>
`
        }).join("")
        orderListHtml += 
`
<div class="total-price-container">
    <h3>Total price:</h3>
    <h5 class="flex-last-child">$${orderSum}</h5>
</div>
<button class="complete-order-btn" id="complete-order-btn">Complete order</button>
`
    orderListContainer.innerHTML = orderListHtml
    }
    else {
        orderListContainer.textContent = ""
    }
}

function getFoodListHtmlString() {
    return menuArray.map( foodItem => `
<div class="food-item-container">
    <div class="emoji">
        ${foodItem.emoji}
    </div>
    <div>
        <h3>${foodItem.name}</h3>
        <p>${foodItem.ingredients.join(", ")}</p>
        <h5>$${foodItem.price}</h5>
    </div>
    <div class="flex-last-child">
        <button class="add-btn" data-food="${foodItem.id}">+</button>
    </div>
</div>

`
    ).join("")
}

function renderFoodList() {
    document.querySelector("#food-list-container").innerHTML = getFoodListHtmlString()
}

modalForm.addEventListener("submit", function(e){
    const afterOrderContainer = document.getElementById("after-order-container")
    e.preventDefault()
    const formData = new FormData(modalForm)
    modal.style.display = "none"
    orderArray.splice(0, orderArray.length)
    renderOrderList()
    const newEl = document.createElement("h2")
    newEl.textContent = `Thanks, ${formData.get("fullName")}! Your order is on its way!`
    afterOrderContainer.innerHTML = ""
    afterOrderContainer.append(newEl)
    afterOrderContainer.style.display = "block"
    // setTimeout(function () {
    //     afterOrderContainer.style.display = "none"
    // }, 5000)
 
})

renderFoodList()
