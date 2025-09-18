export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  
  // Films
  FILMS: {
    LIST: '/films',
    CREATE: '/films',
    DETAIL_BY_ID: (id) => `/films/${id}`,        // Admin: GET by ID
    DETAIL_BY_SLUG: (slug) => `/films/slug/${slug}`,  // Public: GET by slug
    UPDATE: (id) => `/films/${id}`,              // Admin: PATCH
    DELETE: (id) => `/films/${id}`,              // Admin: DELETE
    UPLOAD_POSTER: (id) => `/films/${id}/poster`
  },

  // Category
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    UPDATE: (id) => `/categories/${id}`,
    DELETE: (id) => `/categories/${id}`
  },
  
  // Cinemas
  CINEMAS: {
    LIST: '/cinemas',
    CREATE: '/cinemas',
    DETAIL_BY_ID: (id) => `/cinemas/${id}`,      // Admin: GET by ID
    DETAIL_BY_SLUG: (slug) => `/cinemas/slug/${slug}`, // Public: GET by slug
    UPDATE: (id) => `/cinemas/${id}`,
    DELETE: (id) => `/cinemas/${id}`,
    ROOMS: (id) => `/cinemas/${id}/rooms`
  },
  
  // Rooms
  ROOMS: {
    LIST: '/rooms',
    CREATE: '/rooms',
    DETAIL: (id) => `/rooms/${id}`,
    UPDATE: (id) => `/rooms/${id}`,
    DELETE: (id) => `/rooms/${id}`
  },

  // Show Times
  SHOW_TIMES: {
    LIST: '/show-times',
    CREATE: '/show-times',
    DETAIL: (id) => `/show-times/${id}`,
    UPDATE: (id) => `/show-times/${id}`,
    DELETE: (id) => `/show-times/${id}`,
    BY_CINEMA: (cinemaId) => `/show-times/cinema/${cinemaId}`,
    BY_FILM: (filmId) => `/show-times/film/${filmId}`
  },
  
  // Users
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    PROFILE: '/users/profile'
  },

  // Comments
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    DETAIL: (id) => `/comments/${id}`,
    UPDATE: (id) => `/comments/${id}`,
    DELETE: (id) => `/comments/${id}`,
    BY_FILM: (filmId) => `/comments/film/${filmId}`
  },

  // Promotions
  PROMOTIONS: {
    LIST: '/promotions',
    CREATE: '/promotions',
    DETAIL: (id) => `/promotions/${id}`,
    UPDATE: (id) => `/promotions/${id}`,
    DELETE: (id) => `/promotions/${id}`
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    UPDATE: (id) => `/orders/${id}`,
    DELETE: (id) => `/orders/${id}`,
    MY_ORDERS: '/orders/my-orders'
  },

  // Upload
  UPLOAD: {
    IMAGE: '/upload/image',
    VIDEO: '/upload/video'
  }
};