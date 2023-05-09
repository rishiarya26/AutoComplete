
# 1. What is the difference between Component and PureComponent? Give an example where it might break my app.
 - Difference is that PureComponents does a shallow comparision of props or state change and memoizes the output, hence doesnt re-render if value of old or new prop is same. It uses shouldComponentUpdate() lifecycle method for shallow comparision. Therefore helps in limiting re-renders and boost performance while on the other hand React.Component always re-renders if there is state change in its parent and the props coming to the current component are not even changed.

 -As functional components are stateless and doesn't have lifecycle methods there we cant use shouldComponentUpdate(), So to solve this we use React.memo() API, basically an HOC in which we can pass first argument as functional comp and it does the shallow comparision and memoizes result for same inputs and limits re-renders if props value doesnt change.

- It can break my app if we try to use pure component and the props coming to it is object. As object comparision will always give false so shallow comparision wont suffice to determine weather things have changed or not . We should always use pure components when props are function,string,numbers or boolean.
If we have to use objects as props then we can do a custom comparision passign second argument in React.memo a function in which we comapre object old & new values and if that function returns true then it re-renders comp else it doesn't.


# 2. Context + ShouldComponentUpdate might be dangerous. Why is that?
Context APIs is used to create a global state to be used by components at deeper level. Example we require common state with navigation bar or sidebar.So any of the deeply contained components can require this state info. 
But as far as i understand shouldComponentUpdate can break that flow, meaning if the parent component is wrapped with provider and if it has shouldComponentUpdate not implemented properly it may break context propogation to the further deeply contained child  components.

# 3. Describe 3 ways to pass information from a component to its PARENT.
- one way will be to define a callback function in parent and pass it as prop in child & then child can call that callback function passing in the arguments that can be used in parent.
eg : 
const [info, setInfo] = useState('')
const updateInfo = (item) => setInfo(item);
return <Child updateInfo={updateInfo}>

function Child = ({updateInfo}) => <input onChange={(e)=>updateInfo(e.target.value)}></input>

- secondly we can use global state and with contextAPIs we can have the same state value updated from child and can be used in parent.
- third we can use browser storage like localStorage, session storage, cookies to pass data from child to parent by consuming the stored variable in storage in parent comp which can be changed from child comp.

# 4. Give 2 ways to prevent components from re-rendering.
 - first, we can use pureComponents in class comp or React.memo() & useMemo hook in functional components to prevent re-rendering as these does shallow comparisions of old & new prop values and chaches or memoizes the result. Until there is a prop change detected it will not re-render component.

 - secondly, we should be careful while making state in parent comp if its only required in particualr child comp. AS in this case it should be defined in child component itself as after this the other child comp will not re-render on change of this state which was previously was in parent comp.

# 5. What is a fragment and why do we need it? Give an example where it might break my app.
React fragmments serve as a good alternative to using unnecessary divs. JSX can be wrapped with React.Fragment where the wrapper div doesnt require to pass any style, as its important to wrap & group JSX under return to have parent wrapper and if we dont need style in parent wrapper react fragement will be a better option as it will also mean one less DOM node. As our application keeps on getting bigger then it really comes handy to avoid any extra divs. 
eg - <React.Fragment></React.Fragment>, <></>

One of the situations where it can break UI and we need to take care is when using it in resuable comps as if you are returning a react fragment and then its inclosed in a div with display:flex for example can sometime not give proper outcome.
eg - 
const ReusableComp = ()=>(
   <>
    <Child1>
    <Child2>
   </>
)

const Parent = () => (
   <div style ={{display : "flex"}}>
    <ResuableComp>
    <Footer>
   </div>
)

In this we will think that ReusableComp & Footer will be laid out horizontally without looking at ResuableComp but here Child1,Child2 & Footer will be laid of horizontally next to each other. So we need to be careful on scenarios like this to use div instead of fragment for wrapping ResuableComp elemants.
- Fragment also only takes key as prop if needed to be used in a map.

# 6. Give 3 examples of the HOC pattern.
- giving some expamples were i have used HOC comps in my earlier project
 1. function useAuth(compWithAuth, compWOAuth) {
  let tokens = typeof window !== "undefined" && cookies.get('tokens');
  // tokens = tokens && JSON.parse(tokens);

  if (tokens?.shortsAuthToken && tokens?.accessToken) {
    return compWOAuth;
  }
  return compWithAuth;
}

This was a higher order comp which takes 2 components as arguments and on the basis of token present returns respected component.

