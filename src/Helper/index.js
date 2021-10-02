export const toNormalTime = (time) => {
    if (time === 'n/a') return time;
    const completeDate = new Date(time).toLocaleString('en-US', {
        timeZone: 'Asia/Taipei',
    });
    const actualDate = completeDate.split(', ')[0];

    const month =
        actualDate.split('/')[0].length > 1
            ? actualDate.split('/')[0]
            : '0' + actualDate.split('/')[0];
    const day =
        actualDate.split('/')[1].length > 1
            ? actualDate.split('/')[1]
            : '0' + actualDate.split('/')[1];
    const year = actualDate.split('/')[2];

    const properDateArray = [year, month, day];

    return `${properDateArray.join('-')}`;
};

export const getTimeToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    const now = yyyy + '-' + mm + '-' + dd;
    return now;
};
