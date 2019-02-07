const winnerHead = document.querySelector('#winner')
const tableBody = document.querySelector('#table-body')

// state
const state = {
  groups: [],
  groupWinner: null,
  loserGroups: [],
  winner: false,
  selectedGroup: null,
  sortedGroupsByCollege: [],
  sortByCollege: false,
  sortedGroupsByName: [],
  sortByName: false,
  sortedGroupsByMembership: [],
  sortByMembership: false,
  sortedGroupsByDivision: [],
  sortByDivision: false
}

// display a group row to table
function renderGroup(group) {
	const groupRow = document.createElement('tr');
	groupRow.innerHTML = `
		<td>${group.college.name}</td>
		<td>${group.name}</td>
		<td>${group.membership}</td>
	 	<td>${group.college.division}</td>
	 	<td class='center'>
      <div class='trophy-cont'>
        <i class="fas fa-trophy trophy-icon" data-id='${group.id}'></i>
      </div>
    </td>
    <td><button class='delete-btn'>Delete</button></td>
	`
  const deleteBtn = groupRow.querySelector('button')
  deleteBtn.addEventListener('click', event => {
    state.selectedGroup = group
    removeGroup()
  })
	tableBody.append(groupRow);
}

// render all gropu rows onto the table
function renderAllGroups() {
  tableBody.innerHTML = "";
  if(state.winner){
    state.loserGroups.forEach(renderGroup);
  } else if(state.sortByCollege){
    state.sortedGroupsByCollege.forEach(renderGroup);
  } else if(state.sortByDivision){
    state.sortedGroupsByDivision.forEach(renderGroup);
  } else if(state.sortByName){
    state.sortedGroupsByName.forEach(renderGroup);
  } else if(state.sortByMembership){
    state.sortedGroupsByMembership.forEach(renderGroup);
  } else {
    state.groups.forEach(renderGroup);
  }
}

// reveal winner in header
function revealWinner() {
  winnerHead.innerText = `
	  Winner: ${state.groupWinner.college.name}, ${state.groupWinner.name}
  `
  winnerHead.classList.remove('hide');
  winnerHead.parentElement.classList.remove('hide');
}

// remove winner from the table
function removeWinnerFromTable(id) {
  const loserGroups = [...state.groups];
  state.loserGroups = loserGroups.filter( group => group.id !== id );
  renderAllGroups();
}

//remove a group from the table and Server
function removeGroup() {
  deleteGroup();
  if(!state.winner){
    state.groups = state.groups.filter( group => group.id !== state.selectedGroup.id );
  } else {
    state.loserGroups = state.loserGroups.filter( group => group.id !== state.selectedGroup.id );
  }
  renderAllGroups();
}

// ---------------------- SORT TABLES BY HEADERS ----------------------

function sortTableByCollege() {
  const sortedTable = [...state.groups];
  state.sortedGroupsByCollege = sortedTable.sort(compareGroupsCollege);
}

function sortTableByDivision() {
  const sortedTable = [...state.groups];
  state.sortedGroupsByDivision = sortedTable.sort(compareGroupsCollege);
}

function sortTableByGroupName() {
  const sortedTable = [...state.groups];
  state.sortedGroupsByName = sortedTable.sort(compareGroups);
}

function sortTableByMembership() {
  const sortedTable = [...state.groups];
  state.sortedGroupsByMembership = sortedTable.sort(compareGroups);
}

// compare groups with colleges attributes
function compareGroupsCollege(group1, group2){
    const college1 = group1['college']
    const college2 = group2['college']
    let header = event.target.innerText === "College" ? 'name' : 'division'
    if( college1[header] < college2[header] ){
      return -1;
    } else if( college1[header] > college2[header] ){
      return 1;
    } else {
      return 0;
    }
}

// compare groups with their attributes
function compareGroups(group1, group2){
    let header = event.target.innerText === "Group Name" ? 'name' : 'membership';
    if( group1[header] < group2[header] ){
      return -1;
    } else if( group1[header] > group2[header] ){
      return 1;
    } else {
      return 0;
    }
}

// document event listener
function addEventListenerToDocument() {
  document.addEventListener('click', event => {
    if(event.target.classList.contains('trophy-icon')){
      state.winner = true
      groupId = parseInt(event.target.dataset.id);
      state.groupWinner = state.groups.filter( group => group.id === groupId )[0];
      revealWinner();
      removeWinnerFromTable(groupId);
    } else if(event.target.tagName === 'TH'){
      let header = event.target.innerText.toLowerCase();
      switch(header) {
        case 'division':
          state.sortByDivision = !state.sortByDivision
          state.sortByCollege = false
          state.sortByName = false
          state.sortByMembership = false
          sortTableByDivision();
          break;
        case 'group name':
          state.sortByName = !state.sortByName
          state.sortByCollege = false
          state.sortByDivision = false
          state.sortByMembership = false
          sortTableByGroupName();
          break;
        case 'membership':
          state.sortByMembership = !state.sortByMembership
          state.sortByCollege = false
          state.sortByDivision = false
          state.sortByName = false
          sortTableByMembership();
          break;
        case 'college':
          state.sortByCollege = !state.sortByCollege
          state.sortByDivision = false
          state.sortByName = false
          state.sortByMembership = false
          sortTableByCollege();
          break;
      }
      renderAllGroups();
    }
  })
}

// -------------------------  Server stuff  --------------------------

// get groups from server
function getGroups() {
  return fetch('http://localhost:3000/a_cappella_groups')
    .then(resp => resp.json())
}

// delete group from server
function deleteGroup(){
  fetch(`http://localhost:3000/a_cappella_groups/${state.selectedGroup.id}`, {
    method: 'DELETE'
  })
}

// ------------------------  On page load  ---------------------------

function initialization() {
  getGroups()
    .then(groups => {
      state.groups = groups
      renderAllGroups();
    })
  addEventListenerToDocument();
}

initialization()