2. This is componentStateHandler which loads loader, errorComp or children on the basis of successful API call.
we can wrap any comp with this and pass its respective loader & error comp with main comp  & the state(pending,fail, success)

 function ComponentStateHandler({
  state, Loader, ErrorComp, children
}) {
  if (state === 'pending') {
    return Loader ? <Loader />
      : (<CircularLoader />);
  }
  if (state === 'fail') return ErrorComp ? <ErrorComp /> : null;
  if (state === 'success') return <>{children}</>;
}

3. The third one we are creating context and whatever comp we wrap its provider can access dialogue and that will be attached as children in this HOC comp.
const DialogContext = createContext({
  close: () => {},
  show: () => {}
});

export const DialogProvider = ({ children }) => {
  const [state, setState] = useState({ visible: false, message: '', type:'big' });
  const { show: showOverLay, hide: hideOverLay } = useOverLay();
  const ComponentProps = useRef({});

  const show = (title, content, type='big', props) => {
    ComponentProps.current = props;
    showOverLay();
    DialogContent = content;
    setState({
      title,
      visible: true,
      type: type
    });
  };

  const close = () => {
    hideOverLay();
    DialogContent = null;
    setState({
      title: '',
      visible: false,
    });
  };

  return (
    <DialogContext.Provider value={{ show, close }}>
      {children}
      <Dialog visible={state.visible} close={close} title={state.title} type={state.type}>
        {DialogContent && <DialogContent {...ComponentProps.current} />}
      </Dialog>
    </DialogContext.Provider>
  );
};


# 7. What's the difference in handling exceptions in promises, callbacks and async...await?
- Error handling in :
 1. Promises : promise object represents eventual completion of an async opertion. It either resolves or reject, with reject we can handle errors inside promise & whenever calling promises we can wrap that it in try catch or put a .catch with .then.
 eg - function getId(id) {
    return new Promise((resolve, reject) => {
        if (!id) {
            reject('something went wrong');
        }
        resolve({
            id: id
        });
    });
}

try {
    getId(10).then(() => console.log('success'));

} catch (error) {
    console.log(`error occured- ${error}`);
}

 2. Async functions & callback functions - we can simply enclose the code in which error can occur in try/catch block inside async function.
 eg - 
 const getResult = async()=>{
   try{
       const result = await fetch('apiUrl');
   }catch(e){
      console.error(e)
   }
 }
# 8. How many arguments does setState take and why is it async.
- setState helps to update components internal state, it can take upto 2 argumentws.
 First argument we can pass as a function or object & second argument we can pass as callback function which will always be called after setState is completed.
 eg - 
 this.state = {name : "a"}
 setState(()=>{name : "b"},()=>{setState(()=>{name : "deel"})})

 The final updation for name will be deel after setState updated it to b after that 2nd argument callback fn is called and it sets name to deel.

 - setState is async for maintaining internal consistency between state, props & refs. So that it can take care of batching setState requests i.e. if there are multiple setStates before re-rendering.
 If there are multiple setState in a function then it will happen async in queue and once all setState are completed then only it will re render component.

# 9. List the steps needed to migrate a Class to Function Component.
- We can follow some of these steps :
 - remove class keyword and change it to function component
 - remove render method as there is only return in functional comp
 - replace all instances of this keyword
 - make all methods in class component to functions with function keyword or arrow functions
  eg - onSubmit() {}  to const onSubmit = () =>{}
 - To access life cycle methods in functional comp we use useEffect hook with second argument as array.
   eg - componentDidMount - useEffect(()=>{},[])
        componentDidUpdate - useEffect(()=>{},[dep]) , useEffect(()=>{})
        componentDidUnmount - useEffect(()=>{ return()=>{}},[]) 
- Remove constructor and all this.state can be defined in functional comp using useState hook.
 eg - const [items, setItems] = useState([])  

# 10. List a few ways styles can be used with components.
- These are some of the ways to use style with components :
 1. Inline styles : we can add directly `style` attribute in any of the elemants.
    eg : <div style={{color:"red"}}>project</div>
 2. We can define styles globally in index.css or indivisual css files with every component.
    eg : index.css - in index.css we can directly define body : {color: red, background-color:black} which will be applicable globally throughout application.
    For component level styles eg : In App.css we can define styles and import it in App.js and use it.  
 3. For dynamic styles we can make objects inside components.
    eg : we can change theme of application dyanmically as user can select from dropdown and text color will change for that page.
     let selectedTheme = "red";
     const theme = {
        red : { color : "red"},
        blue :{ color : "blue"},
        green : {color : "green"}
    }
    <div className={theme.selectedTheme}></div>

# 11. How to render an HTML string coming from the server.
- It can be done using dangerouslySetInnerHTML in react. limitation is XSS attacks.
 example - 
     let htmlStringFromServer = "<div>deels project</div>"
     <div dangerouslySetInnerHTML={{ __html: htmlStringFromServer}}></div>


