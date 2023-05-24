// @flow
import type { Config } from "config/flowtypes";
import * as types from "config/types";
import { hex, rainbow } from "config/colors";
import { svg, withState } from "config/icon";
import { wled, tasmota, shelly, shellyRGBW } from "./utils";
import * as icons from "@mdi/js";

import * as onkyo from "./onkyo";

const config: Config = {
  space: {
    name: "RZL",
    color: "blue",
    mqtt: "ws://10.10.10.209:1884" //DEBUG at home 
//    mqtt: "ws://mqtt.rzl.so:1884"
  },
  collapseLayers:false,
  topics: [{
/************ Raum status  Zeugs ************/
      doorStatus: {
        state: {
          name: "/service/status",
          type: types.option({ "\"open\"": "on", "\"closed\"": "off" })
        },
        defaultValue: "off"
      },
      presenceStatus: {
        state: {
          name: "service/status/presence",
          type: types.jsonArray
        },
        defaultValue: ""
      },
      devicesStatus: {
        state: {
          name: "/service/status/devices",
          type: types.string
        },
        defaultValue: ""
      },
      powerConsumption: {
        state: {
          name: "/service/power/hauptraum/power",
          type: (msg) =>
            (Number.parseFloat(msg.toString()) / 1000).toFixed(2) + " kW"
        },
        defaultValue: ""
      },
/************ Beamer ************/
      projector: {
        state: {
          name: "/service/beamer/state",
          type: types.option({
            START_UP: "transientOn",
            START_UP_LAMP: "transientOn",
            COOLING: "transientOff",
            COOLING2: "transientOff",
            POWER_ON: "on",
            STANDBY: "off",
            unknown: "unknown",
            offline: "unknown"
          })
        },
        command: {
          name: "/service/beamer/command",
          type: types.option({
            on: "ON",
            off: "OFF",
            transientOff: "OFF",
            transientOn: "ON",
            unknown: "OFF"
          })
        },
        defaultValue: "unknown"
      },
/************ Ultimaker ************/
      printer3DStatus: {
        state: {
          name: "/service/ultimaker/state",
          type: types.option({
            unreachable: "unavailable",
            booting: "unavailable",
            "pre_print": "printing",
            "post_print": "printing",
            printing: "printing",
            idle: "idle",
            error: "error",
            otherwise: "awaitingInteraction"
          })
        },
        defaultValue: "unavailable"
      },
      printer3DProgresss: {
        state: {
          name: "/service/ultimaker/job",
          type: (msg) => JSON.parse(msg.toString()).progress || "0"
        },
        defaultValue: "0"
      },
      printer3Dremaining: {
        state: {
          name: "/service/ultimaker/job",
          type: (msg) => {
            const json = JSON.parse(msg.toString());
            if (!json || !json["time_elapsed"] || !json["time_total"]) {
              return "unavailable";
            }
            const secondsLeft = json["time_total"] - json["time_elapsed"];
            return new Date(secondsLeft * 1000).toISOString().substr(11, 8);
          }
        },
        defaultValue: "unavailable"
      },
      deko: {
        state: {
          name: "/service/deko",
          type: types.option({ ON: "on", OFF: "off" })
        },
        command: {
          name: "/service/deko/set",
          type: types.option({ on: "ON", off: "OFF" })
        },
        defaultValue: "off"
      },
    },
/************ Lichter (WLEDs) ************/
    wled.topics("infinitymirror","infinitymirror"),
    wled.topics("loungeBacklight","loungeBacklight"),
/************ Steckdosen (Sonoffs mit Tasmota) ************/
    tasmota.topics("1", "Boiler"),
    tasmota.topics("2", "printerAnnette"),
    tasmota.topics("4", "Infoscreen"),
    tasmota.topics("5", "TelekomSign"),
    tasmota.topics("6", "Textilpresse"),
    tasmota.topics("11", "TischMitte"),
    tasmota.topics("12", "TischWhiteboard"),
    tasmota.topics("13", "TischBeamer"),
    tasmota.topics("14", "E-EckeNetworkSwitch"),
    tasmota.topics("16", "Hauptraum_AV"),
/************ Lichter (RGBW shellies) ************/
    shellyRGBW.topics("LoungeL", "Lounge_RGBW_links"),
    shellyRGBW.topics("LoungeR", "Lounge_RGBW_rechts"),
/************ Lichter (Shellies) ************/
    shelly.topics("E-Ecke_licht", "E-Ecke_licht", "0"),
    shelly.topics("Flurlicht_vorne", "Flurlicht_vorne", "0"),
    shelly.topics("Flurlicht_hinten", "Flurlicht_hinten", "0"),
    shelly.topics("Foodarea", "Foodarea_lichter", "0"),
    shelly.topics("Kueche", "Foodarea_lichter", "1"),
    shelly.topics("Lounge_putzlicht", "Lounge_lichter", "0"),
    shelly.topics("Lounge_buntlicht", "Lounge_lichter", "1"),
    shelly.topics("Workshop_putzlicht", "Workshop_lichter", "0"),
    shelly.topics("Workshop_buntlicht", "Workshop_lichter", "1"),
    shelly.topics("Hauptraum_putz_white", "Hauptraum_lichter", "0"),
    shelly.topics("hauptraum_putz_beam", "Hauptraum_lichter", "1"),
    shelly.topics("Hauptraum_buntlicht", "Hauptraum_buntlicht", "0"), //replace by RGBW soon
    shelly.topics("Speaker_light", "Speaker_light", "0"),

/************ Onkyos ************/
//    onkyo.topics,
  ],

/********************************************/
/****************  LAYER   ******************/
/********************************************/
  layers: [
    {
      image: require("./assets/layers/rooms.svg"),
      baseLayer: true,
      name: "Devices",
      defaultVisibility: "visible",
      opacity: 0.7,
      bounds: {
        topLeft: [0, 0],
        bottomRight: [1030, 718]
      },
      controls: {
//        ...onkyo.controls,
        cashdesk: {
          name: "Cashdesk",
          position: [645, 580],
          icon: svg(icons.mdiCashRegister),
          ui: [
            {
              type: "link",
              link: "http://cashdesk.rzl.so/",
              text: "Open Cashdesk",
              icon: svg(icons.mdiOpenInNew)
            }
          ]
        },
        projector: {
          name: "Beamer",
          position: [110, 390],
          icon: svg(icons.mdiProjector).flipV().color(({projector}) =>
            ({
              transientOn: hex("#b3b300"),
              transientOff: hex("#b3b300"),
              on: hex("#00ff00"),
              off: hex("#000000"),
              unknown: hex("#888888")
            })[projector]),
          ui: [
            {
              type: "toggle",
              text: "Beamer",
              topic: "projector",
              toggled: (val) => val === "transientOn" || val === "on",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        door: {
          name: "Tür",
          position: [1025, 405],
          icon: svg(icons.mdiSwapHorizontal).color(({doorStatus}) =>
            (doorStatus === "on" ? hex("#00FF00") : hex("#FF0000"))),
          ui: [
            {
              type: "link",
              link: "http://s.rzl.so",
              text: "Open Status Page",
              icon: svg(icons.mdiOpenInNew)
            },
            {
              type: "text",
              text: "Anwesend",
              topic: "presenceStatus",
              icon: svg(icons.mdiAccount)
            },
            {
              type: "text",
              text: "Devices",
              topic: "devicesStatus",
              icon: svg(icons.mdiWifi)
            },
            {
              type: "text",
              text: "Power Hauptraum",
              topic: "powerConsumption",
              icon: svg(icons.mdiSpeedometer)
            }
          ]
        },
        infoscreen: {
          name: "Infoscreen",
          position: [645, 540],
          icon: svg(icons.mdiTelevisionGuide).flipV().color(
            tasmota.iconColor("infoscreen", hex("#4444FF"))
          ),
          ui: [
            {
              type: "toggle",
              text: "Infoscreen",
              topic: "Infoscreen",
              icon: svg(icons.mdiPower)
            },
            {
              type: "link",
              link: "http://infoscreen.rzl.so",
              text: "Open Infoscreen",
              icon: svg(icons.mdiOpenInNew)
            }
          ]
        },
        printer3D: {
          name: "Ultimaker 3",
          position: [890, 35],
          icon: svg(icons.mdiPrinter3d).color(({printer3DStatus}) =>
            ({
              awaitingInteraction: hex("#b3b300"),
              printing: hex("#00ff00"),
              idle: hex("#000000"),
              unavailable: hex("#888888"),
              error: hex("#ff0000")
            })[printer3DStatus]),
          ui: [
            {
              type: "link",
              link: "http://ultimaker.rzl/print_jobs",
              text: "Open Webinterface",
              icon: svg(icons.mdiOpenInNew)
            },
            {
              type: "section",
              text: "Current Job"
            },
            {
              type: "progress",
              icon: svg(icons.mdiRotateRight),
              min: 0,
              max: 1,
              text: "Printing Progress",
              topic: "printer3DProgresss"
            },
            {
              type: "text",
              text: "Time Left",
              icon: svg(icons.mdiClock),
              topic: "printer3Dremaining"
            }
          ]
        },
        printerAnnette: {
          name: "Drucker",
          position: [938, 30],
          icon: svg(icons.mdiPrinter).color(tasmota.iconColor("printerAnnette")),
          ui: [
            {
              type: "toggle",
              text: "Drucker",
              topic: "printerAnnette",
              icon: svg(icons.mdiPower)
            },
            {
              type: "link",
              link: "http://annette.rzl.so/",
              text: "Open Annette Web",
              icon: svg(icons.mdiOpenInNew)
            }
          ]
        },
        boiler: {
          name: "Boiler",
          position: [1005, 650],
          icon: svg(icons.mdiWaterBoiler).color(tasmota.iconColor("Boiler")),
          ui: [
            {
              type: "toggle",
              text: "Wasserboiler",
              topic: "Boiler",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        TelekomSign: {
          name: "TelekomSign",
          position: [1005, 30],
          icon: svg(icons.mdiAlphaTBoxOutline).color(tasmota.iconColor("TelekomSign")),
          ui: [
            {
              type: "toggle",
              text: "Telekomschild",
              topic: "TelekomSign",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        Textilpresse: {
          name: "Textilpresse",
          position: [645, 250],
          icon: svg(icons.mdiHeatWave).color(tasmota.iconColor("Textilpresse")),
          ui: [
            {
              type: "toggle",
              text: "Textilpresse",
              topic: "Textilpresse",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        TischMitte: {
          name: "TischMitte",
          position: [110, 280],
          icon: svg(icons.mdiPowerSocketDe).color(tasmota.iconColor("TischMitte")),
          ui: [
            {
              type: "toggle",
              text: "Strom + Netzwerk",
              topic: "TischMitte",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        TischWhiteboard: {
          name: "TischWhiteboard",
          position: [110, 100],
          icon: svg(icons.mdiPowerSocketDe).color(tasmota.iconColor("TischWhiteboard")),
          ui: [
            {
              type: "toggle",
              text: "Strom + Netzwerk",
              topic: "TischWhiteboard",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        TischBeamer: {
          name: "TischBeamer",
          position: [110,580],
          icon: svg(icons.mdiPowerSocketDe).color(tasmota.iconColor("TischBeamer")),
          ui: [
            {
              type: "toggle",
              text: "Strom + Netzwerk",
              topic: "TischBeamer",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        E_EckeNetworkSwitch: {
          name: "E-EckeNetworkSwitch",
          position: [386, 22],
          icon: svg(icons.mdiLan).color(tasmota.iconColor("E-EckeNetworkSwitch")),
          ui: [
            {
              type: "toggle",
              text: "Netzwerkswitch",
              topic: "E-EckeNetworkSwitch",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        Hauptraum_AV: {
          name: "Hauptraum_AV",
          position: [337, 465],
          icon: svg(icons.mdiMultimedia).color(tasmota.iconColor("Hauptraum_AV")),
          ui: [
            {
              type: "toggle",
              text: "A/V Setup",
              topic: "Hauptraum_AV",
              icon: svg(icons.mdiPower)
            }
          ]
        },
      },
    },
    {
      image: require("./assets/layers/details.svg"),
      baseLayer: false,
      name: "Details",
      defaultVisibility: "visible",
      opacity: 0.7,
      bounds: {
        topLeft: [0, 0],
        bottomRight: [1030, 718]
      },
      controls:{}
    },
    {
/************ Lichter (vor allem Shellies) ************/
      image: require("./assets/layers/lights.svg"),
      baseLayer: true,
      name: "Lights",
      defaultVisibility: "hidden",
      opacity: 1,
      bounds: {
        topLeft: [0, 0],
        bottomRight: [1030, 718]
      },
      controls: {
        Flurlicht_vorne: {
          name: "Flurlicht vorne",
          position: [800, 405],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Flurlicht_vorne")),
          ui: [{
              type: "toggle",
              text: "Licht",
              topic: "Flurlicht_vorne",
              icon: svg(icons.mdiPower)
          }]
        },
        Flurlicht_hinten: {
          name: "Flurlicht hinten",
          position: [500, 405],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Flurlicht_hinten")),
          ui: [{
              type: "toggle",
              text: "Licht",
              topic: "Flurlicht_hinten",
              icon: svg(icons.mdiPower)
          }]
        },
        Lounge_lichter: {
          name: "Lounge Beleuchtung",
          position: [500, 605],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Lounge_putzlicht")),
          ui: [
          {
            type: "toggle",
            text: "Putz Lichter",
            topic: "Lounge_putzlicht",
            icon: svg(icons.mdiPower)
          }, {
            type: "toggle",
            text: "RGBW Lichter",
            topic: "Lounge_buntlicht",
            icon: svg(icons.mdiPower)
          }, {
            type: "section",
            text: "Lampe links"
          }].concat(
          shellyRGBW.controls("LoungeL")
          ).concat(
            [{
              type: "section",
              text: "Lampe rechts"
            }]
          ).concat(
            shellyRGBW.controls("LoungeR")
          )
        },
        E_Ecke_licht: {
          name: "E-Ecke Beleuchtung",
          position: [490, 165],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("E-Ecke_licht")),
          ui: [{
              type: "toggle",
              text: "Licht",
              topic: "E-Ecke_licht",
              icon: svg(icons.mdiPower)
          }]
        },
        Foodarea: {
          name: "Foodarea Beleuchtung",
          position: [740, 605],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Foodarea")),
          ui: [{
              type: "toggle",
              text: "Licht",
              topic: "Foodarea",
              icon: svg(icons.mdiPower)
          }]
        },
        Kueche: {
          name: "Kueche Beleuchtung",
          position: [930, 605],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Kueche")),
          ui: [{
              type: "toggle",
              text: "Licht",
              topic: "Kueche",
              icon: svg(icons.mdiPower)
          }]
        },
        Workshop: {
          name: "Workshop Beleuchtung",
          position: [800, 165],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Workshop_putzlicht")),
          ui: [
          {
            type: "toggle",
            text: "Putz Lichter",
            topic: "Workshop_putzlicht",
            icon: svg(icons.mdiPower)
          }, {
            type: "toggle",
            text: "RGBW Lichter",
            topic: "Workshop_buntlicht",
            icon: svg(icons.mdiPower)
          }, {
            type: "section",
            text: "Lampe links"
          }, {
            type: "section",
            text: "Lampe Mitte"
          },
          {
            type: "section",
            text: "Lampe rechts"
          },
        ]
        },
        Hauptraum: {
          name: "Hauptraum Beleuchtung",
          position: [190, 405],
          icon: svg(icons.mdiLightbulbOn).color(shelly.iconColor("Workshop_putzlicht")),
          ui: [
          {
            type: "toggle",
            text: "Lichter Beamer",
            topic: "hauptraum_putz_beam",
            icon: svg(icons.mdiPower)
          }, {
            type: "toggle",
            text: "Lichter Whiteboard",
            topic: "Hauptraum_putz_white",
            icon: svg(icons.mdiPower)
          }, {
            type: "toggle",
            text: "RGBW Lichter",
            topic: "Hauptraum_buntlicht",
            icon: svg(icons.mdiPower)
          }, {
            type: "section",
            text: "Lampe links"
          }, {
            type: "section",
            text: "Lampe Mitte"
          },
          {
            type: "section",
            text: "Lampe rechts"
          },
        ]
        },
        infinitymirror: {
          name: "WLED infinitymirror",
          position: [623, 255],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("infinitymirror")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("infinitymirror","http://10.5.0.13/")
          )
        },
        lounge_backlight: {
          name: "WLED lounge Backlight",
          position: [623, 605],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("loungeBacklight")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("loungeBacklight","http://10.5.0.37")
          )
        },
      }
    },
    {
      image: require("./assets/layers/labels.svg"),
      baseLayer: false,
      name: "Labels",
      defaultVisibility: "hidden",
      opacity: 1,
      bounds: {
        topLeft: [0, 0],
        bottomRight: [1030, 718]
      },
      controls: {}
    },
  ]
};

window.config = config;
