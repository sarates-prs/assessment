import React, {FormEvent, useEffect, useState} from 'react';
import './App.css';

const apiKey = 'y7W5n3thiuqX5SDjx3j34bk5jT8iPwd1';

function App() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGifId, setSelectedGifId] = useState('');
  const [selectedGifData, setSelectedGifData] = useState<any>(null);
  const [selectedGifsHistory, setSelectedGifsHistory] = useState<string[]>([]);

  useEffect(() => {
    const getSelectedGif = async () => {
      const requestsUrl = 'https://api.giphy.com/v1/gifs/' + selectedGifId + '?api_key=' + apiKey;
      const requestPromise = fetch(requestsUrl).then((data) => {
        return data.json();
      })
      const data = await requestPromise;
      setSelectedGifData(data.data)
    }
    if (selectedGifId){
      void getSelectedGif();
    }
  }, [selectedGifId]);

  const onFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const requestsUrl = 'https://api.giphy.com/v1/gifs/search?q=' + searchInputValue + '&api_key=' + apiKey;
    const requestPromise = fetch(requestsUrl).then((data) => {
      return data.json();
    })
    const data = await requestPromise;
    setSelectedGifsHistory([...selectedGifsHistory, searchInputValue])
    setSearchResults(data.data)
  }

  const onHistoryItemClick = async (gifName: string) => {
    const requestsUrl = 'https://api.giphy.com/v1/gifs/search?q=' + gifName + '&api_key=' + apiKey;
    const requestPromise = fetch(requestsUrl).then((data) => {
      return data.json();
    })
    const data = await requestPromise;
    setSelectedGifsHistory([...selectedGifsHistory, gifName])
    setSearchResults(data.data)
  }

  return <div>
    <div className="main">
      {selectedGifId && <>
          <button type="button" onClick={() => setSelectedGifId('')}>Back</button>
          <div className="gif">
              <img key={selectedGifData} src={selectedGifData?.images?.original?.url} alt="img" />
          </div>
      </>}
      {!selectedGifId && <div>
          <form onSubmit={onFormSubmit}>
              <input type="text" value={searchInputValue} onChange={t => setSearchInputValue(t.currentTarget.value)}/>
              <button type="submit">Search</button>
          </form>
          <div>
            {searchResults.map((gif: any) => {
              return <div className="gif">
                <img key={gif.id} src={gif.images.original.url} onClick={() => setSelectedGifId(gif.id)} alt="img" />
              </div>
            })}
          </div>
      </div>}
    </div>
    <div className="history">
      <h3 className="historyTitle">Search history</h3>
      <div className="historyContent">
        {selectedGifsHistory.map(h => {
          return <button onClick={() => {onHistoryItemClick(h)}}>
            <code>{`- ${h}`}</code>
          </button>
        })}
      </div>
    </div>
  </div>;
}

export default App;
