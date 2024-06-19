// CreateButton function

let randomNumberArray = [];
function createBtn() {
    const createForm = document.getElementById('goodsReceiptForm');
    if (createForm.style.display === "none") {
        createForm.style.display = "block";
    }
    const over = document.getElementById("list-d-overlay");
    over.style.display = "block";

    let randomNumber;
    do {
        randomNumber = Math.floor(10000 + Math.random() * 90000);
    } while (randomNumberArray.includes(randomNumber));

    randomNumberArray.push(randomNumber);

    let startDate = document.getElementById('receiptDate');

    let maxDate = new Date();
    const formattedMaxDate = maxDate.toISOString().split('T')[0];
    startDate.setAttribute('max', formattedMaxDate);

    let endDateInput = document.getElementById('expiryDate');
    endDateInput.setAttribute('min', formattedMaxDate);

    document.getElementById('receiptId').value = "#GR" + randomNumber;
    document.getElementById('receiptId').disabled = true;
    document.getElementById('receiptDate').value = formattedMaxDate;
    document.getElementById('selectedVendor').value = "";
    document.getElementById('productTableBody').innerHTML = "";

    const editSubmitBtn = document.getElementById('submitButton');
    const editUpdateBtn = document.getElementById('updateButton');

    if (editSubmitBtn.style.display === "none") {
        editUpdateBtn.style.display = "none";
        editSubmitBtn.style.display = "block";
    }
    document.getElementById('selectAllRow').checked = false;
    document.getElementById('selectAllDeleteBtn').style.display = "none";
    document.getElementById('selectAndDeleteBtn').style.display = "block";
    //clear all checkboxes
    clearAllCheckboxes();
}

// -------------------------Goods Receipt Form------------------------
// Expiry Date condition
document.getElementById('receiptDate').addEventListener('change', function () {
    let startDate = new Date(document.getElementById('receiptDate').value);
    let endDateInput = document.getElementById('expiryDate');

    endDateInput.setAttribute('min', startDate.toISOString().split('T')[0]);

    if (new Date(endDateInput.value) < startDate) {
        endDateInput.value = '';
    }
});

// Focus Eventlistener for input fields
const inputFields = ['productSelect', 'expiryDate', 'receivedquantity', 'receiptId', 'receiptDate', 'selectedVendor'];
inputFields.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('focus', function() {
        this.style.borderColor = '#ddd';
    });
});

//Add Lineitems
function addProductRow() {
    event.preventDefault();
    let product = document.getElementById('productSelect').value;
    let edate = document.getElementById('expiryDate').value;
    let qty = document.getElementById('receivedquantity').value;
    const productTable = document.getElementById('productTableBody');
    let index = document.getElementById('productSelect').selectedIndex;
    const arr = ["", "pieces", "pieces", "pieces", "kilogram", "pieces", "pieces", "kilogram"];
    let existingRow = Array.from(productTable.rows).find(row => row.cells[2].textContent === product);

    if (product.trim() === "") {
        document.getElementById('errorProductSelect').classList.add('Rerror');
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('Rerror');
    }

    if (product.trim() === "" || existingRow) {
        document.getElementById('productSelect').style.borderColor = 'red';
    }

    if (qty.trim() === "" || qty <= 0) {
        document.getElementById('receivedquantity').style.borderColor = 'red';
        document.getElementById('rqa').classList.add('qerror');
    }
    else {
        document.getElementById('rqa').classList.remove('qerror');
        document.getElementById('receivedquantity').style.borderColor = ';'
    }

    let today = new Date(document.getElementById('receiptDate').value);
    let ed = new Date(edate);
    if (ed < today) {
        document.getElementById('expiryDate').style.borderColor = 'red';
        document.getElementById('expiryDate').classList.add('derror');
    }
    else {
        document.getElementById('expiryDate').classList.remove('derror');
    }

    if (existingRow) {
        document.getElementById('errorProductSelect').classList.add('error');
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('error');
    }

    if (product != "" && (qty != "" && qty > 0) && (edate == "" || ed >= today) && !existingRow) {
        document.getElementById('fieldsetLine').style.borderColor = '';
        document.getElementById('fieldsetLineError').style.display = 'none';

        let formatChangedDate = dateFormatChange(edate);
        console.log(edate);

        const rowCount = productTable.rows.length;
        const row = productTable.insertRow(rowCount);
        row.innerHTML = `
            <td><input type="checkbox" class="selectProductRow"></td>
            <td>${rowCount + 1}</td>
            <td>${product}</td>
            <td>${formatChangedDate}</td>
            <td>${qty}</td>
            <td>${arr[index]}</td>    
            <td class="action">
                <i id="editIcon" title="edit" onclick="editRow(this)" class="fa-solid fa-pen-to-square"></i>
                <i id="deleteIcon" title="delete" onclick="deleteRow(this)" class="fa-solid fa-trash"></i>
            </td>
        `;

        // Scroll the page to the newly added row
        row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";
        loop2();
    }
}

