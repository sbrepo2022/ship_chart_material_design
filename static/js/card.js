document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('errorsSnackbar').getAttribute('data-errors') == 1) {
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    }
});