import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get("user")?.value;
  // console.log("Role*****************", role)
  const protectedRoutes = ['/', '/transactions', '/analytics','/budgets', '/goals' , '/notifications', '/profile', '/recurring', '/spends']; 
  const publicRoutes = ['/signup', '/login'];
  const adminRoutes = ['/admin']

  const { pathname } = request.nextUrl;

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
  }

  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!token || role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

  }

  if (adminRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    if (!token || role === 'user') {
      return NextResponse.redirect(new URL('/', request.url));
    }

  }


  return NextResponse.next();
}

