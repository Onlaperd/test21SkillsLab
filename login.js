let form = document.querySelector(".login-form")
form.addEventListener("submit", async (e)=>{
    e.preventDefault()
    let errorTexts = document.querySelectorAll(".error")
    errorTexts.forEach((error) => {
        error.remove()
    })

    let formData = new FormData(form)
    let count = 0
    if (!formData.get("username") || formData.get("username").length < 3) {
        makeErrorText("First name must be at least 3 characters long", document.querySelector("input[name='username']").closest(".inputGroup"))
        count++
        console.log("First name must be at least 3 characters long")
    }
    if(!formData.get("secondname") || formData.get("secondname").length < 3){
        makeErrorText("Last name must be at least 3 characters long", document.querySelector("input[name='secondname']").closest(".inputGroup"))
        count++
        console.log("Last name must be at least 3 characters long")
    }
    if (!formData.get("password")) {
        makeErrorText("Password is required", document.querySelector("input[name='password']").closest(".inputGroup"))
        count++
        console.log("Password is required")
    }
    if (count > 0) {
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