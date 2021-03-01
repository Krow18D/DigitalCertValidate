import React from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { green, blue } from "@material-ui/core/colors";

const RegistButton = (props) => {
  // console.log(props)
  const RegistCertButStyle = withStyles((theme) => ({
    root: {
      color: theme.palette.getContrastText(green[500]),
      backgroundColor: green[300],
      borderColor: green[500],
      width: "20rem",
      height: "13rem",
      "&:hover": {
        backgroundColor: green[500],
        borderColor: green[700],
        color: blue[50],
      },
    },
  }))(Button);

  return (
    <Link
      to={{
        pathname: "/regist",
        drizzle: props.drizzle,
      }}
    >
      <RegistCertButStyle
        variant="outlined"
        color="primary"
      >
        Regist Cert
      </RegistCertButStyle>
    </Link>
  );
};

export default RegistButton;
