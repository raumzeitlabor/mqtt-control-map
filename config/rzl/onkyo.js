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
        type: types.json("onkyo_raw", types.option({
          PWR00: "off",
          PWR01: "on"
        }))
      },
      command: {
        name: `onkyos/${topic}/command`,
        type: types.option({ off: "PWR00", on: "PWR01" })
      },
      defaultValue: "off"
    },
    [`${name}_mute`]: {
      state: {
        name: `onkyos/${topic}/status/audio-muting`,
        type: types.json("onkyo_raw", types.option({
          AMT00: "off",
          AMT01: "on"
        }))
      },
      command: {
        name: `onkyos/${topic}/command`,
        type: types.option({ off: "AMT00", on: "AMT01" })
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
        name: `onkyos/${topic}/status/latest-NPR`,
        type: types.option({
          NPR01: "mpd",
          NPR02: "kohina",
          NPR03: "somafmDronezone",
          NPR04: "somafmThetrip",
          NPR05: "querfunk",
          NPR06: "somafmDefconradio",
          NPR07: "somafmSecretagent",
          NPR08: "somafmLush",
          NPR09: "somafmBeatblender",
          NPR0a: "ponyville",
          NPR0b: "deutschlandradio",
          NPR0c: "somafmSuburbsOfGoa",
          NPR0d: "somafmSonicUniverse",
          NPR0e: "somafmChrismasLounge",
          otherwise: "unknown"
        })
      },
      command: {
        name: `onkyos/${topic}/command`,
        type: types.option({
          mpd: "NPR01",
          kohina: "NPR02",
          somafmDronezone: "NPR03",
          somafmThetrip: "NPR04",
          querfunk: "NPR05",
          somafmDefconradio: "NPR06",
          somafmSecretagent: "NPR07",
          somafmLush: "NPR08",
          somafmBeatblender: "NPR09",
          ponyville: "NPR0a",
          deutschlandradio: "NPR0b",
          somafmSuburbsOfGoa: "NPR0c",
          somafmSonicUniverse: "NPR0d",
          somafmChrismasLounge: "NPR0e",
          otherwise: "NPR00"
        })
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
        type: "section",
        text: "Lautstärkeregelung"
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
        text: "Eingänge"
      },
      {
        //FIXME: I think this needs to be instanced manually for each onkyo to make sense
        type: "dropDown",
        text: "Eingang",
        topic: `${name}_inputs`,
        options: {    //TODO: make Input config part of instance config/parameters
          netzwerk: "Netzwerk",
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
        text: "Netzwerksender",
        topic: `${name}_radios`,
        options: {
          mpd: "MPD",
          kohina: "Kohina",
          somafmDronezone: "Drone Zone (SomaFM)",
          somafmThetrip: "The Trip (SomaFM)",
          querfunk: "Querfunk",
          somafmDefconradio: "Defcon Radio (SomaFM)",
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
          && state.onkyoInputs === "netzwerk"
      },
      {
        type: "section",
        text: "External"
      },
      {
        type: "link",
        link: "http://mpd.rzl.so/mpd/player/index.php",
        text: "Open MPD Interface",
        icon: svg(icons.mdiOpenInNew)
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
