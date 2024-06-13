//--------------------------------Goods Receipt List------------------------


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


    document.getElementById('receiptId').value = "#GR" + randomNumber;
    document.getElementById('receiptId').disabled = true;

    document.getElementById('receiptDate').value = "";
    document.getElementById('selectedVendor').value = "";
    document.getElementById('productTableBody').innerHTML = "";

    const editSubmitBtn = document.getElementById('submitButton');
    const editUpdateBtn = document.getElementById('updateButton');

    if (editSubmitBtn.style.display === "none") {
        editUpdateBtn.style.display = "none";
        editSubmitBtn.style.display = "block";
    }
}



// ------------------------------- goods receipt form------------------------

// Focus Event listener for input fields

const inputFields = ['productSelect', 'expiryDate', 'receivedquantity',
    'receiptId', 'receiptDate', 'selectedVendor'];

inputFields.forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('focus', function () {
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
    const arr = ["", "piece", "piece", "piece", "kilogram", "piece", "piece", "kilogram"];
    let existingRow = Array.from(productTable.rows).find(row => row.cells[1].textContent === product);

    if (product.trim() === "") {
        document.getElementById('errorProductSelect').classList.add('Rerror');
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('Rerror');

    }
    if (product.trim() === "" || existingRow) {
        document.getElementById('productSelect').style.borderColor = 'red';
    }

    if (qty.trim() === "") {
        document.getElementById('receivedquantity').style.borderColor = 'red';
        document.getElementById('rqa').classList.add('qerror');

    }
    else if (qty <= 0) {
        document.getElementById('rqa').classList.add('qerror');
    }
    else {
        document.getElementById('rqa').classList.remove('qerror');

    }


    let today = new Date();
    let ed = new Date(edate);
    if (ed <= today) {
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
        const rowCount = productTable.rows.length;
        const row = productTable.insertRow(rowCount);
        row.innerHTML = `
            <td>${rowCount + 1}</td>
            <td>${product}</td>
            <td>${edate}</td>
            <td>${qty}</td>
            <td>${arr[index]}</td>    
            <td class="action">
                <i id="editIcon" onclick="editRow(this)" class="fa-solid fa-pen-to-square"></i>
                <i id="deleteIcon" onclick="deleteRow(this)" class="fa-solid fa-trash"></i>
            </td>
        `;

        // Scroll the page to the newly added row
        row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });       

        //selectDisableOption();

        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";


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
let editingMode = "false";
let parentrow = "";
function editRow(button) {
    event.preventDefault();
    editingMode = "true";

    const editIcon = document.querySelectorAll("#editIcon");
    for (let i = 0; i < editIcon.length; i++) {
        editIcon[i].style.opacity = '1';
    }
    button.style.opacity = '0.3';

    const legend = document.getElementById('lineItemLegend');
    legend.innerHTML = '<b>Update Line Item</b>';

    const row = button.parentNode.parentNode;
    parentrow = row;
    const td = row.querySelectorAll('td');
    const product = td[1].innerText;
    const date = td[2].innerText;
    const rquantity = td[3].innerText;

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

    editingMode = "false";

    const legend = document.getElementById('lineItemLegend');
    legend.innerHTML = '<b>Add Line Item</b>';

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

    if (qty.trim() === "") {
        document.getElementById('receivedquantity').style.borderColor = 'red';
        document.getElementById('rqa').classList.add('qerror');
    }
    else if (qty <= 0) {
        document.getElementById('rqa').classList.add('qerror');
    }
    else {
        document.getElementById('rqa').classList.remove('qerror');
    }


    let today = new Date();
    let ed = new Date(edate);
    if (ed <= today) {
        document.getElementById('expiryDate').style.borderColor = 'red';
        document.getElementById('expiryDate').classList.add('derror');
    }
    else {
        document.getElementById('expiryDate').classList.remove('derror');
    }

    const td = parentrow.querySelectorAll('td');

    let index = document.getElementById('productSelect').selectedIndex;
    const arr = ["", "piece", "piece", "piece", "kilogram", "piece", "piece", "kilogram"]

    const productTable = document.getElementById('productTableBody');
    let existingRow = Array.from(productTable.rows).find(row => row !== parentrow && row.cells[1].textContent === product);
    if (existingRow) {
        document.getElementById('errorProductSelect').classList.add('error');
    }
    else {
        document.getElementById('errorProductSelect').classList.remove('error');
    }


    if (product != "" && (qty != "" && qty > 0) && (edate == "" || ed >= today) && !existingRow) {

        const editIcon = document.querySelectorAll("#editIcon");
        for (let i = 0; i < editIcon.length; i++) {
            editIcon[i].style.opacity = '1';
        }

        td[1].innerText = product;
        td[2].innerText = edate;
        td[3].innerText = qty;
        td[4].innerText = arr[index];

        let add = document.getElementById('addbtn');
        let update = document.getElementById('updatebtn');
        update.style.display = 'none';
        add.style.display = 'flex';

        document.getElementById('productSelect').value = "";
        document.getElementById('expiryDate').value = "";
        document.getElementById('receivedquantity').value = "";
    }
}

//cancel Button

function cancelbtn() {
    event.preventDefault();

    editingMode = "false";

    const editIcon = document.querySelectorAll("#editIcon");
    for (let i = 0; i < editIcon.length; i++) {
        editIcon[i].style.opacity = '1';
    }

    document.getElementById('errorProductSelect').classList.remove('error');
    document.getElementById('expiryDate').classList.remove('derror');
    document.getElementById('rqa').classList.remove('qerror');
    document.getElementById('errorProductSelect').classList.remove('Rerror');


    const legend = document.getElementById('lineItemLegend');
    legend.innerHTML = '<b>Add Line Item</b>';

    let add = document.getElementById('addbtn');
    let update = document.getElementById('updatebtn');
    update.style.display = 'none';
    add.style.display = 'flex';

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
    let name = row.cells[1].innerText;
    let product = document.getElementById('productSelect').value;
    // editingMode === "false"
    if (!(name === product)) {
        const over = document.getElementById("overlay");
        const popDialog = document.getElementById("popupDialog");
        over.style.display = "block";
        popDialog.style.display = "block";
        over.classList.toggle("hidden");
        popDialog.classList.toggle("hidden");
        popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
        document.getElementById('deleteproductname').innerHTML = name;

    }
    else {
        alert("You can't delete this product while it's being updated");
    }

}

function yesfn() {
    parentrow.parentNode.removeChild(parentrow);
    const productTable = document.getElementById('productTableBody');
    const rows = productTable.rows;
    for (let i = 0; i < rows.length; i++) {
        rows[i].cells[0].innerText = i + 1;
    }

    const over = document.getElementById("overlay");
    const popDialog = document.getElementById("popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    over.classList.toggle("hidden");
    popDialog.classList.toggle("hidden");
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}

function nofn() {
    const over = document.getElementById("overlay");
    const popDialog = document.getElementById("popupDialog");
    over.style.display = "none";
    popDialog.style.display = "none";
    over.classList.toggle("hidden");
    popDialog.classList.toggle("hidden");
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";
}


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
    if (receiptId === "") {
        document.getElementById('receiptId').style.borderColor = 'red';
        check = false;
    }
    if (receiptDate === "") {
        document.getElementById('receiptDate').style.borderColor = 'red';
        check = false;
    }
    if (selectedVendor === "") {
        document.getElementById('selectedVendor').style.borderColor = 'red';
        check = false;
    }
    if (check && productTable.innerHTML === "") {
        document.getElementById('fieldsetLine').style.borderColor = 'red';
        document.getElementById('fieldsetLineError').style.display = 'block';
    }


    if (check & productTable.innerHTML !== "") {
        const newReceipt = {
            receiptID: receiptId,
            receiptDate: receiptDate,
            selectedVendor: selectedVendor,
            products: []
        };

        // Loop through each row of the table and set data to newreceipt
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            const productData = {
                id: cells[0].textContent.trim(),
                productName: cells[1].textContent.trim(),
                expiryDate: cells[2].textContent.trim(),
                quantity: cells[3].textContent.trim(),
                uom: cells[4].textContent.trim()
            };
            newReceipt.products.push(productData);
        }

        // Push the new receipt data to the global v-ariable
        receiptDatas.push(newReceipt);

        console.log("Receipt data stored:", receiptDatas);

        // Close Goods receipt form
        const createForm = document.getElementById('goodsReceiptForm');
        if (createForm.style.display === "block") {
            createForm.style.display = "none";
        }
        const over = document.getElementById("list-d-overlay");
        over.style.display = "none";

        document.getElementById('productSelect').value="";
        document.getElementById('expiryDate').value="";
        document.getElementById('receivedquantity').value="";
    
        let add = document.getElementById('addbtn');
        let update = document.getElementById('updatebtn');
    
        if(add.style.display="none"){
            update.style.display = 'none';
            add.style.display = 'flex';
        }

        // show recipt data in goods receipt list
        const receiptTable = document.getElementById('receiptTableBody');
        receiptDatas.forEach((rowData, index) => {
            const rid = rowData.receiptID;
            const rd = rowData.receiptDate;
            const vendor = rowData.selectedVendor;

            let receiptExists = false;
            for (let i = 0; i < receiptTable.rows.length; i++) {
                if (receiptTable.rows[i].cells[1].textContent === rid) {
                    receiptExists = true;
                    break;
                }
            }
            if (!receiptExists) {
                const count = receiptTable.rows.length;
                const row = receiptTable.insertRow(count);
                row.innerHTML = `
                <td>${count + 1}</td>
                <td>${rid}</td>
                <td>${rd}</td>
                <td>${vendor}</td>
                <td> <span onclick="viewLineItem(this)" id="viewLineItem"> 
                     <i class="fa-regular fa-eye"></i>View 
                     </span></td>
                <td class="action">
                    <i id="editIcon" onclick="listEditRow(this)" class="fa-solid fa-pen-to-square"></i>
                    <i id="deleteIcon" onclick="listDeleteRow(this)" class="fa-solid fa-trash"></i>
                </td>
            `;

            }

        });

    }
}

