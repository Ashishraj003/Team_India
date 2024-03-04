import { getHexMem } from "./Processor.js";

document.addEventListener('DOMContentLoaded', function () {
    // const dataContainer = document.getElementById('data-container');
    const paginationContainer = document.getElementById('pagination-container');
    const itemsPerPage = 32;
    const totalItems = 1024;
    let currentPage = 1;

///

    function decimalToHex32Bit(decimalNumber) {
        // Convert the decimal number to hexadecimal
        var hexString = decimalNumber.toString(16);

        // Pad with leading zeros to ensure 32 bits
        while (hexString.length < 8) {
            hexString = '0' + hexString;
        }
        hexString = '0' + 'x' + hexString;
        return hexString;
    }


    function loadItems(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const rem = document.querySelector("#okok");
        // rem.remremoveChild();
        rem.remove();
        const mem_holder = document.querySelector("#memory_id");
        const div = document.createElement('div');
        div.classList.add("reg_header");
        div.setAttribute('id', "okok");
        // mem_holder.appendChild(div);
        mem_holder.insertBefore(div, mem_holder.firstChild);
        const ul = document.createElement('ul');
        // ul.setAttribute('id', "ulul");
        // ul.classList.add("ulul");
        div.appendChild(ul);
        const li = document.createElement('li');
        li.setAttribute('id', "decimal");
        li.style.display = "block";
        ul.appendChild(li);

        const table = document.createElement('table');
        table.classList.add("register1-table");
        table.cellspacing = "0";
        table.setAttribute('id', "reg1_table");
        table.style.display = "block";
        li.appendChild(table);

        let head_tr = document.createElement('tr');
        table.appendChild(head_tr);

        let td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        let input = document.createElement('input');
        input.type = "text";
        input.value = "Address";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
        input.type = "text";
        input.value = "Word";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
        input.type = "text";
        input.value = "Byte 0";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
        input.type = "text";
        input.value = "Byte 1";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
        input.type = "text";
        input.value = "Byte 2";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
        input.type = "text";
        input.value = "Byte 3";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);





        let addressValue = (currentPage - 1) * 32 * 4;
        let index=(currentPage-1)*32;

        for (let i = start; i < end; i++) {
            if (i >= totalItems) {
                break;
            }

            let head_tr = document.createElement('tr');
            head_tr.classList.add("clusterize-no-data");
            table.appendChild(head_tr);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = decimalToHex32Bit(addressValue);
            input.classList.add("col_name");
            td1.appendChild(input);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "0x"+ getHexMem(index,0) +getHexMem(index,1)+getHexMem(index,2)+getHexMem(index,3);
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "0x"+ getHexMem(index,3);
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "0x"+ getHexMem(index,2);
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "0x"+ getHexMem(index,1);
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            // td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "0x"+ getHexMem(index,0);
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);



            index++;
            addressValue += 4;
        }
    }

    function updatePagination() {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = i;
            link.addEventListener('click', function (event) {
                event.preventDefault();
                currentPage = i;
                loadItems(currentPage);
                updatePagination();
            });

            if (i === currentPage) {
                link.style.backgroundColor = '#ddd';
            }
            paginationContainer.appendChild(link);
        }
        // const run=document.querySelector("#Run");
        // run.addEventListener('click',()=> {loadItems(currentPage)});
        // const step=document.querySelector("#Step-fd");
        // step.addEventListener('click',()=>{loadItems(currentPage)});
    }

    // Initial load
    loadItems(currentPage);
    updatePagination();

    const reset = document.querySelector(".reset");
    reset.addEventListener('click', ()=>{ loadItems(currentPage) });

    const run=document.querySelector(".Run");
    run.addEventListener('click',()=> {loadItems(currentPage)});
    const stepFd=document.querySelector(".Step_fd");
    stepFd.addEventListener('click',()=>{loadItems(currentPage)});
    const stepBk=document.querySelector(".Step_bk");
    stepBk.addEventListener('click',()=>{loadItems(currentPage)});


});

// fun();