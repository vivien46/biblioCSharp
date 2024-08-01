import React from 'react';
import BookList from '../Components/Books/BookList';

const BookPage: React.FunctionComponent = () => {

  return (
    <div className="flex flex-col justify-center">
      <BookList />
    </div>
  );
}

export default BookPage;