//Clear Lineitems
function clearProductRow() {
    event.preventDefault();
    let product = document.getElementById('productSelect');
    let edate = document.getElementById('expiryDate');
    let qty = document.getElementById('receivedquantity');
    product.style.borderColor = '#ddd';
    edate.style.borderColor = '#ddd';
    qty.style.borderColor = '#ddd';
    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');
    product.value = "";
    edate.value = "";
    qty.value = "";
}

//Edit Lineitem
let parentrow = "";
function editRow(button) {
    event.preventDefault();
    const editIcon = document.querySelectorAll("#editIcon");
    for (let i = 0; i < editIcon.length; i++) {
        editIcon[i].style.opacity = '1';
    }
    button.style.opacity = '0.3';

    document.getElementById('lineItemLegend').innerHTML = '<b>Update Line Item</b>';
    const row = button.parentNode.parentNode;
    parentrow = row;

    const td = row.querySelectorAll('td');
    const product = td[2].innerText;

    let formatChangedDate = dateFormatChange(td[3].innerText);
    const date = formatChangedDate;

    const rquantity = td[4].innerText;

    let add = document.getElementById('addbtn');
    let update = document.getElementById('updatebtn');
    add.style.display = 'none';
    update.style.display = 'flex';

    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('productSelect').style.borderColor = '#ddd';
    document.getElementById('expiryDate').style.borderColor = '#ddd';
    document.getElementById('receivedquantity').style.borderColor = '#ddd';
    document.getElementById('productSelect').value = product;
    document.getElementById('expiryDate').value = date;
    document.getElementById('receivedquantity').value = rquantity;
}

//Update Line Item button
function updateProductRow(event) {
    event.preventDefault();
    document.getElementById('lineItemLegend').innerHTML = '<b>Add Line Item</b>';
    document.getElementById('errorProductSelect').classList.remove('error');

    let product = document.getElementById('productSelect').value;
    let edate = document.getElementById('expiryDate').value;
    let qty = document.getElementById('receivedquantity').value;

    if (product.trim() === "") {
        document.getElementById('productSelect').style.borderColor = 'red';
        document.getElementById('errorProductSelect').classList.add('Rerror');
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('Rerror');
    }

    if (qty.trim() === "" || qty <= 0) {
        document.getElementById('receivedquantity').style.borderColor = 'red';
        document.getElementById('rqa').classList.add('qerror');
    }
    else {
        document.getElementById('rqa').classList.remove('qerror');
        document.getElementById('receivedquantity').style.borderColor = ';'
    }

    let today = new Date(document.getElementById('receiptDate').value);
    let ed = new Date(edate);
    if (ed < today) {
        document.getElementById('expiryDate').style.borderColor = 'red';
        document.getElementById('expiryDate').classList.add('derror');
    }
    else {
        document.getElementById('expiryDate').classList.remove('derror');
    }

    const td = parentrow.querySelectorAll('td');
    let index = document.getElementById('productSelect').selectedIndex;
    const arr = ["", "pieces", "pieces", "pieces", "kilogram", "pieces", "pieces", "kilogram"]

    const productTable = document.getElementById('productTableBody');
    let existingRow = Array.from(productTable.rows).find(row => row !== parentrow && row.cells[2].textContent === product);
    if (existingRow) {
        document.getElementById('errorProductSelect').classList.add('error');
        document.getElementById('productSelect').style.borderColor = 'red';
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('error');
    }

    let formatChangedDate = dateFormatChange(edate);

    if (product != "" && (qty != "" && qty > 0) && (edate == "" || ed >= today) && !existingRow) {
        const editIcon = document.querySelectorAll("#editIcon");
        for (let i = 0; i < editIcon.length; i++) {
            editIcon[i].style.opacity = '1';
        }
        td[2].innerText = product;
        td[3].innerText = formatChangedDate;
        td[4].innerText = qty;
        td[5].innerText = arr[index];
        document.getElementById('updatebtn').style.display = 'none';
        document.getElementById('addbtn').style.display = 'flex';
        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";
        loop2();
    }
}

