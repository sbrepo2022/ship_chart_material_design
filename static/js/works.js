let worksLimitSelect = document.getElementById('worksLimitSelect').MDCSelect;
let activityDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('activityDialog'));
let employeeChooseCallback;
let chooseEmployeeDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('chooseEmployeeDialog'));


worksLimitSelect.listen('MDCSelect:change', function() {
    updateTable({ limit: worksLimitSelect.value });
}, false);

document.getElementById('nextPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('activityTable').getAttribute('data-limit'));
    let offset = Number(document.getElementById('activityTable').getAttribute('data-offset'));
    let count = Number(document.getElementById('activityTable').getAttribute('data-count'));
    updateTable({ offset: offset + limit + limit > count ? count - limit : offset + limit });
});

document.getElementById('prevPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('activityTable').getAttribute('data-limit'));
    let offset = Number(document.getElementById('activityTable').getAttribute('data-offset'));
    updateTable({ offset: offset - limit < 0 ? 0 : offset - limit });
});

document.getElementById('firstPageButton').addEventListener('click', function() {
    updateTable({ offset: 0 });
});

document.getElementById('lastPageButton').addEventListener('click', function() {
    let limit = Number(document.getElementById('activityTable').getAttribute('data-limit'));
    let count = Number(document.getElementById('activityTable').getAttribute('data-count'));
    updateTable({ offset: count - limit < 0 ? 0 : count - limit });
});

function updateTable(new_val) {
    let limit = 'limit' in new_val ? new_val.limit : document.getElementById('activityTable').getAttribute('data-limit');
    let offset = 'offset' in new_val ? new_val.offset : document.getElementById('activityTable').getAttribute('data-offset');

    window.location = `/works?limit=${limit}&offset=${offset}`;
}

document.getElementById('addActivity').addEventListener('click', function() {
    activityDialog.open();

    document.getElementById('activityForm').setAttribute('method', 'post');
    clearActivityForm();
    document.getElementById('activity-dialog-title').innerHTML = 'Add new activity';
});

document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let action = document.getElementById('activityForm').getAttribute('action');
    let method = document.getElementById('activityForm').getAttribute('method');

    let body_json = {
        activity_id: document.getElementById('activityIdInput').value,
        activity_date: document.getElementById('activityDateInput').value,
        employee_id: document.getElementById('employeeIdInput').value,
        work_type: document.getElementById('workTypeInput').value,
        work_hours: document.getElementById('workHoursInput').value,
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
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Add activity error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });

    activityDialog.close();
});

document.querySelector('[role="activity-now"]').addEventListener('click', () => {
    document.getElementById('activityDateInput').valueAsDate = new Date();
});

document.querySelector('[role="choose-employee"]').addEventListener('click', function() {
    employeeChooseCallback = chooseEmployeeMethod;

    chooseEmployeeDialog.open();
});

function chooseEmployeeMethod(data) {
    let img_url = data.img_url === '' ? '/static/resources/icons/account_circle.svg' : '/media/' + data.img_url;

    document.getElementById('chooseEmployeeView').innerHTML = `
        <ul id="employeeViewList" class="mdc-deprecated-list mdc-deprecated-list--two-line mdc-deprecated-list--avatar-list p-0">
            <li class="mdc-deprecated-list-item" tabindex="0">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__graphic material-icons" style="background-size: cover; background-image: url(${img_url})">
                </span>
                <span class="mdc-deprecated-list-item__text">
                    <span class="mdc-deprecated-list-item__primary-text">${ data.firstname } ${ data.midname } ${ data.lastname }</span>
                    <span class="mdc-deprecated-list-item__secondary-text">Department #${ data.department_id }</span>
                </span>
            </li>
        </ul>
    `;
    mdc.list.MDCList.attachTo(document.getElementById('employeeViewList'));
    mdc.ripple.MDCRipple.attachTo(document.querySelector('#employeeViewList > li'));
    document.getElementById('employeeIdInput').value = data.employee_id;
    chooseEmployeeDialog.close();
}

document.querySelectorAll('[role="choose-employee-elem"]').forEach((el) => {
    el.addEventListener('click', function () {
        employeeChooseCallback({
            employee_id: this.getAttribute('data-employee-id'),
            firstname: this.getAttribute('data-employee-firstname'),
            midname: this.getAttribute('data-employee-midname'),
            lastname: this.getAttribute('data-employee-lastname'),
            birthday: this.getAttribute('data-employee-birthday'),
            admission: this.getAttribute('data-employee-admission'),
            dismission: this.getAttribute('data-employee-dismission'),
            department_id: this.getAttribute('data-department-id'),
            img_url: this.getAttribute('data-img-url')
        });
    });
});

document.querySelectorAll('[role="edit-activity"]').forEach((el) => {
    el.addEventListener('click', function() {
        fetch(`/works/work?activity_id=${this.getAttribute('data-activity-id')}`, {
            method: 'get'
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return Promise.reject();
            }
        }).then(activity => {
            openActivityEditDialog(activity);
        }).catch(() => {
            document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Activity data fetch error occurs';
            document.getElementById('errorsSnackbar').MDCSnackbar.open();
        });
    });
});

function openActivityEditDialog(activity) {
    document.getElementById('activityForm').setAttribute('method', 'put');
    clearActivityForm();
    document.getElementById('activity-dialog-title').innerHTML = 'Edit activity';

    chooseEmployeeMethod({
        employee_id: activity['employee_id'],
        firstname: activity['firstname'],
        midname: activity['midname'],
        lastname: activity['lastname'],
        birthday: activity['birthday'],
        admission: activity['admission'],
        dismission: activity['dismission'],
        department_id: activity['department_id'],
        img_url: activity['img_url']
    });

    document.getElementById('activityIdInput').value = activity['activity_id'];
    document.getElementById('activityDateInput').valueAsDate = new Date(activity['activity_date']);
    document.getElementById('workTypeComponent').MDCTextField.value = activity['work_type'];
    document.getElementById('workHoursComponent').MDCTextField.value = activity['work_hours'];

    activityDialog.open();
}

function clearActivityForm() {
    document.getElementById('activityForm').reset();
    document.getElementById('chooseEmployeeView').innerHTML = `
        <div class="employee-placeholder-1"></div>
        <div class="employee-placeholder-2"></div>
        <div class="employee-placeholder-3"></div>
    `;
}

document.getElementById('deleteActivity').addEventListener('click', function() {
    let body_json = {
        activities_id: []
    };

    document.querySelectorAll('#activityTable [role="activity-row"][aria-selected="true"]').forEach((el) => {
        body_json.activities_id.push(el.getAttribute('data-activity-id'));
    });

    fetch('/works/work', {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location = '/works';
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Delete activities error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
});

document.getElementById('payForActivity').addEventListener('click', function() {
    let body_json = {
        activities_id: []
    };

    document.querySelectorAll('#activityTable [role="activity-row"][aria-selected="true"]').forEach((el) => {
        body_json.activities_id.push(el.getAttribute('data-activity-id'));
    });

    fetch('/works/pay', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_json)
    }).then(response => {
        if (response.status === 200) {
            window.location = '/works';
        }
        else {
            return Promise.reject();
        }
    }).catch(() => {
        document.querySelector('#errorsSnackbar .mdc-snackbar__label').innerHTML = 'Pay for works error occurs';
        document.getElementById('errorsSnackbar').MDCSnackbar.open();
    });
});