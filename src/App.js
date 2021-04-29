import React, { useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import options from "./mock-data";
import useWindowSize from "./WindowResize";
function App() {
  const textInputName = useRef(null);
  const [list, setList] = useState([]);
  const [optionList, setOptionList] = useState(options);
  const [width, height] = useWindowSize();
  useEffect(() => {
    textInputName.current.focus();
  }, []);

  const onChangeHandle = (item) => {
      const newList = [...list, {contextValue: 1000, error: "", label: item.label, value: item.value, isKey: true, mandatory: true, recommended: false}];
      // filter options 
      const newOptionList = optionList.filter(opt=> {
         return opt.value !== item.value
      })
      setList(newList);
      setOptionList(newOptionList);
  }
  const handleRemove = value => {
      const filterData =  list.filter(item=> {
         return item.value !== value.value
       })
       const newoptionList = optionList;
       newoptionList.splice(value.value-1, 0, {label: value.label, value: value.value})
     //  const newoptionList = [...optionList, {label: value.label, value: value.value}];
      setList(filterData);
      setOptionList(newoptionList);
  }
  const handleChanges =  (e, value) => {
    
     let currentValue = {};
     let indexValue = 0;
      list.forEach((element, index) => {
          if(element.value === value) {
           indexValue = index;
          currentValue = element;
          }
     }); 
     if(e.target.type === "checkbox") {
      currentValue = currentValueCheckBox(e, currentValue);
     } else {
      currentValue = currentValueInput(e.target.value, currentValue);
     }
    
     const newList = list;
     newList.splice(indexValue, 1, currentValue)
     setList([...newList]);
  }
 const  currentValueCheckBox = (e, currentValue) => {
    if(e.target.name === "recommended" && e.target.checked === true) {
      currentValue.isKey = false;
      currentValue.mandatory = false;
      currentValue.recommended = true;
      } else {
        if(e.target.name !== "recommended" && currentValue.recommended === true) {
            console.log("can't change");
            alert("first uncheck recommended checkbox");
        } else {
          currentValue[e.target.name] = e.target.checked;
        }
      }
      return currentValue;
  }

  const currentValueInput = (inputValue, currentValue) => {
    if(inputValue < 1000) {
      currentValue.error = "Value should be above 1000";
      currentValue["contextValue"] = inputValue;
    } else if( inputValue > 10000) {
      currentValue["contextValue"] = 1000;
      currentValue.error = "Upper limit reached";
    } else {
      currentValue["contextValue"] = inputValue;
      currentValue.error = "";
    }

    return currentValue;
  }
 
  return (
    <div className="App">
       <div style={{width: "400px", margin: "30px auto"}}>
          <label>Name</label>
          <Select ref={textInputName} options={optionList} onChange={(value) =>  onChangeHandle(value) } />
       </div>
       <table className="table table-bordered">
            <thead>
              <tr>
                <th>Context</th>
                <th>Value</th>
                <th>isKey</th>
                <th>Mandatory</th>
                <th>Recommended</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
            {
                list.map(item => {
                  return (
                    <tr key={item.value}>
                      <td> {item.label}</td>
                      <td>
                      <input name="value" onChange={(e) => handleChanges(e, item.value)} value={item.contextValue} type="number"/>
                      {item.error? <div style={{color: "red"}}>{item.error}</div>: null}
                      </td>
                      <td><input name="isKey" type="checkbox" checked={item.isKey} onChange={(e) => handleChanges(e, item.value)} /></td>
                      <td><input name="mandatory" type="checkbox" checked={item.mandatory} onChange={(e) => handleChanges(e, item.value)} /></td>
                      <td><input name="recommended" type="checkbox" checked={item.recommended} onChange={(e) => handleChanges(e, item.value)} /></td>
                      <td><span onClick={() => handleRemove(item)}> Remove</span></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div>
             <span>Window size: {width} x {height}</span>;
          </div>
    </div>
  );
}

export default App;
