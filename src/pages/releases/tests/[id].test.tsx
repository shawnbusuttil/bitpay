import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';

import Release from '../[id]';
import useGetRelease from '../../../hooks/useGetRelease';

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('../../../hooks/useGetRelease', () => jest.fn());

describe('Release Page', () => {
 const mockRelease = {
   title: 'Test Album',
   thumb: 'test-image-url.png',
   year: 2020,
   released: '2020-01-01',
   artists_sort: 'Test Artist',
   genres: ['Rock', 'Pop'],
   community: { have: 100 }
 };

 beforeEach(() => {
   (useRouter as jest.Mock).mockReturnValue({ query: { id: '123' } });
 });

 it('renders loader when loading', () => {
   (useGetRelease as jest.Mock).mockReturnValue({ 
     isLoading: true, 
     release: undefined, 
     error: undefined 
   });

   render(<Release />);
   expect(screen.getAllByTestId('loader')[0]).toBeInTheDocument();
 });

 it('renders release details when data is available', () => {
   (useGetRelease as jest.Mock).mockReturnValue({ 
     isLoading: false, 
     release: mockRelease, 
     error: undefined 
   });

   render(<Release />);
   expect(screen.getByText('Test Album')).toBeInTheDocument();
   expect(screen.getByText('2020')).toBeInTheDocument();
   expect(screen.getByText('Test Artist')).toBeInTheDocument();
   expect(screen.getByText('Rock')).toBeInTheDocument();
   expect(screen.getByText('Pop')).toBeInTheDocument();
 });

 it('renders error message when error occurs', () => {
   (useGetRelease as jest.Mock).mockReturnValue({ 
     isLoading: false, 
     release: undefined, 
     error: 'Failed to get release' 
   });

   render(<Release />);
   expect(screen.getByText('Failed to get release')).toBeInTheDocument();
 });
});