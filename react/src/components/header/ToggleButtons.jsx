import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

export default function ToggleButtons() {
  const [alignment, setAlignment] = React.useState("work");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="work" size="small" aria-label="work">
        作業
      </ToggleButton>
      <ToggleButton value="break" size="small" aria-label="break">
        休憩
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
