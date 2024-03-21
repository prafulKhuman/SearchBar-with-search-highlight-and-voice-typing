import './App.css';
import React, { useState, useEffect } from 'react';


let url = " https://img.icons8.com/color/48/search--v1.png";
const token = "iqQ3KGDk6RVPRFO-00i81CxzfcDU50IstTsCPKFj2FWkrxDEomg7O8phDlfGBZqDD98";


function highlightMatch(name, searchText) {
  const index = name.toLowerCase().indexOf(searchText.toLowerCase());
  if (index === -1) return name;
  const before = name.substring(0, index);
  const match = name.substring(index, index + searchText.length);
  const after = name.substring(index + searchText.length);
  return (
    <span>
      {before}
      <strong>{match}</strong>
      {after}
    </span>
  );
}

function App() {
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [ auth , setauth ] = useState();
  const [ initdata , setinitdata ] = useState([])
  const [isListening, setIsListening] = useState(false);
  const recognition = new window.webkitSpeechRecognition();
 

  useEffect(() => {
    
    var headers = new Headers({
      "Accept": "application/json",
      "api-token": token,
      "user-email": "21mca010@gardividyapith.ac.in"
    });
   
  
    var requestOptions = {
      method: 'GET',
      headers: headers,
    };

    fetch("https://www.universal-tutorial.com/api/getaccesstoken", requestOptions)
      .then(response => response.text())
      .then(result => setauth(JSON.parse(result)))
      .catch(error => console.log('error', error));

    
  },[])

  console.log(initdata , "daa");

  useEffect(()=>{
    
    var headers = new Headers({
      "Authorization": `Bearer ${auth?.auth_token}`,
      "Accept": "application/json"
    });
   
  
    var requestOptions = {
      method: 'GET',
      headers: headers,
    };

    fetch("https://www.universal-tutorial.com/api/states/india", requestOptions)
    .then(response => response.text())
    .then(result => setinitdata(JSON.parse(result)))
    .catch(error => console.log('error', error));
  },[auth])


  useEffect(() => {
    if (searchText) {
      const searchdata = initdata?.filter((item) => item?.state_name?.toLowerCase().includes(searchText))
      setData(searchdata)
    } else {
      setData([])
    }

  }, [searchText])

  const handleVoiceInput = () => {
    if (!isListening) {
      recognition.lang = 'en-US';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setSearchText(""); // Clear previous search text
        for (let i = 0; i < speechResult.length; i++) {
          setTimeout(() => {
            setSearchText(prevText => prevText + speechResult[i]); // Append character one by one
          }, i * 100); // Adjust the timing as per your preference
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ', event.error);
        setIsListening(false);
      };
    } else {
      setIsListening(false);
      recognition.stop();
    }
  };



  return (
    <div class="container">

      <div class="row height d-flex justify-content-center align-items-center">
        <div class="col-md-6">

          <div class="form">
            <i class="fa fa-search"></i>

            <input type="text" value={searchText} class="form-control form-input" placeholder="Search Indian State..." onChange={(e) => setSearchText(e.target.value.toLowerCase())} />
            <span className="left-pan" onClick={handleVoiceInput}><i className={`fa fa-${isListening ? 'stop' : 'microphone'}`}></i></span>
          </div>

          <div className={`bg-white m-0  rounded mt-1 `} >
            {data?.map((item) => {
              return (
                <div className='searchcontainer'>
                  <img className='mr-3' width="17" height="17" src={url} alt="search--v1" />
                  <span className='ws-2'>{highlightMatch(item.state_name, searchText)}</span>
                </div>
              )
            })}
          </div>
        </div>


      </div>

    </div>
  );
}

export default App;
