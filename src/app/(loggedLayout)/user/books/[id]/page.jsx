import BookInfo from '@/components/book-details/BookInfo';
import BookReviewsSection from '@/components/book-details/BookReviewsSection';

const fetchBook = async id => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`);
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return null;
  }
};

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  const book = await fetchBook(id);
  console.log(book);

  if (!book) {
    return (
      <div className='min-h-screen flex items-center justify-center text-white'>
        <h1 className='text-3xl'>Book not found</h1>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background text-foreground p-8 md:p-16 font-sans'>
      <div className='max-w-7xl mx-auto space-y-16'>
        <BookInfo book={book} />
        <BookReviewsSection bookId={id} />
      </div>
    </div>
  );
}
