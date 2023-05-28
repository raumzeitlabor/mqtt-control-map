// @flow
import React from "react";
import createComponent from "./base";
import { isDisabled, getValue } from "./utils";

import type { UIColorPickerAlpha } from "config/flowtypes";

import { HexAlphaColorPicker } from "react-colorful";

const changeColorValue = (item: UIColorPickerAlpha, changeState) => (newColor) => {
  changeState(item, newColor);
};

const BaseComponent = ({ Icon, Label }, item, state, changeState) => {
  return (
    <React.Fragment>
      <Icon item={item} state={state} />
      <Label />
      <HexAlphaColorPicker
        color={getValue(item, state)}
        onChange={changeColorValue(item, changeState)}
        disabled={isDisabled(item, state)}
        valueLabelDisplay="auto"
        style={isDisabled(item, state)?{marginLeft: 40,filter: 'grayscale(100%)'}:{marginLeft: 40}}
      />
    </React.Fragment>
  );
};

export default createComponent({
  id: "colorpickerAlpha",
  name: "ColorPickeAlphar",
  desc: `
    The ColorPickerAlpha can be used to choose an RGBA value.
  `,
  parameters: {
    text: "A descriptive label for the color",
    topic: "The topic id",
  },
  baseComponent: BaseComponent,
});