// Cancel Button
function cancelbtn() {
    event.preventDefault();
    const editIcon = document.querySelectorAll("#editIcon");
    for (let i = 0; i < editIcon.length; i++) {
        editIcon[i].style.opacity = '1';
    }
    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');
    document.getElementById('lineItemLegend').innerHTML = '<b>Add Line Item</b>';
    document.getElementById('updatebtn').style.display = 'none';
    document.getElementById('addbtn').style.display = 'flex';
    let product = document.getElementById('productSelect');
    let edate = document.getElementById('expiryDate');
    let qty = document.getElementById('receivedquantity');
    product.style.borderColor = '#ddd';
    edate.style.borderColor = '#ddd';
    qty.style.borderColor = '#ddd';
    product.value = "";
    edate.value = "";
    qty.value = "";
}



//Delete Lineitem

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    parentrow = row;
    let name = row.cells[2].innerText;
    let product = document.getElementById('productSelect').value;
    if (!(name == product)) {
        const over = document.getElementById("overlay");
        const popDialog = document.getElementById("popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        over.classList.toggle("hidden");
        popDialog.classList.toggle("hidden");
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleterowproductname').innerHTML = name;
    }
    else {
        alert("You can't delete this product while it's being Updating");
    }

}

function yesfn() {
    parentrow.parentNode.removeChild(parentrow);
    const productTable = document.getElementById('productTableBody');
    const rows = productTable.rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[1].innerText = i + 1;
    }

    const over = document.getElementById("overlay");
    const popDialog = document.getElementById("popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}

function nofn() {
    const over = document.getElementById("overlay");
    const popDialog = document.getElementById("popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}

// Changing Date Format
function dateFormatChange(receiptDate) {
    if (receiptDate === "") {
        return "";
    }
    const parts = receiptDate.split('-');
    const formatChangedDate = parts[2] + '-' + parts[1] + '-' + parts[0];
    return formatChangedDate;
}

//submit button in Goods Receipt Form
//Store data in array object
let receiptDatas = [];

function storeData() {
    event.preventDefault();
    const productTable = document.getElementById('productTableBody');
    const rows = productTable.rows;

    const receiptId = document.getElementById('receiptId').value.trim();
    const receiptDate = document.getElementById('receiptDate').value.trim();
    const selectedVendor = document.getElementById('selectedVendor').value.trim();

    let check = true;
    if (selectedVendor === "") {
        document.getElementById('selectedVendor').style.borderColor = 'red';
        check = false;
    }
    if (check && productTable.innerHTML === "") {
        document.getElementById('fieldsetLine').style.borderColor = 'red';
        document.getElementById('fieldsetLineError').style.display = 'block';
    }

    let formatChangedDate = dateFormatChange(receiptDate);
    let checkUpdateBtn = (document.getElementById('updatebtn').style.display === 'flex');
    if (checkUpdateBtn) {
        alert('Product update in progress. Please wait');
    }

    if (check && productTable.innerHTML !== "" && !checkUpdateBtn) {
        const newReceipt = {
            receiptID: receiptId,
            receiptDate: formatChangedDate,
            selectedVendor: selectedVendor,
            products: []
        };

        // Loop through each row of the table and set data to newreceipt
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            const productData = {
                id: cells[1].textContent.trim(),
                productName: cells[2].textContent.trim(),
                expiryDate: cells[3].textContent.trim(),
                quantity: cells[4].textContent.trim(),
                uom: cells[5].textContent.trim()
            };
            newReceipt.products.push(productData);
        }

        // Push the new receipt data to the global variable
        receiptDatas.push(newReceipt);

        console.log("Receipt data stored:", receiptDatas);

        // Close Goods receipt form
        const createForm = document.getElementById('goodsReceiptForm');
        if (createForm.style.display === "block") {
            createForm.style.display = "none";
        }
        const over = document.getElementById("list-d-overlay");
        over.style.display = "none";

        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";

        let add = document.getElementById('addbtn');
        let update = document.getElementById('updatebtn');

        if (add.style.display = "none") {
            update.style.display = 'none';
            add.style.display = 'flex';
        }
        // show recipt data in goods receipt list
        const receiptTable = document.getElementById('receiptTableBody');
        receiptDatas.forEach((rowData) => {
            const rid = rowData.receiptID;
            const rd = rowData.receiptDate;
            const vendor = rowData.selectedVendor;

            let receiptExists = false;
            for (let i = 0; i < receiptTable.rows.length; i++) {
                if (receiptTable.rows[i].cells[2].textContent === rid) {
                    receiptExists = true;
                    break;
                }
            }
            if (!receiptExists) {
                const count = receiptTable.rows.length;
                const row = receiptTable.insertRow(count);
                row.innerHTML = `
                <td><input type="checkbox" class="selectRow"></td>
                <td>${count + 1}</td>
                <td>${rid}</td>
                <td>${rd}</td>
                <td>${vendor}</td>
                <td class="action">
                    <i id="viewLineItem" title="view" onclick="viewLineItem(this)" class="fa-solid fa-eye"></i>
                    <i id="editIcon" title="edit" onclick="listEditRow(this)" class="fa-solid fa-pen-to-square"></i>
                    <i id="deleteIcon" title="delete" onclick="listDeleteRow(this)" class="fa-solid fa-trash"></i>
                </td>
            `;

            }

        });
        document.getElementById('errorProductSelect').classList.remove('error');
        document.getElementById('expiryDate').classList.remove('derror');
        document.getElementById('rqa').classList.remove('qerror');
        document.getElementById('errorProductSelect').classList.remove('Rerror');
        document.getElementById('productSelect').style.borderColor = '';
        document.getElementById('receivedquantity').style.borderColor = '';
        loop();
        clearAllProductCheckboxes();
    }


}

function back() {
    event.preventDefault();
    document.getElementById('fieldsetLine').style.borderColor = '';
    document.getElementById('fieldsetLineError').style.display = 'none';
    document.getElementById('receiptId').style.borderColor = '';
    document.getElementById('receiptDate').style.borderColor = '';
    document.getElementById('selectedVendor').style.borderColor = '';
    document.getElementById('productSelect').value = "";
    document.getElementById('expiryDate').value = "";
    document.getElementById('receivedquantity').value = "";

    let add = document.getElementById('addbtn');
    let update = document.getElementById('updatebtn');

    if (add.style.display = "none") {
        update.style.display = 'none';
        add.style.display = 'flex';
    }

    document.getElementById('h1').innerText = "Goods Receipt";

    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');
    document.getElementById('productSelect').style.borderColor = '';
    document.getElementById('receivedquantity').style.borderColor = '';


    const createForm = document.getElementById('goodsReceiptForm');
    if (createForm.style.display === "block") {
        createForm.style.display = "none";
    }
    const over = document.getElementById("list-d-overlay");
    over.style.display = "none";
    clearAllProductCheckboxes();
}

const address = {
    "Ramasamy Exports & Imports Private Limited":"No. 6, Sri Ram Complex, 4 Road, Chithode, Erode-638 102",
    "Aayush Food Products":"10, Mandi Street, Near Bustand, Big Kanchipuram, Kanchipuram-631 605",
    "Laxmi Enterprices":"713, Min Nagar, 6th Street, Kanchi Main Road, Near Bus Depot, Tiruvannamalai-606 604"
};

function getReceiptById(receiptId) {
    return receiptDatas.find(receipt => receipt.receiptID === receiptId);
}
//View Line items
function viewLineItem(view) {
    const over = document.getElementById("list-overlay");
    const popDialog = document.getElementById("list-popupDialog");
    over.style.display = "block";
    popDialog.style.display = "block";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";

    const parentRow = view.parentNode.parentNode;
    const receiptIdToFind = parentRow.querySelectorAll('td')[2].innerText;

    let a=parentRow.querySelectorAll('td')[4].innerText;

    document.getElementById('popup-receiptId').innerHTML = parentRow.querySelectorAll('td')[2].innerText;
    document.getElementById('popup-receiptDate').innerHTML = parentRow.querySelectorAll('td')[3].innerText;
    document.getElementById('popup-vendor').innerHTML = parentRow.querySelectorAll('td')[4].innerText;
    document.getElementById('popup-vendor-details').innerHTML = address[a];

    const viewTable = document.getElementById('viewTableBody');
    viewTable.innerHTML = "";
    const receipt = getReceiptById(receiptIdToFind);
    if (receipt) {
        receipt.products.forEach(product => {
            let row = `<tr>
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${product.expiryDate}</td>
            <td>${product.quantity + " " + product.uom}</td>
        </tr>`;
            viewTable.innerHTML += row;
        });
    }
}

function closefn() {
    const over = document.getElementById("list-overlay");
    const popDialog = document.getElementById("list-popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}

// Delete Line item
let parentListRow = "";

function listDeleteRow(button) {
    const row = button.parentNode.parentNode;
    parentListRow = row;
    let name = row.cells[2].innerText;

    const over = document.getElementById("list-d-overlay");
    const popDialog = document.getElementById("list-d-popupDialog");
    over.style.display = "block";
    popDialog.style.display = "block";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";

    document.getElementById('deleteLineName').innerHTML = name;
}

function listYesfn() {

    const name = parentListRow.cells[2].innerText;
    const index = receiptDatas.findIndex(receipt => receipt.receiptID === name);
    if (index !== -1) {
        receiptDatas.splice(index, 1);
        parentListRow.classList.add('row-delete-animation');

        setTimeout(() => {
            parentListRow.remove();
            const productTable = document.getElementById('receiptTableBody');
            const rows = productTable.rows;
            for (let i = 0; i < rows.length; i++) {
                rows[i].cells[1].innerText = i + 1;
            }
        }, 600);
    }
    const over = document.getElementById("list-d-overlay");
    const popDialog = document.getElementById("list-d-popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}



function listNofn() {
    const over = document.getElementById("list-d-overlay");
    const popDialog = document.getElementById("list-d-popupDialog");
    popDialog.style.display = "none";
    over.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}


let updateParentRow = "";
//Edit List row
function listEditRow(button) {

    const createForm = document.getElementById('goodsReceiptForm');
    if (createForm.style.display === "none") {
        createForm.style.display = "block";
    }

    document.getElementById('h1').innerText = "Update Goods Receipt";

    document.getElementById('productSelect').style.borderColor = '#ddd';
    document.getElementById('expiryDate').style.borderColor = '#ddd';
    document.getElementById('receivedquantity').style.borderColor = '#ddd';
    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');

    const over = document.getElementById("list-d-overlay");
    over.style.display = "block";
    document.getElementById('productTableBody').innerHTML = "";
    const row = button.parentNode.parentNode;
    updateParentRow = row;

    let formatChangedDate = dateFormatChange(row.cells[3].innerText.trim());
    console.log(dateFormatChange(row.cells[3].innerText.trim()));

    document.getElementById('receiptId').value = row.cells[2].innerText;
    document.getElementById('receiptDate').value = formatChangedDate;
    document.getElementById('selectedVendor').value = row.cells[4].innerText;

    const editSubmitBtn = document.getElementById('submitButton');
    const editUpdateBtn = document.getElementById('updateButton');

    if (editUpdateBtn.style.display === "none") {
        editSubmitBtn.style.display = "none";
        editUpdateBtn.style.display = "block";
    }

    const updateTable = document.getElementById('productTableBody');
    updateTable.innerHTML = "";
    const receipt = getReceiptById(row.cells[2].innerText);
    if (receipt) {
        receipt.products.forEach(product => {
            let row = `<tr>
            <td><input type="checkbox" class="selectProductRow"></td>
            <td>${product.id}</td>
            <td>${product.productName}</td>
            <td>${product.expiryDate}</td>
            <td>${product.quantity}</td>
            <td>${product.uom}</td>
            <td class="action">
                <i id="editIcon" onclick="editRow(this)" class="fa-solid fa-pen-to-square"></i>
                <i id="deleteIcon" onclick="deleteRow(this)" class="fa-solid fa-trash"></i>
            </td>
        </tr>`;
            updateTable.innerHTML += row;
        });
    }
    document.getElementById('selectAllRow').checked = false;
    document.getElementById('selectAllDeleteBtn').style.display = "none";
    document.getElementById('selectAndDeleteBtn').style.display = "block";
    //clear all checkboxes
    clearAllCheckboxes();
    loop2();
}

function updateData() {
    event.preventDefault();
    const productTable = document.getElementById('productTableBody');
    const rows = productTable.rows;
    const receiptId = document.getElementById('receiptId').value.trim();
    const receiptDate = document.getElementById('receiptDate').value.trim();
    const selectedVendor = document.getElementById('selectedVendor').value.trim();

    let check = true;
    if (selectedVendor === "") {
        document.getElementById('selectedVendor').style.borderColor = 'red';
        check = false;
    }
    if (check && productTable.innerHTML === "") {
        document.getElementById('fieldsetLine').style.borderColor = 'red';
        document.getElementById('fieldsetLineError').style.display = 'block';
    }

    let formatChangedDate = dateFormatChange(receiptDate);
    let checkUpdateBtn = (document.getElementById('updatebtn').style.display === 'flex');
    if (checkUpdateBtn) {
        alert('Product update in progress. Please wait');
    }

    if (check && productTable.innerHTML !== "" && !checkUpdateBtn) {

        document.getElementById('h1').innerText = "Goods Receipt";

        const newReceipt = {
            receiptID: receiptId,
            receiptDate: formatChangedDate,
            selectedVendor: selectedVendor,
            products: []
        };
        // Loop through each row of the table and set data to newreceipt
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            const productData = {
                id: cells[1].textContent.trim(),
                productName: cells[2].textContent.trim(),
                expiryDate: cells[3].textContent.trim(),
                quantity: cells[4].textContent.trim(),
                uom: cells[5].textContent.trim()
            };
            newReceipt.products.push(productData);
        }
        const updateReceiptID = updateParentRow.cells[2].innerText;
        const index = receiptDatas.findIndex(receipt => receipt.receiptID === updateReceiptID);
        if (index !== -1) {
            receiptDatas[index] = newReceipt;
        }

        console.log("Receipt data stored:", receiptDatas);

        const createForm = document.getElementById('goodsReceiptForm');
        if (createForm.style.display === "block") {
            createForm.style.display = "none";
        }
        const over = document.getElementById("list-d-overlay");
        over.style.display = "none";

        // show receipt data in goods receipt list
        updateParentRow.cells[2].innerText = receiptId;
        updateParentRow.cells[3].innerText = formatChangedDate;
        updateParentRow.cells[4].innerText = selectedVendor;

        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";

        let add = document.getElementById('addbtn');
        let update = document.getElementById('updatebtn');

        if (add.style.display = "none") {
            update.style.display = 'none';
            add.style.display = 'flex';
        }

        document.getElementById('errorProductSelect').classList.remove('error');
        document.getElementById('expiryDate').classList.remove('derror');
        document.getElementById('rqa').classList.remove('qerror');
        document.getElementById('errorProductSelect').classList.remove('Rerror');
        document.getElementById('productSelect').style.borderColor = '';
        document.getElementById('receivedquantity').style.borderColor = '';
        clearAllProductCheckboxes();
    }

}

//Functions for Checkboxes
function loop() {
    const selectAllRow = document.getElementById('selectAllRow');
    const checkboxes = document.querySelectorAll('.selectRow');
    const selectAndDeleteBtn = document.getElementById('selectAndDeleteBtn');
    const selectAllDeleteBtn = document.getElementById('selectAllDeleteBtn');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllRow.checked;
        checkbox.addEventListener('change', () => {
            updateDeleteButtons(checkboxes, selectAllRow, selectAndDeleteBtn, selectAllDeleteBtn);
        });
    });
}

//Select and Delete
function selectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.selectRow');
    const selectAllRowCheckbox = document.getElementById('selectAllRow');
    const selectAndDeleteBtn = document.getElementById('selectAndDeleteBtn');
    const selectAllDeleteBtn = document.getElementById('selectAllDeleteBtn');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        checkbox.addEventListener('change', () => {
            updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteProductBtn, selectAllDeleteProductBtn);
        });
    });
    updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteBtn, selectAllDeleteBtn);
}

function updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteBtn, selectAllDeleteBtn) {
    let allChecked = true;
    let anyChecked = false;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            anyChecked = true;
        } else {
            allChecked = false;
        }
    });

    selectAllRowCheckbox.checked = allChecked;

    if (allChecked) {
        selectAndDeleteBtn.style.display = "none";
        selectAllDeleteBtn.style.display = "block";
    } else if (anyChecked) {
        selectAndDeleteBtn.style.display = "block";
        selectAllDeleteBtn.style.display = "none";
    } else {
        selectAndDeleteBtn.style.display = "block";
        selectAllDeleteBtn.style.display = "none";
    }
}

//Open Popup for DeleteAll Btn
let flagSelectAllDeleteBtn = false;
function selectAllDeleteBtn() {
    if (document.getElementById('selectAllRow').checked === true) {
        const over = document.getElementById("list-d-overlay");
        const popDialog = document.getElementById("selectList-d-popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteReceiptId').innerHTML = "Are you sure you want to Delete All Receipt";
        flagSelectAllDeleteBtn = true;
    }
}


//Delete Method Yes or no Funtions
function deleteListYesfn() {

    if (flagSelectAllDeleteBtn) {
        receiptDatas = [];
        const receiptTableBody = document.getElementById('receiptTableBody');
        receiptTableBody.innerHTML = '';
        const over = document.getElementById("list-d-overlay");
        const popDialog = document.getElementById("selectList-d-popupDialog");
        over.style.display = "none";
        popDialog.style.display = "none";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteReceiptId').innerHTML = "";
        document.getElementById('selectAllRow').checked = false;
        flagSelectAllDeleteBtn = false;

        return;
    }
    else if (flagSelectAndDeleteBtn) {
        const over = document.getElementById("list-d-overlay");
        const popDialog = document.getElementById("selectList-d-popupDialog");
        over.style.display = "none";
        popDialog.style.display = "none";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteReceiptId').innerHTML = "";

        const selectedCheckboxes = document.querySelectorAll('.selectRow:checked');
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            const receiptId = row.cells[2].innerText;
            const index = receiptDatas.findIndex(receipt => receipt.receiptID === receiptId);
            if (index !== -1) {
                receiptDatas.splice(index, 1);
            }
            row.remove();
        });
        const productTable = document.getElementById('receiptTableBody');
        const rows = productTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[1].innerText = i + 1;
        }
        flagSelectAndDeleteBtn = false;
        return;
    }
    
