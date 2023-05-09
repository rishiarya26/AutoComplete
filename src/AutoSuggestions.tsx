import React from "react"

interface AutoSugg {
  name : string,
  code : string
  } 

interface AutoSuggestProps {
  search : string,
  suggestions:AutoSugg[],
  updateSearchTerm : (term:string)  => void,
  updateShowSuggestions : (value:boolean) => void
}

const AutoSuggestions = ({search,suggestions,updateSearchTerm, updateShowSuggestions}:AutoSuggestProps) =>{
  const onSelectSuggestion = (countryName:string) =>{
    updateSearchTerm(countryName)
    updateShowSuggestions(false)
  }
    return(
      <>
        <div className='suggestionContainer'>
        {suggestions.length > 0 ? suggestions.map((country,id)=>(
          <div className='suggestion' key={id}>
            <div 
             onClick={()=>onSelectSuggestion(country.name)}
              tabIndex={0}
              onKeyUp={(e)=> e.key === "Enter" && onSelectSuggestion(country.name)}
             dangerouslySetInnerHTML={{ __html:  country.name.replace(new RegExp(search, "gi"), (match) => `<span class='highlight'>${match}</span>`)} } />
          </div>
        ))
        : <div>No Results Found</div>}
      </div>
      
      </> 
    )
}

export default AutoSuggestions;
