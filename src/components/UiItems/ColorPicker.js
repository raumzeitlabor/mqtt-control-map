import React from "react";
import createComponent from "./base";
import { isDisabled, getValue } from "./utils";

import type { UIColorPicker } from "config/flowtypes";

import { HexColorPicker } from "react-colorful";

const changeColorValue = (item: UIColorPicker, changeState) => (newColor) => {
  changeState(item, newColor);
};

const BaseComponent = ({ Icon, Label }, item, state, changeState) => {
  return (
    <React.Fragment>
      <Icon item={item} state={state} />
      <Label />
      <HexColorPicker
        color={getValue(item, state)}
        onChange={changeColorValue(item, changeState)}
        disabled={isDisabled(item, state)}
        valueLabelDisplay="auto"
        style={{ marginLeft: 40 }}
      />
    </React.Fragment>
  );
};

export default createComponent({
  id: "colorpicker",
  name: "ColorPicker",
  desc: `
    The ColorPicker can be used to choose an RGB value.
  `,
  parameters: {
    text: "A descriptive label for the color",
    topic: "The topic id",
  },
  baseComponent: BaseComponent,
});
