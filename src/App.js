import { useState, useEffect } from "react";
import "./App.css";
const App = () => {
	const [news, setNews] = useState([]);
	const [searchQuery, setSearchQuery] = useState("react");
	const [url, setUrl] = useState(
		`http://hn.algolia.com/api/v1/search?query=${searchQuery}`
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchNews = (retryCount = 3) => {
		setIsLoading(true);
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setNews(data.hits);
				setIsLoading(false);
			})
			.catch((err) => {
				if (retryCount > 0) {
					fetchNews(retryCount - 1);
				} else {
					console.log(err);
					setError(err.message);
					setIsLoading(false);
				}
			});
	};
	useEffect(() => {
		fetchNews();
	}, [url]);
	const handleSubmit = (e) => {
		e.preventDefault();
		setUrl(`http://hn.algolia.com/api/v1/search?query=${searchQuery}`);
	};
	const handleChange = (e) => {
		setSearchQuery(e.target.value);
	};
	return (
		<div className="main-content" style={{ margin: "0px 20px" }}>
			<div className="news-search">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={searchQuery}
						onChange={handleChange}
					/>
					<button type="submit">Search</button>
				</form>
			</div>
			<div className="news-content">
				<h2>News</h2>
				{isLoading ? (
					<div>Loading...</div>
				) : error ? (
					<div>{error}</div>
				) : (
					news.map((n, i) => <p key={i}>{n.title}</p>)
				)}
			</div>
		</div>
	);
};
export default App;
