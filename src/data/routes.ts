export const Routes = {
  vods: {
    base: "/sub/vods",
    all: "/sub/vods/all",
    vod: (vodId: string) => `/sub/vods/video/${vodId}`,
  },
  auth: {
    login: "/auth/twitch/login",
    refresh: "/auth/twitch/login",
    logout: "/auth/twitch/logout",
    info: "/auth/twitch",
  },
};
