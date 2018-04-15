import { css } from "emotion";
import * as React from "react";
import styled from "react-emotion";
const TextFieldBoxStyle = styled("div")({
  height: 44,
  backgroundColor: "rgba(255,255,255,0.10)",
  display: "inline-block",
  borderRadius: 4,
  paddingTop: 14,
  paddingBottom: 14,
  paddingLeft: 16,
  paddingRight: 16,
  fontSize: "16px",
  fontFamily: "Roboto",
  fontWeight: 300,
  boxSizing: "border-box",
  color: "rgba(255,255,255,0.70)",
  position: "relative",
  overflow: "hidden",
  "&:after": {
    content: '""',
    background: "rgba(0,0,0,0.42)",
    height: "2px",
    width: "100%",
    display: "block",
    position: "absolute",
    bottom: 0,
    left: 0
  }
});
const TextFieldBox = () => <TextFieldBoxStyle>Label</TextFieldBoxStyle>;

export const ToolBar = () => (
  <div
    className={css({
      height: 64,
      backgroundColor: "#3949AB",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    })}
  >
    {false && <TextFieldBox />}
  </div>
);
