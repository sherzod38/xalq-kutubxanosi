// // app/api/auth/logout/route.ts
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll().map(cookie => ({
//             name: cookie.name,
//             value: cookie.value,
//           }));
//         },
//         setAll() {
//           // Bo'sh qoldiriladi
//         },
//       },
//     }
//   );

//   await supabase.auth.signOut();

//   const response = NextResponse.json({ message: 'Logged out' });
//   response.cookies.delete('sb-access-token');
//   response.cookies.delete('sb-refresh-token');
//   return response;
// }