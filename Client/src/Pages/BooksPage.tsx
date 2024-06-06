import React from 'react';
import BookList from '../Components/Books/BookList';

const BookPage: React.FunctionComponent = () => {

  return (
    <div className="flex flex-col justify-center">
      <h1 className='text-3xl font-bold mb-4'>Books</h1>
      <BookList />
    </div>
  );
}

export default BookPage;
