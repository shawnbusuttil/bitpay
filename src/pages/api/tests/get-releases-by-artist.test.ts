import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMocks } from 'node-mocks-http';

import getReleasesByArtist from '../get-releases-by-artist';
import { ERROR_500 } from '../config';

const mock = new MockAdapter(axios);

describe('getReleasesByArtist', () => {
 afterEach(() => {
   mock.reset();
 });

 it('returns releases and pagination when successful', async () => {
   const { req, res } = createMocks({
     method: 'GET',
     query: { artistId: '123', page: '1', limit: '5' }
   });

   const mockResponse = {
     releases: [{ id: 1, title: 'Album 1' }, { id: 2, title: 'Album 2' }],
     pagination: { page: 1, pages: 2, per_page: 5, items: 10 }
   };

   mock.onGet(/artists\/123\/releases/).reply(200, mockResponse);

   await getReleasesByArtist(req, res);

   expect(res._getStatusCode()).toBe(200);
   expect(JSON.parse(res._getData())).toEqual({
     releases: mockResponse.releases,
     pagination: mockResponse.pagination
   });
 });

 it('returns 500 on server error', async () => {
   const { req, res } = createMocks({
     method: 'GET',
     query: { artistId: '123' }
   });

   mock.onGet(/artists\/123\/releases/).networkError();

   await getReleasesByArtist(req, res);

   expect(res._getStatusCode()).toBe(500);
   expect(JSON.parse(res._getData())).toEqual({ error: ERROR_500 });
 });

 it('uses default page and limit when not provided', async () => {
   const { req, res } = createMocks({
     method: 'GET',
     query: { artistId: '123' }
   });

   const mockResponse = {
     releases: [{ id: 1, title: 'Album 1' }],
     pagination: { page: 1, pages: 1, per_page: 5, items: 1 }
   };

   mock.onGet(/artists\/123\/releases\?page=1&per_page=5/).reply(200, mockResponse);

   await getReleasesByArtist(req, res);

   expect(res._getStatusCode()).toBe(200);
   expect(JSON.parse(res._getData())).toEqual({
     releases: mockResponse.releases,
     pagination: mockResponse.pagination
   });
 });
});