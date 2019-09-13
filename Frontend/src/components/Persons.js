import React from "react";

const Persons = ({ persons, deletePersonBtn }) => {
  function windowConfirm(id, name) {
    if (window.confirm(`Delete ${name} ?`)) {
      deletePersonBtn(id);
    }
    return;
  }

  return (
    <>
      {persons.map(human => (
        <>
          <p key={human.id}>
            {human.name} {human.number}
            <button onClick={() => windowConfirm(human.id, human.name)}>
              delete
            </button>
          </p>
        </>
      ))}
    </>
  );
};

export default Persons;