function back() {
    event.preventDefault();
    document.getElementById('fieldsetLine').style.borderColor = '';
    document.getElementById('fieldsetLineError').style.display = 'none';
    document.getElementById('receiptId').style.borderColor = '';
    document.getElementById('receiptDate').style.borderColor = '';
    document.getElementById('selectedVendor').style.borderColor = '';
    document.getElementById('productSelect').value="";
    document.getElementById('expiryDate').value="";
    document.getElementById('receivedquantity').value="";

    let add = document.getElementById('addbtn');
    let update = document.getElementById('updatebtn');

    if(add.style.display="none"){
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


}

//View Line items

function getReceiptById(receiptId) {
    return receiptDatas.find(receipt => receipt.receiptID === receiptId);
}

function viewLineItem(view) {
    const over = document.getElementById("list-overlay");
    const popDialog = document.getElementById("list-popupDialog");
    over.style.display = "block";
    popDialog.style.display = "block";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";

    const parentRow = view.parentNode.parentNode;
    const receiptIdToFind = parentRow.querySelectorAll('td')[1].innerText;

    document.getElementById('popup-receiptId').innerHTML = parentRow.querySelectorAll('td')[1].innerText;
    document.getElementById('popup-receiptDate').innerHTML = parentRow.querySelectorAll('td')[2].innerText;
    document.getElementById('popup-vendor').innerHTML = parentRow.querySelectorAll('td')[3].innerText;

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

    let name = row.cells[1].innerText;

    const over = document.getElementById("list-d-overlay");
    const popDialog = document.getElementById("list-d-popupDialog");
    over.style.display = "block";
    popDialog.style.display = "block";
    popDialog.style.opacity = popDialog.style.opacity === "1" ? "0" : "1";

    document.getElementById('deleteLineName').innerHTML = name;
}

function listYesfn() {

    const name = parentListRow.cells[1].innerText;

    const index = receiptDatas.findIndex(receipt => receipt.receiptID === name);
    if (index !== -1) {
        receiptDatas.splice(index, 1);
        parentListRow.remove();
        const productTable = document.getElementById('receiptTableBody');
        const rows = productTable.rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].cells[0].innerText = i + 1;
        }
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
    over.style.display = "none";
    popDialog.style.display = "none";
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

    document.getElementById('receiptId').value = row.cells[1].innerText;
    document.getElementById('receiptDate').value = row.cells[2].innerText;
    document.getElementById('selectedVendor').value = row.cells[3].innerText;

    const editSubmitBtn = document.getElementById('submitButton');
    const editUpdateBtn = document.getElementById('updateButton');

    if (editUpdateBtn.style.display === "none") {
        editSubmitBtn.style.display = "none";
        editUpdateBtn.style.display = "block";
    }

    const updateTable = document.getElementById('productTableBody');
    updateTable.innerHTML = "";
    const receipt = getReceiptById(row.cells[1].innerText);
    if (receipt) {
        receipt.products.forEach(product => {
            let row = `<tr>
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
}

function updateData() {

    event.preventDefault();

    const productTable = document.getElementById('productTableBody');
    const rows = productTable.rows;

    document.getElementById('h1').innerText = "Goods Receipt";

    const receiptId = document.getElementById('receiptId').value.trim();
    const receiptDate = document.getElementById('receiptDate').value.trim();
    const selectedVendor = document.getElementById('selectedVendor').value.trim();

    let check = true;
    if (receiptId === "") {
        document.getElementById('receiptId').style.borderColor = 'red';
        check = false;
    }
    if (receiptDate === "") {
        document.getElementById('receiptDate').style.borderColor = 'red';
        check = false;
    }
    if (selectedVendor === "") {
        document.getElementById('selectedVendor').style.borderColor = 'red';
        check = false;
    }
    if (check && productTable.innerHTML === "") {
        document.getElementById('fieldsetLine').style.borderColor = 'red';
        document.getElementById('fieldsetLineError').style.display = 'block';
    }


    if (check & productTable.innerHTML !== "") {
        const newReceipt = {
            receiptID: receiptId,
            receiptDate: receiptDate,
            selectedVendor: selectedVendor,
            products: []
        };

        // Loop through each row of the table and set data to newreceipt
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            const productData = {
                id: cells[0].textContent.trim(),
                productName: cells[1].textContent.trim(),
                expiryDate: cells[2].textContent.trim(),
                quantity: cells[3].textContent.trim(),
                uom: cells[4].textContent.trim()
            };
            newReceipt.products.push(productData);
        }


        const updateReceiptID = updateParentRow.cells[1].innerText;
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

        updateParentRow.cells[1].innerText = receiptId;
        updateParentRow.cells[2].innerText = receiptDate;
        updateParentRow.cells[3].innerText = selectedVendor;

        document.getElementById('productSelect').value="";
        document.getElementById('expiryDate').value="";
        document.getElementById('receivedquantity').value="";
    
        let add = document.getElementById('addbtn');
        let update = document.getElementById('updatebtn');
    
        if(add.style.display="none"){
            update.style.display = 'none';
            add.style.display = 'flex';
        }

    }

}

// Moving selected option to last


function selectDisableOption(){

    const productTablec = document.getElementById('productTableBody');
    const checkrows = productTablec.rows;
    const selectElement = document.getElementById('productSelect');

    const options = Array.from(selectElement.options);
    options.forEach((option) => {
        for (let i = 0; i < checkrows.length; i++) {
            if (option.value.trim() === checkrows[i].cells[1].innerText.trim()) {
                option.disabled = true;
                console.log(option);
                selectElement.removeChild(option);
            }
        }
    });

}


