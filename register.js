let form = document.querySelector(".register-form")
let inputs = document.querySelectorAll(".inputGroup input")
let classes = [
    "6А", "6Б", "6В", "6Г",
    "7А", "7Б", "7В", "7Г",
    "8А", "8Б", "8В", "8Г",
    "9А", "9Б", "9В", "9Г",
    "10А", "10Б", "10В", "10Г",
    "11А", "11Б", "11В", "11Г"
]

form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    let errorTexts = document.querySelectorAll(".error")
    errorTexts.forEach(error => error.remove())
    let formData = new FormData(form)
    let count = 0
    if (!formData.get("password")) {
        makeErrorText("Password is required", document.querySelector("input[name='password']").closest(".inputGroup"))
        count++
        console.log("Password is required")
    }
    if (!formData.get("name") || formData.get("name").length < 3) {
        makeErrorText("First name must be at least 3 characters long", document.querySelector("input[name='name']").closest(".inputGroup"))
        count++
        console.log("First name must be at least 3 characters long")
    }
    if(!formData.get("lastname") || formData.get("lastname").length < 3){
        makeErrorText("Last name must be at least 3 characters long", document.querySelector("input[name='lastname']").closest(".inputGroup"))
        count++
        console.log("Last name must be at least 3 characters long")
    }
    if(!formData.get("class") || !classes.some(c => c === formData.get("class"))){
        makeErrorText("Wrong class", document.querySelector("input[name='class']").closest(".inputGroup"))
        count++
        console.log("Wrong class")
    }
    if(!formData.get("school") || formData.get("school").length < 3){
        makeErrorText("School is required", document.querySelector("input[name='school']").closest(".inputGroup"))
        count++
        console.log("School is required")
    }

    if(count > 0){
        return
    }
    e.target.submit()
})

const makeErrorText = (text, box) => {
    box.innerHTML += `<span class="error">${text}</span>`
    box.querySelector("input").classList.add("error-border")
    box.querySelector("input").addEventListener("input", ()=>{
        box.querySelector(".error").remove()
        box.querySelector("input").classList.remove("error-border")
    })
}