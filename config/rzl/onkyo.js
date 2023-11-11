// @flow
import type { Topics } from "config/flowtypes";
import { svg } from "config/icon";
import { hex, type Color } from "config/colors";
import * as types from "config/types";
import * as icons from "@mdi/js";

import type { ControlUI } from "config/flowtypes";

export const onkyo = {
  topics: (name: string, topic: string): Topics => ({
    [`${name}_mqtt_connect`]: {
      state: {
        name: `onkyos/${topic}/mqtt_connected`,
        type: types.option({
          "0": "disconnected",
          "1": "connected"
        })
      },
      defaultValue: "disconnected"
    },
    [`${name}_eiscp_connect`]: {
      state: {
        name: `onkyos/${topic}/eiscp_connected`,
        type: types.option({
          "0": "disconnected",
          "1": "connected"
        })
      },
      defaultValue: "disconnected"
    },
    [`${name}_power`]: {
      state: {
        name: `onkyos/${topic}/status/system-power`,
        type: types.json("val", types.option({
          off: "off",
          on: "on",
          standby: "standby"
        }))
      },
      command: {
        name: `onkyos/${topic}/set/system-power`,
        type: types.option({ off: "standby", on: "on" })
      },
      defaultValue: "off"
    },
    [`${name}_mute`]: {
      state: {
        name: `onkyos/${topic}/status/audio-muting`,
        type: types.json("val", types.option({
          off: "off",
          on: "on"
        }))
      },
      command: {
        name: `onkyos/${topic}/set/audio-muting`,
        type: types.option({ off: "off", on: "on" })
      },
      defaultValue: "off"
    },
    [`${name}_volume`]: {
      state: {
        name: `onkyos/${topic}/status/master-volume`,
        type: types.json("val")
      },
      command: {
        name: `onkyos/${topic}/set/master-volume`,
        type: types.string
      },
      defaultValue: "0"
    },
    [`${name}_inputs`]: {
      state: {
        name: `onkyos/${topic}/status/input-selector`,
        type: types.json("val")
      },
      command: {
        name: `onkyos/${topic}/set/input-selector`,
        type: types.string
      },
      defaultValue: "unknown"
    },
    [`${name}_radios`]: {
      state: {
        name: `onkyos/${topic}/status/net-usb-title-name`,
        type: types.json("val")
      },
      command: {
        name: `onkyos/${topic}/command`,
        type: types.string
      },
      defaultValue: "unknown"
    }
  }),
  controls: (name: string, webpage: string): Array<ControlUI> => (
    [
      {
        type: "toggle",
        text: "Power",
        icon: svg(icons.mdiPower),
        topic: `${name}_power`,
        enableCondition: (state) => (state[`${name}_mqtt_connect`] === "connected" && state[`${name}_eiscp_connect`] === "connected")
      },
      {
        type: "slider",
        text: "Volume",
        topic: `${name}_volume`,
        min: 0,
        max: 50,
        icon: svg(icons.mdiVolumeHigh),
        enableCondition: (state) => (state[`${name}_mqtt_connect`] === "connected" && state[`${name}_eiscp_connect`] === "connected")
      },
      {
        type: "toggle",
        text: "Mute",
        topic: `${name}_mute`,
        icon: svg(icons.mdiVolumeOff),
        enableCondition: (state) => (state[`${name}_mqtt_connect`] === "connected" && state[`${name}_eiscp_connect`] === "connected")
      },
      {
        type: "section",
        text: "Input Sources"
      },
      {
        //FIXME: I think this needs to be instanced manually for each onkyo to make sense
        type: "dropDown",
        text: "Source",
        topic: `${name}_inputs`,
        options: {    //TODO: make Input config part of instance config/parameters
          "network": "Netzwerk",
          tisch: "Tisch",
          chromecast: "Chromecast",
          pult: "Pult",
          front: "Front HDMI"
        },
        icon: svg(icons.mdiUsb),
        enableCondition: (state) => (state[`${name}_mqtt_connect`] === "connected" && state[`${name}_eiscp_connect`] === "connected")
      },
      {
        type: "dropDown",
        text: "Webradios",
        topic: `${name}_radios`,
        options: {
          Spotify: "Spotify",
          mpd: "MPD",
          kohina: "Kohina",
          somafmDronezone: "Drone Zone (SomaFM)",
          somafmThetrip: "The Trip (SomaFM)",
          querfunk: "Querfunk",
          "defcon-128-mp3": "Defcon Radio (SomaFM)",
          somafmSecretagent: "Secret Agent (SomaFM)",
          somafmLush: "Lush (SomaFM)",
          somafmBeatblender: "Beat Blender (Soma FM)",
          ponyville: "Ponyville FM",
          deutschlandradio: "Deutschlandradio",
          somafmSuburbsOfGoa: "Suburbs of Goa (SomaFM)",
          somafmSonicUniverse: "Sonic Universe (SomaFM)",
          somafmChrismasLounge: "Christmas Lounge (SomaFM)",
          unknown: "Unknown"
        },
        icon: svg(icons.mdiRadio),
        enableCondition: (state) => (state[`${name}_mqtt_connect`] === "connected" && state[`${name}_eiscp_connect`] === "connected")
          && state[`${name}_inputs`] === "network"
      },
      {
        type: "section",
        text: "External"
      },
      {
        type: "link",
        link: `${webpage}`,
        text: "Open Onkyo Webpage",
        icon: svg(icons.mdiOpenInNew)
      }
    ]
  ),
  iconColor: (name: string, onCol: Color = hex("#00FF00")): (State => Color) =>
  (state: State): Color => {
    if (state[`${name}_mqtt_connect`] !== "connected" || state[`${name}_eiscp_connect`] !== "connected") {
      return hex("#888888");
    } else if (state[`${name}_power`] === "on") {
      return onCol;
    }
    return hex("#000000");
  }
};
