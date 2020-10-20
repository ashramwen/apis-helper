import HttpHelper from '../HttpHelper';

const apiUrl = 'https://dev-inum-setting.yjtech.tw:55689/';

it('works with async/await', async () => {
  const http = new HttpHelper({ apiUrl });
  expect.assertions(1);
  const res = await http.callApi({
    withoutAuth: true,
    method: 'get',
    endpoint: `api/public/url?c=200,210,220,230`,
    headers: {
      'Access-Token': 'aaa',
    },
  });
  expect(res.status).toEqual(200);
});
