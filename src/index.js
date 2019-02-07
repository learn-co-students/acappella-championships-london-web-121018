const groupsUrl = 'http://localhost:3000/a_cappella_groups';
const tableBodyEl = document.querySelector('#table-body');
const winnerEl = document.querySelector('#winner');
const winnerH2 = document.createElement('h2')

//STATE///////////////////////////////////////////////////////

const state = {
    groups: [],
    selectedWinner: null,
    columnSort: {name: null,
                by: false
                }
};

//RENDER TABLE////////////////////////////////////////////////

const showTableRow = (group) => {
    const groupRow = document.createElement('tr')

    groupRow.className = 'center'
    groupRow.innerHTML = `<td><button data-id='${group.id}' class='delete'>Delete</button>
                          <td>${group.college.name}</td>
                          <td>${group.name}</td>
                          <td>${group.membership}</td>
                          <td>${group.college.division}</td>
                          <td><img src='./assets/trophy.png' data-id='${group.id}'/></td>`;

    tableBodyEl.appendChild(groupRow);
};

const renderTableBody = (body=state.groups) => {
    tableBodyEl.innerHTML = '';
    body.forEach(showTableRow);
};

//RENDER WINNER HEADER////////////////////////////////////////

const showWinner = () => {
    const winner = state.selectedWinner
    const updatedTable = state.groups.filter(group => group.id !== winner.id)

    winnerEl.hidden = false
    winnerH2.className = 'padding yellow border-round'
    winnerH2.innerText = `Winner: ${winner.college.name} ${winner.name}`;
    winnerEl.append(winnerH2);

    renderTableBody(updatedTable);

};

//SORT FUNCTION////////////////////////////////////////////////

const sortColumnBy = (array= state.groups, sorter=state.columnSort.name) => {
    const unsortedArray = [...array]
    // debugger
    return unsortedArray.sort((objA, objB) => {
        switch (sorter) {
            case 'college-division':
            return objA['college']['division'].localeCompare(objB['college']['division']);
            
            case 'college-name':
            return objA['college']['name'].localeCompare(objB['college']['name']);

            default:
            return objA[sorter].localeCompare(objB[sorter]);
        };
    });
};

const reverseSortColumnBy = (array= state.groups, sorter=state.columnSort.name) => {
    const unsortedArray = [...array]
    // debugger
    return unsortedArray.sort((objA, objB) => {
        switch (sorter) {
            case 'college-division':
            return objB['college']['division'].localeCompare(objA['college']['division']);
            
            case 'college-name':
            return objB['college']['name'].localeCompare(objA['college']['name']);

            default:
            return objB[sorter].localeCompare(objA[sorter]);
        };
    });
};

//EVENT LISTENERS/////////////////////////////////////////////

const selectRow = (id) => {
    const group = state.groups.find( groupEl => groupEl.id === id);

    state.selectedWinner = group;
};

//pick a winner

const winnerBtnListener = () => {
    document.addEventListener('click', event => {
        if (event.target.tagName.includes('IMG')) {
            selectRow(parseInt(event.target.dataset.id));
            showWinner();
        };
    });
};

//delete a row

const deleteBtnListener = () => {
    document.addEventListener('click', event => {
        if (event.target.className.includes('delete')) {
            selectRow(parseInt(event.target.dataset.id));
            deleteGroup()
                .then(() => getGroups())
                .then(jso => {
                    state.groups = jso
                    renderTableBody();
                    });
            };
    });
};

//sort columns

const sortColumnListener = () => {
    document.addEventListener('click', event => {
        if (event.target.dataset.class) {
            state.columnSort.name = event.target.dataset.class
            state.columnSort.by = !state.columnSort.by

            state.columnSort.by ? renderTableBody(sortColumnBy()) : renderTableBody(reverseSortColumnBy())
        };
    });
};

//SERVER FETCHS///////////////////////////////////////////////

const getGroups = () => {
    return fetch(groupsUrl)
        .then(resp => resp.json());
};

const deleteGroup = () => {
    const id = state.selectedWinner.id;

    return fetch(`${groupsUrl}/${id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json());
};

//INITIALISE/////////////////////////////////////////////////

const init = () => {
    getGroups()
        .then(jso => {
            state.groups = jso
            renderTableBody();
        });
    winnerBtnListener();
    deleteBtnListener();
    sortColumnListener();
};

init();