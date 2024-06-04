import { useCallback, useRef, useState } from "react";
import "./App.css";
import useBookSearch from "./useBookSearch";

function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { loading, error, books, hasMore } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

 

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} />
      <hr />
      {books.map((b, i) => {
        if (books.length === i + 1) {
          return (
            <div ref={lastBookElementRef} key={i}>
              {b}
            </div>
          );
        } else {
          return <div key={i}>{b}</div>;
        }
      })}
      <div>{loading && "Loading... "}</div>
      <div>{error && "Error"}</div>
    </>
  );
}

export default App;
