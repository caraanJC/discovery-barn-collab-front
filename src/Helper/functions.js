export const formatDate = (date) => {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
};

export const formatDateString = (date) => {
	var d = new Date(date).toLocaleDateString('en-us', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
	return d;
};

export const formatParagraph = (myStr) => {
	return myStr.split('\n').map((str) => <p className='mb-4'>{str === '' ? ' ' : str}</p>);
};

export const renderActiveTags = (flag) => {
	if (flag === true) {
		return <span className='badge bg-success'>Active</span>;
	}
	return <span className='badge bg-danger'>Inactive</span>;
};

export const limitShownText = (longText, id) => {
	let shownText = longText.slice(0, 100);
	let hiddenText = longText.slice(100);
	return (
		<>
			<p>
				{shownText}
				{shownText !== longText && <span id={`dots-${id}`}>...</span>}
				<span className='moreText' id={`moreText-${id}`}>
					{hiddenText}
				</span>
			</p>
			{shownText !== longText && (
				<button className='myButton btn-success btn-xs' onClick={() => handleShowMoreText(id)} id={`showMoreBtn-${id}`}>
					Read more
				</button>
			)}
		</>
	);
};

export const handleShowMoreText = (id) => {
	let dots = document.getElementById('dots-' + id);
	let moreText = document.getElementById('moreText-' + id);
	let btnText = document.getElementById('showMoreBtn-' + id);

	if (dots.style.display === 'none') {
		dots.style.display = 'inline';
		btnText.innerHTML = 'Read more';
		moreText.style.display = 'none';
	} else {
		dots.style.display = 'none';
		btnText.innerHTML = 'Read less';
		moreText.style.display = 'inline';
	}
};
