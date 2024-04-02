/* global Vue */
const logger = console;

Vue.createApp({
  data() {
    return {
      token: '',
      list: [],
      loading: false,
    };
  },

  async mounted() {
    setTimeout(() => this.$refs.token.focus(), 200);
  },

  methods: {
    onSubmit() {
      if (this.token.length < 5) return;
      this.loading = true;
      logger.info('token', this.token);
      window.totp.auth({ secret: this.token, window: 1 })
      .then(code => {
        this.list = [code];
      })
      .then(() => window.totp.auth({ secret: this.token }))
      .then(code => this.list.push(code))
      .catch(e => logger.error(e.message))
      .then(() => setTimeout(() => { this.loading = false; }, 1000));
    },

    onCopyToClipboard(index) {
      if (!navigator.clipboard) return;
      if (!this.list[index].length) return;
      const el = this.$refs.clipboard[index];
      navigator.clipboard.writeText(this.list[index])
      .then(() => {
        el.classList.add('try-action');
        el.classList.add('fa-beat-fade');
        setTimeout(() => {
          el.classList.remove('try-action');
          el.classList.remove('fa-beat-fade');
        }, 2500);
        logger.debug('Copied to clipboard');
      })
      .catch(e => logger.error(e.message));
    },

    onColorScheme() {
      const html = document.querySelector('html');
      html.classList.toggle('dark-scheme');
      html.classList.toggle('light-scheme');
    },
  },
}).mount('#app');
