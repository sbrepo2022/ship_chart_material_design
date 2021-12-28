// const MDCTextField = mdc.textField.MDCTextField;
//
// const textFields = [].map.call(document.querySelectorAll('.mdc-text-field'), function(el) {
//   return new MDCTextField(el);
// });

window.mdc.autoInit();
[].map.call(document.querySelectorAll('.mdc-icon-button[data-mdc-auto-init]'), function(el) {
    el.MDCRipple.unbounded = true;
});