// @flow
import React from "react";
import _ from "lodash";
import {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from "material-ui/List";
import Switch from "material-ui/Switch";
import { renderIcon } from "utils/parseIconName";
import Input, { InputLabel } from "material-ui/Input";
import { FormControl } from "material-ui/Form";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import Button from "material-ui/Button";

export type UiItemListProps = {
  controls: Array<ControlUI>,
  state: State
};

export default class UiItemList extends React.Component<UiItemListProps> {
  constructor(props: UiItemListProps) {
    super(props);
  }

  render() {
    return this.props.controls.map((control, key) => {
      if (control.type == null) {
        throw new Error(
          "A control is missing the \"type\" parameter"
        );
      }
      if (control.type === "section") {
        return this.renderControl(control);
      }
      return (
        <ListItem key={key}>
          {control.icon == null ||
            <ListItemIcon>{renderIcon(control.icon, "mdi-24px")}</ListItemIcon>}
          {this.renderControl(control)}
        </ListItem>
      );
    });
  }

  renderControl(control: ControlUI) {
    switch (control.type) {
    case "toggle": {
      return this.renderToggle(control);
    }
    case "dropDown": {
      return this.renderDropDown(control);
    }
    case "section": {
      return this.renderSection(control);
    }
    case "link": {
      return this.renderLink(control);
    }
    default: {
      throw new Error(
        `Unknown UI type "${control.type}" for "${control.text}" component`
      );
    }
    }
  }

  isEnabled(control: ControlUI) {
    const enableCondition = control.enableCondition;
    if (enableCondition == null) {
      return true;
    } else {
      const value = this.getValue(control);
      return enableCondition(
        value.internal || value.actual, value.actual, this.props.state);
    }
  }

  getValue(control: ControlUI) {
    const value = this.props.state[control.topic];
    if (value == null) {
      throw new Error(
        `Unknown topic "${control.topic}" in ${control.type} "${control.text}"`
      );
    }
    return value;
  }

  toggleSwitch(_control: ControlUI, _newState: boolean) {

  }

  renderToggle(control: ControlUI) {
    const value = this.getValue(control);
    const isToggled = control.isToggled || ((i) => i === (control.on || "on"));
    const checked = isToggled(
      value.internal || value.actual, value.actual, this.props.state);
    return [
      <ListItemText key="label" primary={control.text} />,
      <ListItemSecondaryAction key="action">
        <Switch label={control.text}
          checked={checked}
          onChange={(state) => this.toggleSwitch(control, state)}
          disabled={!this.isEnabled(control)} />
      </ListItemSecondaryAction>
    ];
  }

  changeDropDown(_control: ControlUI, _newState: string) {

  }

  renderDropDown(control: ControlUI) {
    const value = this.getValue(control);
    const id = `${control.topic}-${control.name}`;
    const options = control.options;
    if (options == null) {
      throw new Error(
        `Parameter "options" missing for ${control.type} "${control.text}"`
      );
    }
    return (
      <FormControl>
        <InputLabel htmlFor={id}>{control.text}</InputLabel>
        <Select value={value}
          onChange={(state) => this.changeDropDown(control, state)}
          disabled={!this.isEnabled(control)}
          input={<Input id={id} />}
        >
          {_.map(options, (v, k) => <MenuItem value={k} key={k}>{v}</MenuItem>)}
        </Select>
      </FormControl>
    );
  }

  renderSection(control: ControlUI) {
    return (
      <ListSubheader key={control.text}>{control.text}</ListSubheader>
    );
  }

  renderLink(control: ControlUI) {
    if (control.link == null) {
      throw new Error(
        `Parameter "link" missing for ${control.type} "${control.text}"`
      );
    }
    return (
      <Button raised
        onClick={() => window.open(control.link, "_blank")}
        color="primary"
      >
        {control.text}
      </Button>
    );
  }
}