// line items Delete Button
    if (flagSelectAllProductDeleteBtn) {
        const productTableBody = document.getElementById('productTableBody');
        productTableBody.innerHTML = '';
        const over = document.getElementById("p-overlay");
        const popDialog = document.getElementById("p-popupDialog");
        over.style.display = "none";
        popDialog.style.display = "none";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteproductname').innerHTML = "";
        document.getElementById('SelectAllProductRow').checked = false;
        flagSelectAllProductDeleteBtn = false;
        document.getElementById('selectAllDeleteProductBtn').style.display="none";
        document.getElementById('selectAndDeleteProductBtn').style.display="block";
        return;
    }
    else if(flagSelectAndDeleteProductBtn){
        const over = document.getElementById("p-overlay");
        const popDialog = document.getElementById("p-popupDialog");
        over.style.display = "none";
        popDialog.style.display = "none";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteproductname').innerHTML = "";

        const selectedCheckboxes = document.querySelectorAll('.selectProductRow:checked');
        selectedCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });

        const productTable = document.getElementById('productTableBody');
        const rows = productTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[1].innerText = i + 1;
        }
        flagSelectAndDeleteProductBtn = false;

        return; 
    }


}

//No for Select and Delete Method
function deleteListNofn() {
    if (flagSelectAllDeleteBtn) {
        const selectRowsClear = document.querySelectorAll('.selectRow');
        selectRowsClear.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    const over = document.getElementById("list-d-overlay");
    const popDialog = document.getElementById("selectList-d-popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";

    document.getElementById('selectAllRow').checked = false;
    document.getElementById('selectAllDeleteBtn').style.display = "none";
    document.getElementById('selectAndDeleteBtn').style.display = "block";

    flagSelectAllDeleteBtn = false;
    flagSelectAndDeleteBtn = false;
    console.log(flagSelectAllDeleteBtn, flagSelectAndDeleteBtn);
}


function deletePoductListNofn() {
    if (flagSelectAllProductDeleteBtn) {
        const selectRowsClear = document.querySelectorAll('.selectProductRow');
        selectRowsClear.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    const over = document.getElementById("p-overlay");
    const popDialog = document.getElementById("p-popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
    document.getElementById('deleteproductname').innerHTML = "";
    document.getElementById('SelectAllProductRow').checked = false;
    flagSelectAllProductDeleteBtn = false;
}


//Open Popup for Select and Delete Btn
let flagSelectAndDeleteBtn = false;
function selectAndDeleteBtn() {
    const selectRows = document.querySelectorAll('.selectRow');
    let checkedIdArray = [];

    selectRows.forEach(checkbox => {
        if (checkbox.checked) {
            const row = checkbox.closest('tr');
            const checkedReceiptID = row.cells[2].innerText;
            checkedIdArray.push(checkedReceiptID);
        }
    });
    if (checkedIdArray.length > 0) {
        const over = document.getElementById("list-d-overlay");
        const popDialog = document.getElementById("selectList-d-popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteReceiptId').innerHTML = "Are you sure you want to Delete the selected receipt(s) " + "<b>" + checkedIdArray + "</b>";
        flagSelectAndDeleteBtn = true;
        checkedIdArray = [];
    }
}

function clearAllCheckboxes() {
    const selectRowsClear = document.querySelectorAll('.selectRow');
    selectRowsClear.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// CheckBoxes function for Lineitems---
function loop2() {
    let selectAllRow = document.getElementById('SelectAllProductRow');
    let checkboxes = document.querySelectorAll('.selectProductRow');
    let selectAndDeleteProductBtn = document.getElementById('selectAndDeleteProductBtn');
    let selectAllDeleteProductBtn = document.getElementById('selectAllDeleteProductBtn');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllRow.checked;
        checkbox.addEventListener('change', () => {
            updateDeleteButtons(checkboxes, selectAllRow, selectAndDeleteProductBtn, selectAllDeleteProductBtn);
        });
    });
}

function clearAllProductCheckboxes() {
    const selectRowsClear = document.querySelectorAll('.selectProductRow');
    selectRowsClear.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('SelectAllProductRow').checked=false;
}

//SelectAll checkbox
function selectAllProduct(selectAllCheckbox) {
    const selectAllRowCheckbox = document.getElementById('SelectAllProductRow');
    const checkboxes = document.querySelectorAll('.selectProductRow');
    const selectAndDeleteProductBtn = document.getElementById('selectAndDeleteProductBtn');
    const selectAllDeleteProductBtn = document.getElementById('selectAllDeleteProductBtn');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
        checkbox.addEventListener('change', () => {
            updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteProductBtn, selectAllDeleteProductBtn);
        });
    });
    updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteProductBtn, selectAllDeleteProductBtn);
}

