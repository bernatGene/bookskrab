const BOOK_LIST_LEN = 5

export const getRandomBook = (notThisOne?: number) => {
    const rValue = (Math.floor(Math.random() * (BOOK_LIST_LEN ))) + 1;
    if (notThisOne !== rValue) return rValue;
    return ((notThisOne + rValue) % BOOK_LIST_LEN) + 1;
}

export const getBookPair = () => {
    const firstId = getRandomBook();
    const secondId = getRandomBook(firstId);
    return [firstId, secondId];
}
