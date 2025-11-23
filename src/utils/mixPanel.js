import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "641b5f52ace27ed28b8d222458364546"; // Replace this

mixpanel.init(MIXPANEL_TOKEN, {
  debug: true,
  track_pageview: true,
});

export default mixpanel;
