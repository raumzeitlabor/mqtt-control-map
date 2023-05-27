// @flow
import type { Topics } from "config/flowtypes";
import { svg } from "config/icon";
import { hex, type color } from "config/colors";
import * as types from "config/types";
import * as icons from "@mdi/js";

export const onkyo = {
  topics: (name: string, topic: string): Topics => ({
    [`${name}_connect`]: {
      state: {
        name: `/service/${topic}/connected`,
        type: types.option({
          "0": "disconnected",
          "1": "connecting",
          "2": "connected"
        })
      },
      defaultValue: "disconnected"
    },
    [`${name}_power`]: {
      state: {
        name: `/service/${topic}/status/system-power`,
        type: types.json("onkyo_raw", types.option({
          PWR00: "off",
          PWR01: "on"
        }))
      },
      command: {
        name: `/service/${topic}/command`,
        type: types.option({ off: "PWR00", on: "PWR01" })
      },
      defaultValue: "off"
    },
    [`${name}_mute`]: {
      state: {
        name: `/service/${topic}/status/audio-muting`,
        type: types.json("onkyo_raw", types.option({
          AMT00: "off",
          AMT01: "on"
        }))
      },
      command: {
        name: `/service/${topic}/command`,
        type: types.option({ off: "AMT00", on: "AMT01" })
      },
      defaultValue: "off"
    },
    [`${name}_volume`]: {
      state: {
        name: `/service/${topic}/status/volume`,
        type: types.json("val")
      },
      command: {
        name: `/service/${topic}/set/volume`,
        type: types.string
      },
      defaultValue: "0"
    },
    [`${name}_inputs`]: {
      state: {
        name: `/service/${topic}/status/input-selector`,
        type: types.json("onkyo_raw", types.option({
          SLI11: "tisch",
          SLI01: "chromecast",
          SLI10: "pult",
          SLI2B: "netzwerk",
          SLI03: "front",
          otherwise: "unknown"
        }))
      },
      command: {
        name: `/service/${topic}/command`,
        type: types.option({
          tisch: "SLI11",
          chromecast: "SLI01",
          pult: "SLI10",
          netzwerk: "SLI2B",
          front: "SLI03",
          unknown: "SLI00"
        })
      },
      defaultValue: "unknown"
    },
    [`${name}_radios`]: {
      state: {
        name: `/service/${topic}/status/latest-NPR`,
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
        name: `/service/${topic}/command`,
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
        enableCondition: (state) => state[`${name}_connect`] === "connected"
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
        enableCondition: (state) => state[`${name}_connect`] === "connected"
      },
      {
        type: "toggle",
        text: "Mute",
        topic: `${name}_mute`,
        icon: svg(icons.mdiVolumeOff),
        enableCondition: (state) => state[`${name}_connect`] === "connected"
      },
      {
        type: "section",
        text: "Eingänge"
      },
      {
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
        enableCondition: (state) => state[`${name}_connect`] === "connected"
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
        enableCondition: (state) => state[`${name}_connect`] === "connected"
          && state.onkyoInputs === "netzwerk"
      },
      {
        type: "section",
        text: "External"
      },
      {
        type: "link",
        link: "http://mpd.rzl/mpd/player/index.php",
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
    if (state[`${name}_power`] != "0") {
      return onCol;
    }
    return hex("#000000");
  }
};
