import React from "react";

const Filter = props => (
  <input value={props.searchName} onChange={props.handleSearchChange} />
);

export default Filter;
