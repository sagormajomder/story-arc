'use client';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BookInfo = ({ book }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isInShelf, setIsInShelf] = useState(false);

  useEffect(() => {
    // Check if session has user (optimistic check)
    if (session?.user?.shelf && Array.isArray(session.user.shelf)) {
      if (session.user.shelf.includes(book._id)) {
        setIsInShelf(true);
        return;
      }
    }

    // Fetch fresh user data to be sure
    const checkShelfStatus = async () => {
      if (!session?.user) return;

      const userId = session.user._id || session.user.id;
      if (!userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
        );
        if (res.ok) {
          const userData = await res.json();
          if (
            userData.shelf &&
            Array.isArray(userData.shelf) &&
            userData.shelf.includes(book._id)
          ) {
            setIsInShelf(true);
          }
        }
      } catch (error) {
        console.error('Failed to check shelf status', error);
      }
    };

    if (session?.user) {
      checkShelfStatus();
    }
  }, [session, book._id]);

  const handleAddToShelf = async () => {
    if (!session?.user) {
      return toast.error('Please login to add to shelf');
    }
    setLoading(true);
    try {
      const userId = session.user._id || session.user.id;

      if (!userId) {
        console.error('User ID not found in session', session.user);
        toast.error('User information missing');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/shelf`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId: book._id }),
        }
      );

      const data = await res.json();

      if (data.message === 'Book already in shelf' || res.ok) {
        setIsInShelf(true);
        toast.success(
          data.message === 'Book already in shelf'
            ? 'Book already in your shelf'
            : 'Added to shelf successfully'
        );
      } else {
        throw new Error(data.message || 'Failed to add to shelf');
      }
    } catch (error) {
      toast.error('Failed to add to shelf');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-8 items-start'>
      <div className='w-full md:w-1/3 lg:w-1/4 rounded-lg overflow-hidden shadow-lg border-4 border-gray-800 relative group aspect-2/3'>
        <Image
          src={book.cover}
          alt={book.title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          loading='eager'
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
      </div>
      <div className='flex-1 space-y-6'>
        <div>
          <div className='flex flex-wrap gap-3 mb-3'>
            {book.genre && (
              <span className='px-3 py-1 bg-green-900/30 text-green-400 text-xs font-bold uppercase tracking-wider rounded-full border border-green-800'>
                {book.genre}
              </span>
            )}
          </div>
          <h1 className='text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight'>
            {book.title}
          </h1>
          <p className='text-xl text-gray-400 italic'>by {book.author}</p>
        </div>

        <div className='flex items-center gap-8 py-4 border-y border-gray-800'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-3xl font-bold text-green-500'>
                {book.rating || 0}
              </span>
              <svg
                className='w-6 h-6 text-green-500 fill-current'
                viewBox='0 0 24 24'>
                <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
              </svg>
            </div>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              {book.totalRatings || 0} Ratings
            </p>
          </div>
          <div>
            <div className='text-3xl font-bold text-white mb-1'>
              {book.totalRatings || 0}
            </div>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              Reviews
            </p>
          </div>
          <div>
            <div className='text-3xl font-bold text-white mb-1'>
              {book.year || 'N/A'}
            </div>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              Published
            </p>
          </div>
        </div>

        <div className='prose prose-invert max-w-none text-gray-300 leading-relaxed'>
          <p>{book.description}</p>
        </div>

        <div className='flex gap-4 pt-4'>
          <button
            onClick={handleAddToShelf}
            disabled={loading || isInShelf}
            className='px-8 py-3 bg-green-500 hover:bg-green-600 text-black font-bold rounded flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-600 disabled:text-gray-300'>
            {loading
              ? 'Adding...'
              : isInShelf
              ? 'Added to Shelf'
              : 'Add to Shelf'}
            {!isInShelf && (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M19 9l-7 7-7-7'></path>
              </svg>
            )}
            {isInShelf && (
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M5 13l4 4L19 7'></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
