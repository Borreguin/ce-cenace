import React, { Component } from "react";
import Upload from "../../components/Upload/Upload";

class UploadArchivos extends Upload {
  constructor(props) {
    super(props);
  }

  //delegate to the parent to do the click
  getUploadFilesClick() {
    this.uploadFiles();
  }

  // inform to parent the files to update:
  handle_files_change = (upload_files) => {
    this.props.onFilesChange(upload_files);
  };

  // Uploading Files:
  async uploadFiles() {
    // change state of the component
    // First of all, clear any uploadProgress that may be left from a previous upload
    this.setState({
      uploadProgress: {},
      uploading: true,
      errorUploading: false,
      successfullUploaded: false,
    });
    // said to the principal component the files to upload
    const upload_files = [];
    this.state.files.forEach((file) => {
      upload_files.push(file.name);
    });
    this.handle_files_change(upload_files);

    // empezar con la subida
    const promises = [];
    this.state.files.forEach((file) => {
      promises.push(this.sendRequest(file));
    });
    try {
      let check = true;
      // wait for submit operation until all are done:
      await Promise.all(promises)
        .then((values) => {
          values.forEach((value) => {
            check = check && value[1].status === 200;
          });
        })
        .catch((e) => {
          check = false;
        });
      // update the state of the component
      this.setState({
        successfullUploaded: check,
        uploading: false,
        errorUploading: !check,
      });
    } catch (e) {
      // proceso fallido
      this.setState({
        successfullUploaded: false,
        uploading: false,
        errorUploading: true,
      });
    }
  }

  // implement send request of the file:
  sendRequest(file) {
    return new Promise((resolve, reject) => {
      try {
        const req = new XMLHttpRequest();

        req.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const copy = { ...this.state.uploadProgress };
            copy[file.name] = {
              state: "pending",
              percentage: (event.loaded / event.total) * 100,
            };
            this.setState({ uploadProgress: copy });
          }
        });

        req.upload.addEventListener("load", (event) => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "done", percentage: 100 };
          this.setState({ uploadProgress: copy });
        });

        req.upload.addEventListener("error", (event) => {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = { state: "error", percentage: 0 };
          this.setState({ uploadProgress: copy, errorUploading: true });
          reject([file.name, req]);
        });

        const formData = new FormData();
        formData.append("file", file, file.name);

        // sending a file each time
        req.open("POST", this.props.path);
        req.send(formData);
        req.onload = () => {
          resolve([file.name, req]);
        };
        req.onerror = () => {
          reject([file.name, req]);
        };
      } catch (e) {
        reject([file, null]);
      }
    });
  }
}

export default UploadArchivos;
