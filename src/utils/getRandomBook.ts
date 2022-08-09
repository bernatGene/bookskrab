
let bookList: Array<number> = [
    714855660387,
    9780253214058,
    9780631181774,
    9783518294000,
    9781780239880,
    727741324287,
    9788488839985,
    9788418680021,
    9788433915702,
    9788417909390,
    9782731674040,
    9788409091683,
    9780141989143,
    9781852848453,
    9780241240021,
    9788492405350,
    9788418680106,
    9781853260025,
    9780441172719,
    9771234567003,
    9788425231575, 
    9788409032952,
    9788634139167,
    9788417339074,
    9780810115149,
]

const BOOK_LIST_LEN = bookList.length


export const getRandomBook = (notThisOne: number = -1) => {
    if (notThisOne === -1) return (Math.floor(Math.random() * (BOOK_LIST_LEN)));
    const rValue = (Math.floor(Math.random() * (BOOK_LIST_LEN - 1))) + 1;
    return ((notThisOne + rValue) % BOOK_LIST_LEN);
}

export const getBookPair = () => {
    const firstId = getRandomBook();
    const secondId = getRandomBook(firstId);
    console.log(firstId, secondId)
    return [bookList[firstId] || -1, bookList[secondId] || -1];
}

