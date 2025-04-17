// @flow
import type { Config } from "config/flowtypes";
import * as types from "config/types";
import { hex, rainbow } from "config/colors";
import { svg, withState } from "config/icon";
import { wled, tasmota, shelly, shellyRGBW, fritz_thermo } from "./utils";
import {onkyo} from "./onkyo";
import * as icons from "@mdi/js";


const config: Config = {
  space: {
    name: "RZL",
    color: "blue",
//    mqtt: "ws://10.10.10.209:1884" //DEBUG at home 
    mqtt: "wss://mqtt.rzl.so:1884"
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
            pre_print: "printing",
            post_print: "awaitingInteraction",
            printing: "printing",
            wait_cleanup: "awaitingInteraction",
            idle: "idle",
            error: "error",
          })
        },
        defaultValue: "unavailable"
      },
      printer3DJobName: {
        state: {
          name: "/service/ultimaker/job",
          type: (msg) => JSON.parse(msg.toString()).name || "unknown"
        },
        defaultValue: "unknown"
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
    wled.topics("lounge","lounge"),
    wled.topics("nixos","nixos"),
/************ Steckdosen (Sonoffs mit Tasmota) ************/
//    tasmota.topics("1", "Boiler"),  // BROKEN Sonoff!
//    tasmota.topics("2", "printerAnnette"),  // BROKEN Sonoff!
    tasmota.topics("4", "Infoscreen"),
//    tasmota.topics("5", "TelekomSign"),  // BROKEN Sonoff!!
    tasmota.topics("6", "Textilpresse"),
    tasmota.topics("7", "LoungeStrom"),
    tasmota.topics("8", "Boiler"),
    tasmota.topics("9", "TelekomSign"),
    tasmota.topics("11", "TischMitte"),
    tasmota.topics("12", "TischWhiteboard"),
    tasmota.topics("13", "TischBeamer"),
    tasmota.topics("14", "E-EckeNetworkSwitch"),
//    tasmota.topics("15", "XXXXX"),     // Currently Spare
    tasmota.topics("16", "Hauptraum_AV"),
/************ Lichter (RGBW shellies) ************/
    shellyRGBW.topics("LoungeL", "Lounge_RGBW_links"),
    shellyRGBW.topics("LoungeR", "Lounge_RGBW_rechts"),
    shellyRGBW.topics("HauptB", "Haupt_RGBW_beamer"),
    shellyRGBW.topics("HauptM", "Haupt_RGBW_mitte"),
    shellyRGBW.topics("HauptW", "Haupt_RGBW_whiteboard"),
    shellyRGBW.topics("WorkF", "Workshop_RGBW_folienlager"),
    shellyRGBW.topics("WorkM", "Workshop_RGBW_mitte"),
    shellyRGBW.topics("WorkB", "Workshop_RGBW_beamer"),
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
    shelly.topics("Hauptraum_putz_beam", "Hauptraum_lichter", "1"),
    shelly.topics("Hauptraum_buntlicht", "Hauptraum_buntlicht", "0"),
    shelly.topics("Speaker_light", "Speaker_light", "0"),
/************ Onkyos ************/
    onkyo.topics("Onkyo_Hauptraum", "hauptraum"),
    onkyo.topics("Onkyo_snackregal", "snackregal"),
    onkyo.topics("Onkyo_Lounge", "lounge"),
/************ Heizungsfoo ********/
    fritz_thermo.topics("H_Kueche", "Kueche", true),
    fritz_thermo.topics("S_Kueche", "Kueche/regal", false),

    fritz_thermo.topics("H_LoungeL", "Lounge/links", true),
    fritz_thermo.topics("H_LoungeR", "Lounge/rechts", true),

    fritz_thermo.topics("H_HauptTardis", "Hauptraum/tardis", true),
    fritz_thermo.topics("H_HauptBeamer", "Hauptraum/leinwand", true),
    fritz_thermo.topics("H_HauptMitte", "Hauptraum/mitte", true),
    fritz_thermo.topics("H_HauptTafel", "Hauptraum/whiteboard", true),
    fritz_thermo.topics("H_HauptRegal", "Hauptraum/regal", true),
    fritz_thermo.topics("S_Hauptraum", "Hauptraum/door", false),

    fritz_thermo.topics("H_E-Ecke", "E-Ecke", true),
    
    fritz_thermo.topics("H_WorkshopLinks", "Workshop/links", true),
    fritz_thermo.topics("H_WorkshopMitte", "Workshop/mitte", true),
    fritz_thermo.topics("H_WorkshopRechts", "Workshop/rechts", true),
    fritz_thermo.topics("S_Workshop", "Workshop/door", false),
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
              link: "http://monitoring.rzl.so",
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
              awaitingInteraction: hex("#ffdd00"),
              printing: hex("#ff0000"),
              idle: hex("#00ff00"),
              unavailable: hex("#888888"),
              error: hex("#ff0000")
            })[printer3DStatus]),
          ui: [
            {
              type: "text",
              icon: svg(icons.mdiStateMachine),
              text: "Status",
              topic: "printer3DStatus"
            },
            {
              type: "section",
              text: "Current Job"
            },
            {
              type: "text",
              icon: svg(icons.mdiTagOutline),
              text: " ",
              topic: "printer3DJobName"
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
            },
            {
              type: "section",
              text: "more info"
            },
            {
              type: "link",
              link: "http://ultimaker.rzl.so/print_jobs",
              text: "Open Webinterface",
              icon: svg(icons.mdiOpenInNew)
            },
          ]
        },
        printerDoris: {
          name: "Drucker",
          position: [938, 30],
          icon: svg(icons.mdiPrinter).color(hex("#00FF00")),
          ui: [
            {
              type: "link",
              link: "http://doris.rzl.so/",
              text: "Open Doris Web",
              icon: svg(icons.mdiOpenInNew)
            }
          ]
        },
        Boiler: {
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
        LoungeStrom: {
          name: "LoungeStrom",
          position: [600, 540],
          icon: svg(icons.mdiMultimedia).color(tasmota.iconColor("LoungeStrom")),
          ui: [
            {
              type: "toggle",
              text: "Fernseher Lounge",
              topic: "LoungeStrom",
              icon: svg(icons.mdiPower)
            }
          ]
        },
        Onkyo_Hauptraum: {
          name: "Onkyo Hauptraum",
          position: [300,465],
          icon: svg(icons.mdiAudioVideo).color(onkyo.iconColor("Onkyo_Hauptraum")),
          ui: onkyo.controls("Onkyo_Hauptraum", "http://dance-master-5k.labor.rzl.so/")
        },
        Onkyo_Workshop: {
          name: "Onkyo Workshopraum",
          position: [650,30],
          icon: svg(icons.mdiAudioVideo).color(onkyo.iconColor("Onkyo_Workshop")),
          ui: onkyo.controls("Onkyo_Workshop", "http://onkyo-tx-nr555-e0e697.labor.rzl.so")
        },
        Onkyo_Kueche: {
          name: "Onkyo Küche",
          position: [645,500],
          icon: svg(icons.mdiAudioVideo).color(onkyo.iconColor("Onkyo_Kueche")),
          ui: onkyo.controls("Onkyo_Kueche", "http://map.rzl")
        },
        Onkyo_Lounge: {
          name: "Onkyo Retrolounge",
          position: [600,570],
          icon: svg(icons.mdiAudioVideo).color(onkyo.iconColor("Onkyo_Lounge")),
          ui: onkyo.controls("Onkyo_Lounge", "http://map.rzl")
        },
        SpeakerLicht: {
          name: "Speaker Licht",
          position: [250, 650],
          icon: svg(icons.mdiHeadLightbulb).color(shelly.iconColor("Speaker_light")),
          ui: [
            {
              type: "toggle",
              text: "Speakerlicht",
              topic: "Speaker_light",
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
          icon: svg(icons.mdiLightbulbOn).color(({Lounge_buntlicht, Lounge_putzlicht, LoungeL, LoungeR}) =>
          ((Lounge_buntlicht === "on" ||
          Lounge_putzlicht === "on" ||
          LoungeL === "on" ||
          LoungeR === "on")
           ? hex("#00FF00") : hex("#000000"))),
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
          icon: svg(icons.mdiLightbulbOn).color(({Workshop_buntlicht, Workshop_putzlicht, WorkF, WorkM, WorkB}) =>
          (Workshop_buntlicht === "on" ||
           Workshop_putzlicht === "on" ||
           WorkF === "on" ||
           WorkM === "on" ||
           WorkB === "on"
           ? hex("#00FF00") : hex("#000000"))),
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
            text: "Lampe Folienlager"
          }].concat(
            shellyRGBW.controls("WorkF")
            ).concat(
              [{
                type: "section",
                text: "Lampe Mitte"
              }]
            ).concat(
              shellyRGBW.controls("WorkM")
            ).concat(
              [{
                type: "section",
                text: "Lampe Beamer"
              }]
            ).concat(
              shellyRGBW.controls("WorkB")
            )
        },
        Hauptraum: {
          name: "Hauptraum Beleuchtung",
          position: [190, 405],
          icon: svg(icons.mdiLightbulbOn).color(({Hauptraum_buntlicht, Hauptraum_putz_beam, Hauptraum_putz_white}) =>
          ((Hauptraum_buntlicht === "on" || Hauptraum_putz_beam === "on" || Hauptraum_putz_white === "on") ? hex("#00FF00") : hex("#000000"))),
          ui: [
          {
            type: "toggle",
            text: "Lichter Beamer",
            topic: "Hauptraum_putz_beam",
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
            text: "Lampe Beamer"
          }].concat(
            shellyRGBW.controls("HauptB")
            ).concat(
              [{
                type: "section",
                text: "Lampe Mitte"
              }]
            ).concat(
              shellyRGBW.controls("HauptM")
            ).concat(
              [{
                type: "section",
                text: "Lampe Whiteboard"
              }]
            ).concat(
              shellyRGBW.controls("HauptW")
            )
        },
        infinitymirror: {
          name: "WLED infinitymirror",
          position: [623, 255],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("infinitymirror")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("infinitymirror","http://wled-infinitymirror.labor.rzl.so")
          )
        },
        lounge_backlight: {
          name: "WLED lounge Backlight",
          position: [605, 585],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("loungeBacklight")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("loungeBacklight","http://wled-lounge-backlight.labor.rzl.so")
          )
        },
        lounge: {
          name: "WLED lounge main light",
          position: [450, 550],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("lounge")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("lounge","http://wled-wled-lounge.labor.rzl.so/")
          )
        },
        nixos: {
          name: "WLED NixOS light",
          position: [300, 700],
          /* eslint-disable camelcase */
          icon: svg(icons.mdiWhiteBalanceIridescent).color(
            wled.iconColor("nixos")),
            /* eslint-enable camelcase */
          ui: (
            wled.controls("nixos","http://wled-nixos.labor.rzl.so")
          )
        },
      }
    },
    {
/************ Heizung (FRITZ!DECT ) ************/
      image: require("./assets/layers/heating.svg"),
      baseLayer: true,
      name: "Heating",
      defaultVisibility: "hidden", //FIXME
      opacity: 1,
      bounds: {
        topLeft: [0, 0],
        bottomRight: [1030, 718]
      },
      controls: {
        h_kueche: {
          name: "Heizung Küche",
          position: [760, 687],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_Kueche")),
            /* eslint-enable camelcase */
          ui: (
            fritz_thermo.controls("H_Kueche")
          )
        },
        s_kueche: {
          name: "Sensor Küche",
          position: [660, 550],
          icon: svg(icons.mdiHomeThermometer).color(fritz_thermo.iconColor("S_Kueche", false)),
            /* eslint-enable camelcase */
          ui: (
            fritz_thermo.controls("S_Kueche", false)
          )
        },
        H_LoungeL : {
          name: "Heizung Lounge Links",
          position: [555, 687],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_LoungeL")),
          ui: (
            fritz_thermo.controls("H_LoungeL")
          )
        },
        H_LoungeR : {
          name: "Heizung Lounge Rechts",
          position: [430, 687],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_LoungeR")),
          ui: (
            fritz_thermo.controls("H_LoungeR")
          )
        },
        H_HauptTardis : {
          name: "Heizung Hauptraum Tardis",
          position: [290, 687],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_HauptTardis")),
          ui: (
            fritz_thermo.controls("H_HauptTardis")
          )
        },
        H_HauptBeamer : {
          name: "Heizung Hauptraum Leinwand",
          position: [30, 500],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_HauptBeamer")),
          ui: (
            fritz_thermo.controls("H_HauptBeamer")
          )
        },
        H_HauptMitte : {
          name: "Heizung Hauptraum Mitte",
          position: [30, 300],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_HauptMitte")),
          ui: (
            fritz_thermo.controls("H_HauptMitte")
          )
        },
        H_HauptTafel : {
          name: "Heizung Hauptraum Whiteboard",
          position: [30, 100],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_HauptTafel")),
          ui: (
            fritz_thermo.controls("H_HauptTafel")
          )
        },
        H_HauptRegal : {
          name: "Heizung Hauptraum Regal",
          position: [270, 25],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_HauptRegal")),
          ui: (
            fritz_thermo.controls("H_HauptRegal")
          )
        },
        S_Hauptraum : {
          name: "Sensor Hauptraum",
          position: [340, 445],
          icon: svg(icons.mdiHomeThermometer).color(fritz_thermo.iconColor("S_Hauptraum", false)),
          ui: (
            fritz_thermo.controls("S_Hauptraum", false)
          )
        },
        H_EEcke : {
          name: "Heizung E-Ecke",
          position: [490, 25],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_E-Ecke")),
          ui: (
            fritz_thermo.controls("H_E-Ecke")
          )
        },
        H_WorkshopLinks : {
          name: "Heizung Workshopraum Links",
          position: [700, 25],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_WorkshopLinks")),
          ui: (
            fritz_thermo.controls("H_WorkshopLinks")
          )
        },
        H_WorkshopMitte : {
          name: "Heizung Workshopraum Mitte",
          position: [800, 25],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_WorkshopMitte")),
          ui: (
            fritz_thermo.controls("H_WorkshopMitte")
          )
        },
        H_WorkshopRechts : {
          name: "Heizung Workshopraum Rechts",
          position: [915, 25],
          icon: svg(icons.mdiRadiator).color(fritz_thermo.iconColor("H_WorkshopRechts")),
          ui: (
            fritz_thermo.controls("H_WorkshopRechts")
          )
        },
        S_Workshop : {
          name: "Sensor Workshop",
          position: [720, 330],
          icon: svg(icons.mdiHomeThermometer).color(fritz_thermo.iconColor("S_Workshop", false)),
          ui: (
            fritz_thermo.controls("S_Workshop", false)
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
