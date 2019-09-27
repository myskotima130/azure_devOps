import React, { useState, useEffect } from "react";
import { RecordsContainer, ContactsContainer } from "./components";
import db from "./db/indexedDB";
import "./App.css";

const App = () => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [records, setRecords] = useState([]);
  const [contacts, setContacts] = useState([]);

  const onDelete = recordUrl => {
    db.records.delete(recordUrl);
    setRecords([...records.filter(record => record.url !== recordUrl)]);
  };

  let chunks = [];
  useEffect(() => {
    db.records.toArray(data => setRecords(data));

    if (navigator.mozContacts) {
      const requestContacts = navigator.mozContacts.getAll({ sortBy: name });
      requestContacts.onsuccess = function() {
        if (this.result) {
          console.log("Name of Contact" + this.result.name);
          console.log("Number of Contact" + this.result.tel[0].value);

          contacts.push({
            name: this.result.name,
            tel: this.result.tel[0].value
          });

          this.continue();
        } else {
          setContacts(contacts);
        }
      };
    } else {
      setContacts([
        {
          name: "contact name 1",
          tel: "+380980243825"
        },
        {
          name: "contact name 2",
          tel: "+380982243325"
        },
        {
          name: "contact name 3",
          tel: "+380987273875"
        }
      ]);
    }

    if (!navigator.mediaDevices) {
      navigator.mediaDevices = {};
      navigator.mediaDevices.getUserMedia =
        navigator.getUserMedia || navigator.mozGetUserMedia;
    }

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(
        stream => {
          setMediaRecorder(new MediaRecorder(stream));
        },
        error => console.error(error)
      );
    } else {
      console.error("getUserMedia is not supported");
    }
  }, []);

  const onStartClick = () => {
    mediaRecorder.start();
    console.log("recorder started");
  };

  const onStopClick = () => {
    mediaRecorder.stop();
    console.log("recorder stopped");
  };

  if (mediaRecorder) {
    mediaRecorder.onstop = () => {
      const clipName = prompt(
        "Enter a name for your record?",
        "My unnamed clip"
      );

      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      chunks = [];
      const url = window.URL.createObjectURL(blob);

      setRecords([...records, { url, title: clipName }]);
      db.records.add({ url, title: clipName });

      console.log("recorder stopped");
    };

    mediaRecorder.ondataavailable = e => {
      chunks.push(e.data);
    };
  }

  return (
    <div className="App">
      <h1>Call Record</h1>
      <button onClick={onStartClick}>Start</button>
      <button onClick={onStopClick}>Stop</button>
      {records && <RecordsContainer records={records} onDelete={onDelete} />}
      {contacts && <ContactsContainer contacts={contacts} />}
    </div>
  );
};

export default App;
