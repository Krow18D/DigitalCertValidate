import React, { useMemo, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import fileImportIcon from "../svg/upload.svg";
import pdfIcon from "../svg/pdf.svg";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import axios from "axios";
import { drizzleReactHooks } from "@drizzle/react-plugin";
const { useDrizzleState } = drizzleReactHooks;

const activeStyle = {
  borderColor: "gold",
};

const acceptStyle = {
  borderColor: "royalblue",
};

const rejectStyle = {
  borderColor: "red",
};

function Dropbox(props) {
  const drizzle = props.drizzle;
  const contract = drizzle.contracts.Poe;
  const drizzleState = useDrizzleState((drizzleState) => drizzleState);
  const baseStyle = props.dropboxStyle;
  const picsize = props.picsize;
  const history = useHistory();
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    open,
  } = useDropzone({ accept: "application/*", noClick: true, noKeyboard: true });

  const [fileAvailable, setFileAvailable] = useState(false);
  const initialRenderReset = useRef(true);
  const initialRenderSubmit = useRef(true);
  const initialRenderValidate = useRef(true);

  const files = acceptedFiles.map((file) => (
    <ul key={file.path}>
      <img
        src={pdfIcon}
        alt="pdf icon made by Dimitry Miroliubov from www.flaticon.com/authors/dimitry-miroliubov"
        width="16px"
      />
      {"  "}
      {file.path}
    </ul>
  ));

  useEffect(() => {
    if (initialRenderReset.current) {
      initialRenderReset.current = false;
    } else {
      // console.log("from useEffect" + props.reset);
      while (acceptedFiles.length > 0) {
        // console.log(ele);
        acceptedFiles.pop();
      }
      setFileAvailable(false);
      return () => console.log("reset");
    }
  }, [props.reset]);

  useEffect(() => {
    if (initialRenderSubmit.current) {
      initialRenderSubmit.current = false;
    } else {
      console.log("useEffect submit " + props.submitReg);
      console.log(drizzle)
      const data = new FormData();
      if (acceptedFiles.length > 0) {
        data.append("file", acceptedFiles[0]);
        // console.log(data)
        axios
          .post("http://localhost:9876/registcert", data)
          .then((res) => {
            contract.methods["addCertificate"].cacheSend(res.data, {
              from: drizzleState.accounts[0],
            });
          })
          .catch((e) => console.log(e));
        history.push("/regsuccess");
      }
    }
  }, [props.submitReg]);

  useEffect(() => {
    if (initialRenderValidate.current) {
      initialRenderValidate.current = false;
    } else {
      console.log("useEffect validate " + props.validate);
      // console.log(props.publicKey)
      const data = new FormData();
      if (acceptedFiles.length > 0) {
        data.append("file", acceptedFiles[0]);
        // console.log(data)
        axios
          .post("http://localhost:9876/gethash", data)
          .then((res) => {
            contract.methods
              .findCertificate(res.data)
              .call()
              .then((res) => {
                if (res[2] !== "0" && res[1] === props.publicKey) {
                  console.log("Available");
                }
                else{
                  console.log("Not Available")
                }
              });
          })
          .catch((e) => console.log(e));
      }
    }
    // contract.methods["addCertificate"].cacheSend(res.data,{from:drizzleState.accounts[0]})
    // 0x2bbaea7517a8e52961a7a77d747db9c178d881c1e18b7b6133bec735a99f20353a9e628c30c354b7fe9875c84eb1ccef4401ba941dcef78f24e01c775ee2a336
  }, [props.validate]);

  if (files.length > 0 && !fileAvailable) {
    console.log(acceptedFiles[0]);
    setFileAvailable(true);
    // console.log(fileAvailable);
  }

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {!fileAvailable && (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item xs={12}>
              <Box display="block" displayPrint="none">
                <img
                  src={fileImportIcon}
                  alt="upload icon made by Freepik (www.freepik.com) from www.flaticon.com"
                  width={picsize}
                />
                <p style={{ fontSize: 18 }}>Drag your files here or</p>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display="block" displayPrint="none">
                <Button
                  type="button"
                  onClick={open}
                  variant="contained"
                  color="primary"
                >
                  Browse
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {fileAvailable && (
          <List>
            <ListItem>
              <ListItemText primary={files} />
            </ListItem>
          </List>
        )}
      </div>
    </div>
  );
}

export default Dropbox;
