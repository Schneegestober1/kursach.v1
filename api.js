const personalKey = "rustam-kholov";
const baseHost = "https://wedev-api.sky.pro";

export const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

import { getToken} from "./index.js";



export function getPosts({ token, userId }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      if (userId) {
        return data.posts.filter((post, index) => {
          return post.user.id == userId.userId ? post : '';
        });
      } else {
        return data.posts;
      }
    });
}

export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  }).then((data) => {
    return data.fileUrl;
  });
}

export function addLike(postIdImage) {
  return fetch(postsHost + '/' + postIdImage + '/like', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: getToken(),
    },
  })
  .then((response) => {
    return response.json();
  });
}

export function removeLike(postIdImage) {
  return fetch(postsHost + '/' + postIdImage + '/dislike', {
    method: 'POST',
    mode: 'cors',
    headers: {
      Authorization: getToken(),
    },
  })
  .then((response) => {
    return response.json();
  });
}