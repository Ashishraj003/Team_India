/**
 * 
 * document.addEventListener('DOMContentLoaded', function () {
    const dataContainer = document.getElementById('data-container');
    const paginationContainer = document.getElementById('pagination-container');
    const itemsPerPage = 32;
    const totalItems = 1024;
    let currentPage = 1;



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
        mem_holder.appendChild(div);
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
        let head_tr =document.createElement('tr');
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
        input.value = "Address";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
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
        input.value = "Address";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);

        td1 = document.createElement('td');
        td1.classList.add("t2");
        head_tr.appendChild(td1);
        input = document.createElement('input');
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
        input.value = "Address";
        input.classList.add("col_name1");
        input.readOnly = true;
        td1.appendChild(input);






        for (let i = start; i < end; i++) {
            if (i >= totalItems) {
                break;
            }

            let head_tr = document.createElement('tr');
            head_tr.classList.add("clusterize-no-data");
            table.appendChild(head_tr);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = ${currentPage};
            input.classList.add("col_name");
            td1.appendChild(input);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "Address";
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "Address";
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "Address";
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "Address";
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);

            td1 = document.createElement('td');
            td1.classList.add("t2");
            head_tr.appendChild(td1);
            input = document.createElement('input');
            input.type = "text";
            input.value = "Address";
            input.classList.add("col_name");
            input.readOnly = true;
            td1.appendChild(input);



            // const item = document.createElement('div');
            // item.classList.add('item');
            // item.textContent = Item ${i + 1};
            // dataContainer.appendChild(item);
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
            if (i >= (totalPages / 2)) {
                const br = document.createElement('br');
                paginationContainer.appendChild(br);
            }
            paginationContainer.appendChild(link);
        }
    }

    // Initial load
    loadItems(currentPage);
    updatePagination();
});

 * 
 */