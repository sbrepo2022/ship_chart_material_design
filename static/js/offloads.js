let offloadsLimitSelect = document.getElementById('offloadsLimitSelect').MDCSelect;
let offloadDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('offloadDialog'));
let exitOffloadDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('exitOffloadDialog'));
let offloadShipChooseCallback;
let chooseShipDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('chooseShipDialog'));
let addOffloadEmployeeCallback;
let addOffloadEmployeeDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('addOffloadEmployeeDialog'));

offloadsLimitSelect.listen('MDCSelect:change', function() {
    updateTable({ limit: offloadsLimitSelect.value });
}, false);

document.getElementById('nextPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('offloadsTable').getAttribute('data-limit'));
    let offset = Number(document.getElementById('offloadsTable').getAttribute('data-offset'));
    let count = Number(document.getElementById('offloadsTable').getAttribute('data-count'));
    updateTable({ offset: offset + limit + limit > count ? count - limit : offset + limit });
});

document.getElementById('prevPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('offloadsTable').getAttribute('data-limit'));
    let offset = Number(document.getElementById('offloadsTable').getAttribute('data-offset'));
    updateTable({ offset: offset - limit < 0 ? 0 : offset - limit });
});

document.getElementById('firstPageButton').addEventListener('click', function() {
    updateTable({ offset: 0 });
});

document.getElementById('lastPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('offloadsTable').getAttribute('data-limit'));
    let count = Number(document.getElementById('offloadsTable').getAttribute('data-count'));
    updateTable({ offset: count - limit < 0 ? 0 : count - limit });
});

function updateTable(new_val) {
    let limit = 'limit' in new_val ? new_val.limit : document.getElementById('offloadsTable').getAttribute('data-limit');
    let offset = 'offset' in new_val ? new_val.offset : document.getElementById('offloadsTable').getAttribute('data-offset');

    window.location = `/offloads?limit=${limit}&offset=${offset}`;
}


// dialog
document.getElementById('addOffload').addEventListener('click', function() {
    document.getElementById('offloadForm').setAttribute('method', 'post');
    clearOffloadForm();
    document.getElementById('offload-dialog-title').innerHTML = 'Add new offload';

    offloadDialog.open();
});

document.getElementById('offloadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let action = document.getElementById('offloadForm').getAttribute('action');
    let method = document.getElementById('offloadForm').getAttribute('method');

    let body_json = {
        offload_id: document.getElementById('offloadIdInput').value,
        entry_dt: document.getElementById('entryDateInput').value + ' ' + document.getElementById('entryTimeInput').value,
        ship_id: document.getElementById('shipIdInput').value,
        offload_employees: []
    };

    document.querySelectorAll('#offloadEmployeesList li.mdc-deprecated-list-item').forEach((el) => {
        body_json.offload_employees.push({
            employee_id: el.getAttribute('data-employee-id'),
            offload_date: el.getAttribute('data-offload-date'),
            work_hours: el.getAttribute('data-work-hours')
        });
    });

    fetch(action, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Add offload error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    offloadDialog.close();
});

document.querySelector('[role="entry-now"]').addEventListener('click', () => {
    let date = new Date();
    document.getElementById('entryDateInput').valueAsDate = date;
    document.getElementById('entryTimeInput').value = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
});

document.querySelector('[role="choose-ship"]').addEventListener('click', function() {
    offloadShipChooseCallback = chooseShipMethod;

    chooseShipDialog.open();
});

