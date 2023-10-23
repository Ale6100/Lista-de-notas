const disabledButton = (button: HTMLButtonElement, disabled: boolean) => { // Agarra un botón y lo deshabilita si disabled es true
    if (disabled) {
        button.disabled = true
        button.style.setProperty("background-color", "gray")
    } else {
        button.disabled = false
        button.style.removeProperty("background-color")
    }
}

export default disabledButton
