import React from "react";

const BookAdd: React.FunctionComponent = () => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('book added');
  }


    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center font-medium text-2xl mb-5">Add Book</h1>

            <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                    <label htmlFor="title" className="text-center font-medium text-lg">Title</label>
                    <input type="text" id="title" name="title" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="author" className="text-center font-medium text-lg">Author</label>
                    <input type="text" id="author" name="author" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="editor" className="text-center font-medium text-lg">Editor</label>
                    <input type="text" id="editor" name="editor" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="year" className="text-center font-medium text-lg">Year</label>
                    <input type="number" id="year" name="year" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="isbn" className="text-center font-medium text-lg">ISBN</label>
                    <input type="text" id="isbn" name="isbn" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <label htmlFor="image" className="text-center font-medium text-lg">Image</label>
                    <input type="file" id="image" name="image" className="border-2 border-gray-500 rounded p-1 mb-5" />

                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Book</button>
                </form>
            </div>
        </div>
    );
}

export default BookAdd;