function chooseShipMethod(data) {
    let img_url = data.img_url === '' ? '/static/resources/images/ship_bg.jpg' : '/media/' + data.img_url;

    document.getElementById('chooseShipView').innerHTML = `
        <ul id="shipViewList" class="mdc-deprecated-list mdc-deprecated-list--two-line mdc-deprecated-list--avatar-list p-0">
            <li class="mdc-deprecated-list-item" tabindex="0">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons" style="background-size: cover; background-image: url(${img_url})">
                </span>
                <span class="mdc-deprecated-list-item__text">
                    <span class="mdc-deprecated-list-item__primary-text">${data.ship_name}</span>
                    <span class="mdc-deprecated-list-item__secondary-text">${data.port_name}</span>
                </span>
            </li>
        </ul>
    `;
    mdc.list.MDCList.attachTo(document.getElementById('shipViewList'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#shipViewList > li'));
    document.getElementById('shipIdInput').value = data.ship_id;
    chooseShipDialog.close();
}

document.querySelectorAll('[role="choose-ship-elem"]').forEach((el) => {
    el.addEventListener('click', function () {
        offloadShipChooseCallback({
            ship_id: this.getAttribute('data-ship-id'),
            ship_name: this.getAttribute('data-ship-name'),
            port_name: this.getAttribute('data-port-name'),
            img_url: this.getAttribute('data-img-url')
        });
    });
});

document.querySelector('[role="add-offload-employee"]').addEventListener('click', function() {
    document.getElementById('addOffloadEmployeeForm').reset();

    addOffloadEmployeeCallback = addOffloadEmployeeMethod;

    addOffloadEmployeeDialog.open();
});

function addOffloadEmployeeMethod(data) {
    let img_url = data.employee.img_url === '' ? '/static/resources/icons/account_circle.svg' : '/media/' + data.employee.img_url;

    document.getElementById('offloadEmployeesList').insertAdjacentHTML('beforeend', `
        <li class="mdc-deprecated-list-item" aria-checked="false" data-employee-id="${data.employee.employee_id}" data-offload-date="${data.date}" data-work-hours="${data.work_hours}">
            <span class="mdc-deprecated-list-item__ripple"></span>
            <span class="mdc-deprecated-list-item__graphic material-icons" style="background-size: cover; background-image: url(${img_url})">
            </span>
            <span class="mdc-deprecated-list-item__text">
                <span class="mdc-deprecated-list-item__primary-text">${data.employee.employee_name}</span>
                <span class="mdc-deprecated-list-item__secondary-text">Activity date: ${data.date}</span>
            </span>
            <span class="mdc-deprecated-list-item__meta d-flex flex-align-center">
                <span>Work hours: ${data.work_hours}</span>
                <button type="button" class="material-icons mdc-icon-button mdc-theme--error ml-4" title="Remove employee" role="remove-offload-employee" data-employee-id="${data.employee.employee_id}" data-mdc-ripple-is-unbounded="true">
                    <div class="mdc-icon-button__ripple"></div>
                    remove
                </button>
            </span>
        </li>
        <li role="separator" class="mdc-deprecated-list-divider mdc-deprecated-list-divider--padding"></li>
    `);
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#offloadEmployeesList > li:nth-last-child(2)'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#offloadEmployeesList > li:nth-last-child(2)').querySelector('.mdc-icon-button'));
    document.querySelector('#offloadEmployeesList > li:nth-last-child(2)').querySelector('[role="remove-offload-employee"]').addEventListener('click', function() {
        document.querySelector(`#offloadEmployeesList > li[data-employee-id="${this.getAttribute('data-employee-id')}"] + li`).remove();
        document.querySelector(`#offloadEmployeesList > li[data-employee-id="${this.getAttribute('data-employee-id')}"]`).remove();
    });
}

document.getElementById('addOffloadEmployeeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let employee_id = document.querySelector('[name="offload-employee-radio"]:checked').value;
    let choose_elem = document.querySelector('#addOffloadEmployeeForm [role="radio"][aria-checked="true"]');

    addOffloadEmployeeCallback({
        employee: {
            employee_id: employee_id,
            employee_name: `${choose_elem.getAttribute('data-employee-firstname')} ${choose_elem.getAttribute('data-employee-midname')} ${choose_elem.getAttribute('data-employee-lastname')}`,
            img_url: choose_elem.getAttribute('data-img-url')
        },
        date: document.getElementById('employeeOffloadDateInput').value,
        work_hours: document.getElementById('workHoursInput').value
    });

    addOffloadEmployeeDialog.close();
});

document.getElementById('deleteOffloads').addEventListener('click', function() {
    let body_json = {
        offloads_id: []
    };

    document.querySelectorAll('#offloadsTable [role="offload-row"][aria-selected="true"]').forEach((el) => {
        body_json.offloads_id.push(el.getAttribute('data-offload-id'));
    });

    fetch('/offloads/offload', {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location = '/offloads';
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Delete offloads error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
});

document.querySelectorAll('[role="edit-offload"]').forEach((el) => {
    el.addEventListener('click', function() {
        fetch(`/offloads/offload?offload_id=${this.getAttribute('data-offload-id')}`, {
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return Promise.reject();
            }
        }).then(offload => {
            openOffloadEditDialog(offload);
        }).catch(() => {
            document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Offload data fetch error occurs';
            document.getElementById('errorsSnackbar').MDCSnackbar.open();
        });
    });
});

function openOffloadEditDialog(offload) {
    document.getElementById('offloadForm').setAttribute('method', 'put');
    clearOffloadForm();
    document.getElementById('offload-dialog-title').innerHTML = 'Edit offload';

    chooseShipMethod({
        ship_id: offload['ship_id'],
        ship_name: offload['ship_name'],
        port_name: offload['port_name'],
        img_url: offload['img_url']
    });

    offload['employee_offloads'].forEach((item) => {
        let o_date = new Date(item['offload_date']);
        addOffloadEmployeeMethod({
            employee: {
                employee_id: item['employee_id'],
                employee_name: `${item['firstname']} ${item['midname']} ${item['lastname']}`,
                img_url: item['img_url']
            },
            date: item['offload_date'],
            work_hours: item['work_hours']
        });
    });

    let date = new Date(offload['entry_dt']);
    document.getElementById('offloadIdInput').value = offload['offload_id'];
    document.getElementById('entryDateInput').valueAsDate = date;
    document.getElementById('entryTimeInput').value = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    offloadDialog.open();
}

function clearOffloadForm() {
    document.getElementById('offloadForm').reset();
    document.getElementById('chooseShipView').innerHTML = `
        <div class="ship-placeholder-1"></div>
        <div class="ship-placeholder-2"></div>
        <div class="ship-placeholder-3"></div>
    `;
    document.getElementById('offloadEmployeesList').innerHTML = ``;
}

document.querySelectorAll('[role="finish-offload"]').forEach((el) => {
    el.addEventListener('click', function() {
        document.getElementById('exitOffloadForm').reset();
        document.getElementById('offloadExitIdInput').value = this.getAttribute('data-offload-id');

        exitOffloadDialog.open();
    });
});

document.querySelector('[role="exit-now"]').addEventListener('click', () => {
    let date = new Date();
    document.getElementById('exitDateInput').valueAsDate = date;
    document.getElementById('exitTimeInput').value = (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
});

document.getElementById('exitOffloadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let action = document.getElementById('exitOffloadForm').getAttribute('action');
    let method = document.getElementById('exitOffloadForm').getAttribute('method');

    let body_json = {
        offload_id: document.getElementById('offloadExitIdInput').value,
        exit_dt: document.getElementById('exitDateInput').value + ' ' + document.getElementById('exitTimeInput').value
    };

    fetch(action, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location.reload();
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Finish offload error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    exitOffloadDialog.close();
});

document.getElementById('applyOffloads').addEventListener('click', function() {
    let body_json = {
        offloads_id: []
    };

    document.querySelectorAll('#offloadsTable [role="offload-row"][aria-selected="true"]').forEach((el) => {
        body_json.offloads_id.push(el.getAttribute('data-offload-id'));
    });

    fetch('/offloads/apply', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location = '/offloads';
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Apply offloads error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
});
