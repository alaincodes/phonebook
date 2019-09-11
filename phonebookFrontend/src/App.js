import React, { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("add new name..");
  const [newNumber, setNewNumber] = useState("add number...");
  const [searchName, setSearchName] = useState("");
  const [notificationMsg, setNotificationMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

  const added = (name, data) => {
    let isAdded = data.find(elm => elm.name === name);
    if (isAdded === undefined) {
      return false;
    }
    return true;
  };

  let filteredName = persons.filter(person => {
    return person.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1;
  });

  const deletePersonBtn = id => {
    personService.deletePerson(id).then(() => {
      const updatePersons = persons.filter(p => p.id !== id);
      setPersons(updatePersons);
    });
  };

  const addName = event => {
    event.preventDefault();

    const checkExistingName = persons.filter(person => {
      return person.name.includes(newName);
    });

    if (checkExistingName.length === 1) {
      const confirmWindow = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one ?`
      );
      if (confirmWindow) {
        personService
          .update(checkExistingName[0].id, {
            ...checkExistingName[0],
            number: newNumber
          })
          .then(updatedPerson => {
            let updated = persons.filter(p => p.id !== updatedPerson.id);
            updated = [...updated, updatedPerson];
            setPersons(updated);
            setNewName("");
            setNewNumber("");
            setNotificationMsg(`Added ${updatedPerson.name}`);
            setTimeout(() => {
              setNotificationMsg(null);
            }, 2000);
          })
          .catch(error => {
            setErrorMsg(
              `Information of ${newName} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMsg(null);
            }, 5000);
          });
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber
      };

      personService
        .create(nameObject)
        .then(returnedPerson => {
          if (added(newName, persons)) {
            alert(`${newName} is already added to phonebook`);
          } else {
            setPersons([...persons, { name: newName, number: newNumber }]);
          }
          setNotificationMsg(`Added ${newName}`);
          setTimeout(() => {
            setNotificationMsg(null);
          }, 2000);
          setNewName("");
          setNewNumber("");
        })
        .catch(error => {
          setErrorMsg(
            `Information of ${newName} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMsg(null);
          }, 5000);
        });
    }
  };

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleNumberChange = event => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = event => {
    setSearchName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMsg} />
      <Notification type={"error"} message={errorMsg} />
      Search:
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        key={persons.id}
        persons={filteredName}
        name={persons.name}
        number={persons.number}
        deletePersonBtn={deletePersonBtn}
      />
    </div>
  );
};

export default App;
