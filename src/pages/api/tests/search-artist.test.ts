import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMocks } from 'node-mocks-http';

import searchForArtist from '../search-artist';
import { ERROR_404, ERROR_500 } from '../config';

const mock = new MockAdapter(axios);

describe('searchForArtist', () => {
  afterEach(() => {
    mock.reset();
  });

  it('returns matching artist when found', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { artist: 'Lady Gaga' }
    });

    mock.onGet(/database\/search/).reply(200, {
      results: [{ title: 'Lady Gaga', id: 1 }]
    });

    await searchForArtist(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ title: 'Lady Gaga', id: 1 });
  });

  it('returns 404 when no matching artist found', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { artist: 'Non-Existent Artist' }
    });

    mock.onGet(/database\/search/).reply(200, {
      results: [{ title: 'Different Artist', id: 2 }]
    });

    await searchForArtist(req, res);

    expect(JSON.parse(res._getData())).toEqual({ 
      error: ERROR_404, 
      message: 'No matching artists found.' 
    });
  });

  it('returns 500 on server error', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { artist: 'Some Artist' }
    });

    mock.onGet(/database\/search/).networkError();

    await searchForArtist(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({ error: ERROR_500 });
  });
});