function updateDeleteButtons(checkboxes, selectAllRowCheckbox, selectAndDeleteBtn, selectAllDeleteBtn) {
    let allChecked = true;
    let anyChecked = false;

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            anyChecked = true;
        } else {
            allChecked = false;
        }
    });

    selectAllRowCheckbox.checked = allChecked;

    if (allChecked) {
        selectAndDeleteBtn.style.display = "none";
        selectAllDeleteBtn.style.display = "block";
    } else if (anyChecked) {
        selectAndDeleteBtn.style.display = "block";
        selectAllDeleteBtn.style.display = "none";
    } else {
        selectAndDeleteBtn.style.display = "block";
        selectAllDeleteBtn.style.display = "none";
    }
}

//select all delete for line items
let flagSelectAllProductDeleteBtn = false;
function selectAllProductDeleteBtn() {
    if (document.getElementById('SelectAllProductRow').checked == true) {
        const over = document.getElementById("p-overlay");
        const popDialog = document.getElementById("p-popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteproductname').innerHTML = "All Products";

        flagSelectAllProductDeleteBtn = true;
    }
}

let flagSelectAndDeleteProductBtn = false;
function SelectAndDeleteProductBtn() {

    const selectRows = document.querySelectorAll('.selectProductRow');
    let checkedIdArray = [];

    selectRows.forEach(checkbox => {
        if (checkbox.checked) {
            const row = checkbox.closest('tr');
            const checkedReceiptID = row.cells[2].innerText;
            checkedIdArray.push(checkedReceiptID);
        }
    });
    if (checkedIdArray.length > 0) {
        const over = document.getElementById("p-overlay");
        const popDialog = document.getElementById("p-popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteproductname').innerHTML = "this Products "+"<b>[ "+ checkedIdArray +" ]</b>";
        flagSelectAndDeleteProductBtn = true;
        checkedIdArray = [];
    }
}

