import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { id: "abc123", name: "Adam Jahr" },
    categories: [
      "sustainability",
      "nature",
      "animal welfare",
      "housing",
      "education",
      "food",
      "community"
    ],
    events: [],
    eventsTotal: 0,
    event: {}
  },
  mutations: {
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
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() => {
        commit("ADD_EVENT", event);
      });
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(res => {
          commit("SET_EVENTS", res.data);
          commit("SET_EVENTS_TOTAL", parseInt(res.headers["x-total-count"]));
        })
        .catch(err => {
          console.log("There was an error: ", err.response);
        });
    },
    fetchEvent({ commit, getters }, id) {
      let event = getters.getEventById(id);

      if (event) {
        commit("SET_EVENT", event);
      } else {
        EventService.getEvent(id)
          .then(res => {
            commit("SET_EVENT", res.data);
          })
          .catch(err => {
            console.log("There was an error: ", err.response);
          });
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    }
  }
});
