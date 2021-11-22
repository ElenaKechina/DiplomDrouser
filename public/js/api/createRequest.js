/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {
  if (options.method === 'GET') {
    let url = options.url;

    if (options.data) {
      Object.keys(options.data).forEach((key, index) => {
        if (index === 0) {
          url += '?';
        } else {
          url += '&';
        }

        url += key + '=' + options.data[key];
      });
    }

    requestHTTP(url, options.callback);
  } else {
    const formData = new FormData();

    if (options.data) {
      Object.keys(options.data).forEach((key) => {
        formData.append(key, options.data[key]);
      });
    }

    requestHTTP(options.url, options.callback, options.method, formData);
  }
};

const requestHTTP = async (
  url,
  callback,
  method = 'GET',
  body = null,
  headers = {}
) => {
  try {
    let response = await fetch(url, {
      method,
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error(response.message || 'что то не так с запросом');
    }
    let result = await response.json();

    if (result.success) {
      callback(null, result);
    } else {
      console.error(result.error);
      callback(result, null);
    }
  } catch (err) {
    throw err;
  }
};
