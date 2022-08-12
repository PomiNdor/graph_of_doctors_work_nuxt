export const state = () => ({
  buildings: [],
  specialities: [],
  users: [],
  workplaces: [],
  modelSchedules: [],
})

export const getters = {
  getUserById: (state) => (id) => {
    return state.users.find(user => user.id === id);
  },
  getWorkplacesModified: (state) => {
    return state.workplaces.filter(workplace => {
      return workplace.editStatus && workplace.editStatus !== ''
    });
  },
}

export const mutations = {
  setBuildings(state, buildings) {
    state.buildings = buildings;
  },
  setSpecialities(state, specialities) {
    state.specialities = specialities;
  },
  setUsers(state, users) {
    state.users = users;
  },
  updateUser(state, updatedUser) {
    let userIndex = state.users.findIndex(user => user.id === updatedUser.id);
    if (userIndex >= 0)
      state.users[userIndex] = updatedUser;
  },
  setWorkplaces(state, workplaces) {
    state.workplaces = workplaces;
  },
  addWorkplace(state, workplace) {
    state.workplaces.push(workplace);
  },
  updateWorkplace(state, modifiedWorkplace) {
    let workplaceIndex;

    if (modifiedWorkplace.createdId !== undefined)  // 'CREATED'
      workplaceIndex = state.workplaces.findIndex(
        workplace => workplace.createdId == modifiedWorkplace.createdId);
    else  // MODIFIED / DELETE / ''
      workplaceIndex = state.workplaces.findIndex(
        workplace => workplace.id === modifiedWorkplace.id);

    state.workplaces[workplaceIndex] = {...modifiedWorkplace};
  },
}

export const actions = {
  async loadSpecialities({commit}) {
    try {
      let response = await window.fetchRequest('/get_list_specialities/');
      let result = await response.json();
      if (!response.ok)
        throw new Error(result);
      commit('setSpecialities', result);
    } catch (e) {
      alert(e.message);
    }
  },

  async loadBuildings({commit}) {
    try {
      let response = await window.fetchRequest('/building/');
      let result = await response.json();
      if (!response.ok)
        throw new Error(result);
      commit('setBuildings', result);
    } catch (e) {
      alert(e.message);
    }
  },

  async loadUsers({commit}) {
    try {
      let response = await window.fetchRequest('/staff/');
      let result = await response.json();
      if (!response.ok)
        throw new Error(result);
      commit('setUsers', result);
    } catch (e) {
      alert(e.message);
    }
  },

  async loadWorkplaces({commit}, doctorId) {
    try {
      let response = await window.fetchRequest('/workplace/');
      let result = await response.json();
      if (!response.ok)
        throw new Error(result);

      const workplaces = result.filter(workplace => workplace.doctor === doctorId);
      commit('setWorkplaces', workplaces);
    } catch (e) {
      alert(e.message);
    }
  },
}
