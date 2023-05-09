import React , { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import sampleItems from "./sample.json"
import debounce from './utils/debounce';
import AutoSuggestions from './AutoSuggestions';

interface AutoSugg {
name : string,
code : string
} 

function App() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<AutoSugg[]>([]);
  const [search, setSearch] = useState("")
  const [showLoading, setShowLoading] = useState(false)
  const wrapperRef = useRef(null)

  const updateSuggestions = async(search:string)=>{
    setShowLoading(true);
  // adding this promise which will wait for 500ms to resolve, replicating a REST api call behaviour 
  // if this would be a real API then we can add all necessary error handling here.
    let promise = new Promise((resolve) => {
      setTimeout(() => resolve("resolve"), 500)
    });
    await promise; 
    setShowLoading(false);
    console.log("UPDATING SUGG...",search)
    const updatedSuggestions = sampleItems.countries.filter((item:AutoSugg)=>item.name?.toLowerCase().includes(search?.toLowerCase()));
    setSuggestions(updatedSuggestions);
  }

  // debounce updateSuggestion function if interval between 2 keystroke is 200 millisec.
  const debounceSuggestionUpdation = useMemo(() => {
    return debounce((search:string)=>updateSuggestions(search),200);
  }, []);

  const closeAutoSuggestion = (e: MouseEvent) =>{
     e.target === wrapperRef.current && setShowSuggestions(false);
  }
  useEffect(()=>{
    setSuggestions(sampleItems.countries);
    document.addEventListener('mousedown',closeAutoSuggestion)
    
    return ()=> document.removeEventListener('mousedown',closeAutoSuggestion)
  },[]) 

  const updateSearchTerm = (term:string) => setSearch(term);
  const updateShowSuggestions = (value:boolean) => setShowSuggestions(value);

  return (
    <div className='mainContainer' ref={wrapperRef}>
     <div className='container'>
        <input
          onChange={(e)=>{
            debounceSuggestionUpdation(e?.currentTarget?.value);
            setSearch(e?.currentTarget?.value)
          }}
          onFocus={()=>setShowSuggestions(true)}
          placeholder='Search Country'
          value={search}
          autoComplete="off"
          className='textArea'
        ></input>
     {showLoading ? <div className='loading'>loading...</div> : 
      showSuggestions && 
        <AutoSuggestions 
          search={search}
          suggestions={suggestions}
          updateSearchTerm={updateSearchTerm}
          updateShowSuggestions={updateShowSuggestions}
        /> 
      }
     </div>
    </div>
  );
}

export default App;
