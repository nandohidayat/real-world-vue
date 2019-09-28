import EventService from "@/services/EventService.js";

export const namespaced = true;

export const state = {
  events: [],
  eventsTotal: 0,
  event: {}
};

export const mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENTS_TOTAL(state, total) {
    state.eventsTotal = total;
  },
  SET_EVENT(state, event) {
    state.event = event;
  }
};

export const actions = {
  createEvent({ commit, dispatch }, event) {
    return EventService.postEvent(event)
      .then(() => {
        commit("ADD_EVENT", event);
        const notification = {
          type: "success",
          message: "Your event has been created!"
        };
        dispatch("notification/add", notification, { root: true });
      })
      .catch(err => {
        const notification = {
          type: "error",
          message: "There was a problem creating your event: " + err.message
        };
        dispatch("notification/add", notification, { root: true });
        throw err;
      });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then(res => {
        commit("SET_EVENTS", res.data);
        commit("SET_EVENTS_TOTAL", parseInt(res.headers["x-total-count"]));
      })
      .catch(err => {
        const notification = {
          type: "error",
          message: "There was a problem fetching events: " + err.message
        };
        dispatch("notification/add", notification, { root: true });
      });
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    let event = getters.getEventById(id);

    if (event) {
      commit("SET_EVENT", event);
    } else {
      EventService.getEvent(id)
        .then(res => {
          commit("SET_EVENT", res.data);
        })
        .catch(err => {
          const notification = {
            type: "error",
            message: "There was a problem fetching event: " + err.message
          };
          dispatch("notification/add", notification, { root: true });
        });
    }
  }
};

export const getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
};
