// @flow
import type { Topics } from "config/flowtypes";
import { svg } from "config/icon";
import { hex, type Color } from "config/colors";
import * as types from "config/types";
import * as icons from "@mdi/js";

import type { ControlUI } from "config/flowtypes";

/************ Tasmota ************/

export const tasmota = {
  topics: (id: string, name: string): Topics => ({
    [name]: {
      state: {
        name: `stat/sonoff${id}/POWER`,
        type: types.option({ ON: "on", OFF: "off" })
      },
      command: {
        name: `cmnd/sonoff${id}/power`,
        type: types.option({ on: "ON", off: "OFF" })
      },
      defaultValue: "off"
    },
    [`${name}_online`]: {
      state: {
        name: `tele/sonoff${id}/LWT`,
        type: types.option({ Online: "on", online: "on",
          Offline: "off", offline: "off" })
      },
      defaultValue: "off"
    }
  }),
  iconColor: (name: string, onCol: Color = hex("#00FF00")): (State => Color) =>
    (state: State): Color => {
      if (state[`${name}_online`] === "off") {
        return hex("#888888");
      } else if (state[name] === "on") {
        return onCol;
      }
      return hex("#000000");
    }
};

/************ Shelly ************/

export const shelly = {
  topics: (name: string, topic: string, relay: string): Topics => ({
    [name]: {
      state: {
        name: `shellies/${topic}/relay/${relay}`,
        type: types.option({ "on": "on", "off": "off" })
      },
      command: {
        name: `shellies/${topic}/relay/${relay}/command`,
        type: types.option({ "on": "on", "off": "off" })
      },
      defaultValue: "off"
    },
    [`${name}_online`]: {
      state: {
        name: `shellies/${topic}/online`,
        type: types.option({"on": "true", "off": "false"})
      },
      defaultValue: "off"
    }
  }),
  iconColor: (name: string, onCol: Color = hex("#00FF00")): (State => Color) =>
    (state: State): Color => {
      if (state[`${name}_online`] !== "true") {
        return hex("#888888");
      } else if (state[name] === "on") {
        return onCol;
      }
      return hex("#000000");
    }
};

/************ Shelly RGBW 2 ************/

export const shellyRGBW = {
  topics: (name: string, topic: string): Topics => ({
    [`shellyRGBW_${name}_status`]: {
      state : {
        name: `shellies/${topic}/online`,
        type: types.string
      },
    },
    [`shellyRGBW_${name}`]: {
      state : {
        name: `shellies/${topic}/color/0`,
        type: types.option({ on: "on", off: "off" })
      },
      command: {
        name: `shellies/${topic}/color/0/command`,
        type: types.option({ on: "on", off: "off" })
      },
      defaultValue: "off"
    },
    [`shellyRGBW_${name}_W`]: {
      state : {
        name: `shellies/${topic}/color/0/status`,
        type: types.json("white")
      },
      command: {
        name: `shellies/${topic}/color/0/set`,
        type: types.json("white")
      },
      defaultValue: "0"
    },
    [`shellyRGBW_${name}_fx`]: {
      state : {
        name: `shellies/${topic}/color/0/status`,
        type: types.json("effect")
      },
      command: {
        name: `shellies/${topic}/color/0/set`,
        type: types.json("effect")
      },
      defaultValue: 0
    },
    [`shellyRGBW_${name}_color`]: {
      state : {
        name: `shellies/${topic}/color/0/status`,
        type: (msg) => {
          const json = JSON.parse(msg.toString());
          if (!json) {
            return "#000000";
          }
          const red = json.red.toString(16).padStart(2, "0");
          const green = json.green.toString(16).padStart(2, "0");
          const blue = json.blue.toString(16).padStart(2, "0");
          return "#"+red+green+blue;
        }
      },
      command: {
        name: `shellies/${topic}/color/0/set`,
        type: (msg) => {
          const cleanedHexString = msg.toString().substring(1);
          const red = parseInt(cleanedHexString.substring(0,2), 16);
          const green = parseInt(cleanedHexString.substring(2,4), 16);
          const blue = parseInt(cleanedHexString.substring(4,6), 16);
          const colorObject = {
            red : red,
            green : green,
            blue : blue,
          };
          return JSON.stringify(colorObject);
        }
      },
      defaultValue: '{"red":0,"green":0,"blue":0}'
    },
  }),
  controls: (name: string): Array<ControlUI> => (
   [
    {
      type: "toggle",
      text: "Ein/Ausschalten",
      icon: svg(icons.mdiPower),
      topic: `shellyRGBW_${name}`,
      enableCondition: (state) => state[`shellyRGBW_${name}_status`] === "true"
    },
    {
      type: "colorpicker",
      text: "RGB",
      topic: `shellyRGBW_${name}_color`,
      icon: svg(icons.mdiPalette),
      enableCondition: (state) => state[`shellyRGBW_${name}_status`] === "true"
    },
    {
      type: "slider",
      min: 0,
      max: 255,
      text: "W",
      icon: svg(icons.mdiBrightness7),
      topic: `shellyRGBW_${name}_W`,
      enableCondition: (state) => state[`shellyRGBW_${name}_status`] === "true"
    },
    {
      type: "dropDown",
      text: "Effekt",
      topic: `shellyRGBW_${name}_fx`,
      options: {
        "0" : "Solid Color (no fx)",
        "1" : "fast color change",
        "2" : "slow Color fade",
        "3" : "Flash",
        "4" : "Breath",
        "5" : "ON/OFF Gradual",
        "6" : "Red/Green Change"
      },
      icon: svg(icons.mdiCog),
      enableCondition: (state) => state[`shellyRGBW_${name}_status`] === "true"
    },
  ]),
  iconColor: (name: string, onCol: Color = hex("#00FF00")): (State => Color) =>
    (state: State): Color => {
      if (state[`shellyRGBW_${name}_status`] !== "online") {
        return hex("#888888");
      } else if (state[`shellyRGBW_${name}`] == "on") {
        return onCol;
      }
      return hex("#000000");
    }
};

