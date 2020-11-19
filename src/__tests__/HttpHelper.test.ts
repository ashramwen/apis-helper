import HttpHelper from '../HttpHelper';

const apiURL = 'https://dev-inum-setting.yjtech.tw:55689/';
// const apiURL = 'https://uat-setting.inum88.com:55689/api/hc';

const loading = (on: boolean) => {
  console.log('loading', on);
};

const refreshToken = () => {
  console.log('refreshToken');
};

jest.useFakeTimers();

describe('Test HttpHelper', () => {
  const httpConfig = { baseURL: apiURL, refreshToken };

  it('works with async/await', async () => {
    expect.assertions(1);
    const http = new HttpHelper(httpConfig);
    const res = await http.callApi({
      method: 'get',
      endpoint: `api/public/url?c=200,210,220,230`,
      headers: {
        'Access-Token': 'aaa',
      },
      withoutAuth: true,
      loading: true,
    });

    expect(res.status).toEqual(200);
  });

  it('works with async/await', () => {
    const http = new HttpHelper(httpConfig);
    http.refreshTimer = 1000;
    expect(setTimeout).toHaveBeenCalledTimes(1);
  });
});
