import React from "react";
import "./ClipContainer.css";

export const ClipContainer = ({ records, onDelete }) => {
  return (
    <div>
      <h1>Records</h1>
      {records.map(record => (
        <div key={record.url}>
          <h3>{record.title}</h3>
          <audio src={record.url} controls></audio>
          <button onClick={() => onDelete(record.url)}>delete</button>
        </div>
      ))}
    </div>
  );
};