/************ WLED ************/

export const wled = {
  topics: (name: string, topic: string): Topics => ({
    [`wled_${name}_status`]: {
      state: {
        name: `wled/${topic}/status`,
        type: types.string
      }
    },    
    [`wled_${name}_brightness`]: {
      state: {
        name: `wled/${topic}/g`,
        type: types.string
      },
      command: {
        name: `wled/${topic}`,
        type: types.string
      },
      defaultValue: "0"
    },
    [`wled_${name}_api_fx`]: {
      state: {
        name: `wled/${topic}/v`,
        type: (msg) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(msg.toString(), 'text/xml');
          return "FX="+ xml.getElementsByTagName("fx")[0].innerHTML;
        }
      },
      command: {
        name: `wled/${topic}/api`,
        type: types.string
      },
      defaultValue: "FX=0"
    },
    [`wled_${name}_api_speed`]: {
      state: {
        name: `wled/${topic}/v`,
        type: (msg) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(msg.toString(), 'text/xml');
          return xml.getElementsByTagName("sx")[0].innerHTML;
        }
      },
      command: {
        name: `wled/${topic}/api`,
        type: types.string
      },
      defaultValue: "0"
    },
    [`wled_${name}_api_intens`]: {
      state: {
        name: `wled/${topic}/v`,
        type: (msg) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(msg.toString(), 'text/xml');
          return xml.getElementsByTagName("ix")[0].innerHTML;
        }
      },
      command: {
        name: `wled/${topic}/api`,
        type: types.string
      },
      defaultValue: "0"
    },
    [`wled_${name}_color`]: {
      state: {
        name: `wled/${topic}/c`,
        type: types.string
      },
      command: {
        name: `wled/${topic}/col`,
        type: types.string
      },
      defaultValue: "#000000"
    },
  }),
  controls: (name: string, webpage: string): Array<ControlUI> => (
    [{
      type: "toggle",
      topic: `wled_${name}_brightness`,
      text: "Ein/Ausschalten",
      icon: svg(icons.mdiPower),
      on: "255",
      off: "0",
      toggled: (n) => parseInt(n, 10) > 0,
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "slider",
      min: 1,
      max: 255,
      text: "Helligkeit",
      icon: svg(icons.mdiBrightness7),
      topic: `wled_${name}_brightness`,
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "dropDown",
      text: "Effekt",
      topic: `wled_${name}_api_fx`,
      options: {
        "FX=0": "Solid Color",
        "FX=5": "Random colors",
        "FX=8": "Colorloop",
        "FX=9": "Rainbow",
        "FX=4": "Wipe Random",
        "FX=66": "Fire 2012",
        "FX=63": "Pride 2015",
      },
      icon: svg(icons.mdiCog),
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "colorpicker",
      text: "Farbe",
      topic: `wled_${name}_color`,
      icon: svg(icons.mdiPalette),
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "slider",
      min: 1,
      max: 255,
      text: "FX Speed",
      icon: svg(icons.mdiSnail),
      topic: `wled_${name}_api_speed`,
      valueprefix: "SX=",
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "slider",
      min: 1,
      max: 255,
      text: "FX Intensity",
      icon: svg(icons.mdiFire),
      topic: `wled_${name}_api_intens`,
      valueprefix: "IX=",
      enableCondition: (state) => state[`wled_${name}_status`] === "online"
    },
    {
      type: "link",
      link: `${webpage}`,
      text: "Open Webinterface",
      icon: svg(icons.mdiOpenInNew)
    }]
  ),
  iconColor: (name: string, onCol: Color = hex("#00FF00")): (State => Color) =>
    (state: State): Color => {
      if (state[`wled_${name}_status`] !== "online") {
        return hex("#888888");
      } else if (state[`wled_${name}_brightness`] != "0") {
        return onCol;
      }
      return hex("#000000");
    }
};

