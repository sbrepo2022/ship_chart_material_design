// init mdc
let employeeDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('employeeDialog'));
let dismissDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('dismissDialog'));

// set handlers
document.getElementById('addEmployee').onclick = function() {
    document.getElementById('employeeForm').setAttribute('method', 'post');
    document.getElementById('employeeForm').reset();
    document.getElementById('employee-dialog-title').innerHTML = 'Add new employee';

    document.getElementById('employeeDismissalComponentDialog').style.display = 'none';

    document.getElementById('employeeImgDisplay').style.backgroundImage = "url('/static/resources/icons/account_circle.svg')";
    document.getElementById('employeeImgBg').style.backgroundImage = "url('/static/resources/images/avatar_bg.png')";
    employeeDialog.open();
}

document.querySelectorAll('[role="edit-employee"]').forEach(el => el.addEventListener('click', function() {
    document.getElementById('employeeForm').setAttribute('method', 'put');
    document.getElementById('employeeForm').reset();
    document.getElementById('employee-dialog-title').innerHTML = 'Edit employee data';

    if (this.getAttribute('data-employee-image') === '') {
        document.getElementById('employeeImgDisplay').style.backgroundImage = "url('/static/resources/icons/account_circle.svg')";
        document.getElementById('employeeImgBg').style.backgroundImage = "url('/static/resources/images/avatar_bg.png')";
    }
    else {
        document.getElementById('employeeImgDisplay').style.backgroundImage = "url('/media/" + this.getAttribute('data-employee-image') + "')";
        document.getElementById('employeeImgBg').style.backgroundImage = "url('/media/" + this.getAttribute('data-employee-image') + "')";
    }

    let dismissalDate = this.getAttribute('data-employee-dismissal');
    if (dismissalDate !== 'None') {
        document.getElementById('employeeDismissalData').innerHTML = `Dismissal date: ${dismissalDate}`;
        document.getElementById('employeeRestoreButton').setAttribute('data-employee-id', this.getAttribute('data-employee-id'));
        document.getElementById('employeeDismissalComponentDialog').style.display = 'block';
    }
    else {
        document.getElementById('employeeDismissalComponentDialog').style.display = 'none';
    }

    document.getElementById('employeeIdInput').value = this.getAttribute('data-employee-id');
    document.getElementById('employeeAdmissionComponent').MDCTextField.value = this.getAttribute('data-employee-admission');
    document.getElementById('employeeFirstnameComponent').MDCTextField.value = this.getAttribute('data-employee-firstname');
    document.getElementById('employeeLastnameComponent').MDCTextField.value = this.getAttribute('data-employee-lastname');
    document.getElementById('employeeMidnameComponent').MDCTextField.value = this.getAttribute('data-employee-midname');
    document.getElementById('employeeBirthdayComponent').MDCTextField.value = this.getAttribute('data-employee-birthday');
    document.getElementById('departmentIdComponent').MDCTextField.value = this.getAttribute('data-department-id');

    employeeDialog.open();
}));

document.querySelectorAll('[role="dismiss-employee"]').forEach(el => el.addEventListener('click', function(e) {
    e.stopPropagation();

    document.getElementById('dismissForm').reset();

    let dismissalDate = this.getAttribute('data-employee-dismissal');
    if (dismissalDate !== 'None') {
        document.getElementById('employeeDismissalData2').innerHTML = `Dismissal date: ${dismissalDate}`;
        document.getElementById('employeeRestoreButton2').setAttribute('data-employee-id', this.getAttribute('data-employee-id'));
        document.getElementById('employeeDismissalComponentDialog2').style.display = 'block';
    }
    else {
        document.getElementById('employeeDismissalComponentDialog2').style.display = 'none';
    }

    document.getElementById('employeeDismissIdInput').value = this.getAttribute('data-employee-id');
    document.getElementById('employeeDismissalComponent').MDCTextField.value = this.getAttribute('data-employee-dismissal');

    dismissDialog.open();
}));

document.getElementById('chooseEmployeeImg').addEventListener('click', () => {
    document.getElementById('employeeImgInput').click();
});

document.getElementById('employeeImgInput').addEventListener('change', () => {
    let file = document.getElementById("employeeImgInput").files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById('employeeImgDisplay').style.backgroundImage = "url('" + reader.result + "')";
        document.getElementById('employeeImgBg').style.backgroundImage = "url('" + reader.result + "')";
    }
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.querySelector('[role="admission-today"]').addEventListener('click', () => {
    document.getElementById('employeeAdmissionInput').valueAsDate = new Date();
});

document.querySelector('[role="dismissal-today"]').addEventListener('click', () => {
    document.getElementById('employeeDismissalInput').valueAsDate = new Date();
});

document.getElementById('employeeForm').addEventListener('submit', function(e) {
    let action = document.getElementById('employeeForm').getAttribute('action');
    let method = document.getElementById('employeeForm').getAttribute('method');

    fetch(action, {
        method: method,
        body: new FormData(this)
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Add employee error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    e.preventDefault();
});

document.getElementById('dismissForm').addEventListener('submit', function(e) {
    let action = document.getElementById('dismissForm').getAttribute('action');
    let method = document.getElementById('dismissForm').getAttribute('method');

    fetch(action, {
        method: method,
        body: new FormData(this)
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Dismiss employee error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    e.preventDefault();
});

document.querySelectorAll('[role="delete-employee"], [role="restore-employee"]').forEach(el => el.addEventListener('click', function(e) {
    e.stopPropagation();

    let action = this.getAttribute('data-action');
    let formData = new FormData();
    formData.append('employee-id', this.getAttribute('data-employee-id'));

    fetch(action, {
        method: this.getAttribute('data-method'),
        body: formData
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Delete employee error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
}));