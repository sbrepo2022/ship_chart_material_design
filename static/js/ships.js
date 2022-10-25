// init mdc
let shipDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('shipDialog'));
let portSelect = {};

// set handlers
document.getElementById('addShip').onclick = function() {
    document.getElementById('shipForm').setAttribute('method', 'post');
    document.getElementById('shipForm').reset();
    document.querySelector(`#portSelectMenu li`).click();
    document.getElementById('ship-dialog-title').innerHTML = 'Add new ship';
    document.getElementById('shipImgDisplay').style.backgroundImage = "url('/static/resources/images/ship_bg.jpg')";
    shipDialog.open();
}

document.querySelectorAll('[role="edit-ship"]').forEach(el => el.addEventListener('click', function() {
    document.getElementById('shipForm').setAttribute('method', 'put');
    document.getElementById('shipForm').reset();
    document.getElementById('ship-dialog-title').innerHTML = 'Edit ship data';

    if (this.getAttribute('data-ship-image') === '') {
        document.getElementById('shipImgDisplay').style.backgroundImage = "url('/static/resources/images/ship_bg.jpg')";
    }
    else {
        document.getElementById('shipImgDisplay').style.backgroundImage = "url('/media/" + this.getAttribute('data-ship-image') + "')";
    }

    document.getElementById('shipIdInput').value = this.getAttribute('data-ship-id');
    document.getElementById('shipNameComponent').MDCTextField.value = this.getAttribute('data-ship-name');
    let port_id = this.getAttribute("data-port-id");
    document.querySelector(`#portSelectMenu [data-value="${port_id}"]`).click();

    shipDialog.open();
}));

document.querySelectorAll('[role="delete-ship"]').forEach(el => el.addEventListener('click', function() {
    let action = this.getAttribute('data-action');
    let formData = new FormData();
    formData.append('ship-id', this.getAttribute('data-ship-id'));

    fetch(action, {
        method: 'delete',
        body: formData
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Delete ship error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
}));

document.getElementById('chooseShipImg').addEventListener('click', () => {
    document.getElementById('shipImgInput').click();
});

document.getElementById('shipImgInput').addEventListener('change', () => {
    let file = document.getElementById("shipImgInput").files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById('shipImgDisplay').style.backgroundImage = "url('" + reader.result + "')";
    }
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('shipForm').addEventListener('submit', function(e) {
    let action = document.getElementById('shipForm').getAttribute('action');
    let method = document.getElementById('shipForm').getAttribute('method');

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
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Add ship error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    e.preventDefault();
});


// additional requests
let ports = null;
fetch('/ships/port',
{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => {
    if (response.status === 200) {
        return response.json();
    }
    return Promise.reject();
}).then(ports => {
    setPortsToSelect(ports);
    portSelect = mdc.select.MDCSelect.attachTo(document.getElementById('portSelect'));
}).catch(() => {
    document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Ports fetch error occurs';
    document.getElementById('errorsSnackbar').MDCSnackbar.open();
    portSelect = mdc.select.MDCSelect.attachTo(document.getElementById('portSelect'));
});

// methods
function setPortsToSelect(ports) {
    let html_insert = ``;
    let first = true;
    for (let i in ports['ports']) {
        html_insert += `
            <li class="mdc-deprecated-list-item ${first ? 'mdc-deprecated-list-item--selected' : ''}" aria-selected="${first}" data-value="${ports['ports'][i][0]}" role="option">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">
                    ${ports['ports'][i][1]}
                </span>
            </li>
        `;
        first = false;
    }

    let portsMenu = document.querySelector('#portSelectMenu ul');
    portsMenu.innerHTML = html_insert;
}
