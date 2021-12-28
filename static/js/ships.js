// init mdc
let shipDialog = mdc.dialog.MDCDialog.attachTo(document.getElementById('shipDialog'));


// set handlers
document.getElementById('addShip').onclick = function() {
    document.getElementById('shipForm').setAttribute('method', 'post');
    document.getElementById('ship-dialog-title').innerHTML = 'Add new ship';
    shipDialog.open();
}

document.getElementById('chooseShipImg').addEventListener('click', () => {
    document.getElementById('shipImgInput').click();
});

document.getElementById('shipImgInput').addEventListener('change', () => {
    let file = document.getElementById("shipImgInput").files[0];
    let reader = new FileReader();
    reader.onloadend = function() {
        document.getElementById('shipImgDisplay').style.backgroundImage = "url(" + reader.result + ")";
    }
    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('shipForm').addEventListener('submit', (e) => {


    e.preventDefault();
})


// additional requests
let ports = null;
let responsePromise = fetch('/ships/port',
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
    console.log(ports);
    setPortsToSelect(ports);
}).catch(() => console.log('Fetch ports request error'));

// methods
function setPortsToSelect(ports) {
    let html_insert = `
        <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" aria-selected="true" data-value="" role="option">
            <span class="mdc-deprecated-list-item__ripple"></span>
        </li>
    `;
    for (let i in ports['ports']) {
        html_insert += `
            <li class="mdc-deprecated-list-item" aria-selected="false" data-value="${ports['ports'][i][0]}" role="option">
                <span class="mdc-deprecated-list-item__ripple"></span>
                <span class="mdc-deprecated-list-item__text">
                    ${ports['ports'][i][1]}
                </span>
            </li>
        `;
    }

    let portsMenu = document.querySelector('#portSelectMenu ul');
    portsMenu.innerHTML = html_insert;
}
