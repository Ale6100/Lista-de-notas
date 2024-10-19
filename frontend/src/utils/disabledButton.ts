const disableButton = (button: HTMLButtonElement) => {
    button.disabled = true;
    button.style.setProperty("background-color", "gray");
};

const enableButton = (button: HTMLButtonElement) => {
    button.disabled = false;
    button.style.removeProperty("background-color");
};

export { disableButton, enableButton };
