import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createMocks } from 'node-mocks-http';

import getRelease from '../get-release';
import { ERROR_400 } from '../config';

const mock = new MockAdapter(axios);

describe('getRelease', () => {
 afterEach(() => {
   mock.reset();
 });

 it('returns release details when successful', async () => {
   const { req, res } = createMocks({
     method: 'GET',
     query: { releaseId: '12345' }
   });

   const mockRelease = { 
     id: 12345, 
     title: 'Test Album', 
     artist: 'Test Artist' 
   };

   mock.onGet(/releases\/12345/).reply(200, mockRelease);

   await getRelease(req, res);

   expect(res._getStatusCode()).toBe(200);
   expect(JSON.parse(res._getData())).toEqual(mockRelease);
 });

 it('returns 400 on request error', async () => {
   const { req, res } = createMocks({
     method: 'GET',
     query: { releaseId: '12345' }
   });

   mock.onGet(/releases\/12345/).networkError();

   await getRelease(req, res);

   expect(res._getStatusCode()).toBe(400);
   expect(JSON.parse(res._getData())).toEqual({ 
     error: ERROR_400, 
     message: 'Bad request or invalid release.' 
   });
 });
});