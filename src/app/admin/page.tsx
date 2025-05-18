// app/admin/page.tsx
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { addBook } from './actions';
import { deleteBook } from '../books/actions'; // <-- to‘g‘ri import
import { Link } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Admin getSession error:', sessionError?.message || 'No session');
    redirect('/login');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Admin getUser error:', userError?.message || 'No user');
    redirect('/login');
  }

  // Foydalanuvchining kitoblarini olish
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('*')
    .eq('created_by', user.id);

  // deleteBook actionini import qilamiz
  // importni yuqoriga qo‘shing:
  // import { deleteBook } from '../books/actions';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mening Sahifam.</h1>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-lg text-gray-700">
            Xush kelibsiz, <span className="font-semibold text-blue-600">{user.email}</span>!
          </p>
          <p className="text-gray-600 mt-2">Bu yerda tizimga kitob qo`sha olasiz va qo`shgan kitoblaringiz bo`lsa uni o`chira olasiz.</p>
        </div>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            Asosiy Sahifaga Qaytish
          </Link>
        </div>
        {/* Foydalanuvchining kitoblari ro‘yxati */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Mening kitoblarim</h2>
          {booksError && (
            <div className="text-red-600 mb-4">Kitoblarni olishda xatolik: {booksError.message}</div>
          )}
          {(!books || books.length === 0) ? (
            <div className="text-gray-600">Sizda hali kitoblar yo‘q.</div>
          ) : (
            <ul className="space-y-4 mb-8">
              {books.map((book: Book) => (
                <li key={book.id} className="flex justify-between items-center bg-gray-100 p-4 rounded">
                  <div>
                    <div className="font-semibold">{book.title}</div>
                    <div className="text-sm text-gray-600">{book.author}</div>
                  </div>
                  <form action={deleteBook.bind(null, book.id)} method="post">
                    <button
                      type="submit"
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                    >
                      O‘chirish
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Kitob qo'shish formasi */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Yangi kitob qo‘shish</h2>
          <form action={addBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kitob nomi</label>
              <input
                type="text"
                name="title"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Muallif</label>
              <input
                type="text"
                name="author"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tavsif</label>
              <textarea
                name="description"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefon raqam</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 bg-gray-100 text-gray-600 select-none">
                  +998
                </span>
                <input
                  type="text"
                  name="phone_number"
                  pattern="\d{9}"
                  maxLength={9}
                  minLength={9}
                  required
                  placeholder="901234567"
                  className="mt-0 w-full px-3 py-2 border border-gray-300 rounded-r focus:outline-none"
                />
              </div>
              <span className="text-xs text-gray-500">Masalan: 901234567</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Viloyat</label>
              <input
                type="text"
                name="region"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tuman</label>
              <input
                type="text"
                name="district"
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Qo‘shish
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  phone_number?: string;
  region?: string;
  district?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}