/************ IKEA Floalt ************/

export const floalt = {
  color: (lightId: string): string => `floalt_${lightId}_color`,
  brightness: (lightId: string): string => `floalt_${lightId}_brightness`,
  topics: (lightId: string): Topics => ({
    [`floalt_${lightId}_color`]: {
      state: {
        name: `/service/openhab/out/tradfri_0220_gwb8d7af2b448f_${lightId}` +
                "_color_temperature/state",
        type: types.string
      },
      command: {
        name: `/service/openhab/in/tradfri_0220_gwb8d7af2b448f_${lightId}` +
                "_color_temperature/command",
        type: types.string
      },
      defaultValue: "0"
    },
    [`floalt_${lightId}_brightness`]: {
      state: {
        name: `/service/openhab/out/tradfri_0220_gwb8d7af2b448f_${lightId}` +
                "_brightness/state",
        type: types.string
      },
      command: {
        name: `/service/openhab/in/tradfri_0220_gwb8d7af2b448f_${lightId}` +
                "_brightness/command",
        type: types.string
      },
      defaultValue: "0"
    }
  })
};

/************ IKEA Tradfri ************/

const tradfriRemote = {
  level: (remoteId: string): string => `tradfri_remote_${remoteId}_level`,
  low: (remoteId: string): string => `tradfri_remote_${remoteId}_low`,
  topics: (remoteId: string): Topics => ({
    [`tradfri_remote_${remoteId}_level`]: {
      state: {
        name: `/service/openhab/out/tradfri_0830_gwb8d7af2b448f_${remoteId}` +
                "_battery_level/state",
        type: types.string
      },
      defaultValue: "0"
    },
    [`tradfri_remote_${remoteId}_low`]: {
      state: {
        name: `/service/openhab/out/tradfri_0830_gwb8d7af2b448f_${remoteId}` +
                "_battery_low/state",
        type: types.option({ ON: "true", OFF: "false" })
      },
      defaultValue: "false"
    }
  })
};

export const tradfri = {
  remote: tradfriRemote
};

const esperStatistics = (name: string,
  prevUI: Array<ControlUI> = []): Array<ControlUI> => (
  prevUI.concat([
    {
      type: "section",
      text: "Funkdose"
    },
    {
      type: "text",
      text: "Device Variant",
      icon: svg(icons.mdiChartDonut),
      topic: `esper_${name}_device`
    },
    {
      type: "text",
      text: "Version",
      icon: svg(icons.mdiSourceBranch),
      topic: `esper_${name}_version`
    },
    {
      type: "text",
      text: "IP",
      icon: svg(icons.mdiAccessPointNetwork),
      topic: `esper_${name}_ip`
    },
    {
      type: "text",
      text: "RSSI",
      icon: svg(icons.mdiWifi),
      topic: `esper_${name}_rssi`
    },
    {
      type: "text",
      text: "Running since…",
      icon: svg(icons.mdiAvTimer),
      topic: `esper_${name}_uptime`
    }
  ])
);
const esperTopics = (chipId: string, name: string): Topics => ({
  [`esper_${name}_version`]: {
    state: {
      name: `/service/esper/${chipId}/info`,
      type: types.json("version.esper")
    },
    defaultValue: "UNKNOWN"
  },
  [`esper_${name}_ip`]: {
    state: {
      name: `/service/esper/${chipId}/info`,
      type: types.json("network.ip")
    },
    defaultValue: "UNKNOWN"
  },
  [`esper_${name}_rssi`]: {
    state: {
      name: `/service/esper/${chipId}/info`,
      type: types.json("wifi.rssi")
    },
    defaultValue: "UNKNOWN"
  },
  [`esper_${name}_uptime`]: {
    state: {
      name: `/service/esper/${chipId}/info`,
      type: (msg) => new Date(JSON.parse(msg.toString()).time.startup * 1000)
        .toLocaleString()
    },
    defaultValue: "UNKNOWN"
  },
  [`esper_${name}_device`]: {
    state: {
      name: `/service/esper/${chipId}/info`,
      type: types.json("device")
    },
    defaultValue: "UNKNOWN"
  }
});

export const esper = {
  topics: esperTopics,
  statistics: esperStatistics
};
