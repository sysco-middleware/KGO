const state = {
  messages: [
    '640K ought to be enough for anybody',
    'the architects are still drafting',
    'the bits are breeding',
    'we\'re building the buildings as fast as we can',
    'would you prefer chicken, steak, or tofu?',
    'pay no attention to the man behind the curtain',
    'and enjoy the elevator music',
    'while the little elves draw your map',
    'a few bits tried to escape, but we caught them',
    'and dream of faster computers',
    'would you like fries with that?',
    'checking the gravitational constant in your locale',
    'go ahead -- hold your breath',
    'at least you\'re not on hold',
    'hum something loud while others stare',
    "you're not in Kansas any more",
    'the server is powered by a lemon and two electrodes',
    'we love you just the way you are',
    'while a larger software vendor in Seattle takes over the world',
    "we're testing your patience",
    'as if you had any other choice',
    'take a moment to sign up for our lovely prizes',
    'don\'t think of purple hippos',
    'follow the white rabbit',
    'why don\'t you order a sandwich?',
    'while the satellite moves into position',
    'the bits are flowing slowly today',
    'dig on the \'X\' for buried treasure... ARRR!',
    'it\'s still faster than you could draw it'
  ]
}

const getters = {
  randomMessages (state) {
    const random = Math.floor(Math.random() * state.messages.length) + 0
    return state.messages[random]
  }
}

const actions = {
}

const mutations = {
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
