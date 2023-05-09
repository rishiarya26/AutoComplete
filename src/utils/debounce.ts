const debounce = (func:any, t:number) =>{
   /* to-do : add specific type here for timer */
    let timer:any;
    return (...args:any[])=>{
      clearTimeout(timer);
      timer = setTimeout(()=>{
      func.apply(this,args);
      },t)
    }
  }

  export default debounce;