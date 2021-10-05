export function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
}

export function formatDateString(date) {
	var d = new Date(date).toLocaleDateString('en-us', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
	return d;
}

export function formatParagraph(myStr) {
	return myStr.split('\n').map((str) => <p className='mb-4'>{str === '' ? ' ' : str}</p>);
}

export function renderActiveTags(flag) {
	if (flag === true) {
		return <span class='badge bg-success'>Active</span>;
	}
	return <span class='badge bg-danger'>Inactive</span>;
}
