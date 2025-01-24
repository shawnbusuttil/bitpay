import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';

import Home from '../page';
import useGetReleasesByArtist from '../../hooks/useGetReleasesByArtist';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn()
}));

jest.mock('../../hooks/useGetReleasesByArtist', () => jest.fn());

describe('Home Component', () => {
 const mockReleases = {
   releases: [
     { id: 1, title: 'Track 1', thumb: 'thumb1.jpg' },
     { id: 2, title: 'Track 2', thumb: 'thumb2.jpg' }
   ],
   pagination: { pages: 2 }
 };

 beforeEach(() => {
   (useRouter as jest.Mock).mockReturnValue({
     push: jest.fn()
   });

   (useSearchParams as jest.Mock).mockReturnValue({
     get: jest.fn().mockReturnValue(null)
   });

   (useGetReleasesByArtist as jest.Mock).mockReturnValue({
     releases: undefined,
     isLoading: false,
     error: undefined
   });
 });

 it('renders the search input', () => {
   render(<Home />);
   expect(screen.getByTestId('search-input')).toBeInTheDocument();
 });

 it('displays releases when available', () => {
   (useGetReleasesByArtist as jest.Mock).mockReturnValue({
     releases: mockReleases,
     isLoading: false,
     error: undefined
   });

   render(<Home />);
   expect(screen.getByText('Track 1')).toBeInTheDocument();
   expect(screen.getByText('Track 2')).toBeInTheDocument();
 });

 it('shows an error message when error occurs', () => {
   (useGetReleasesByArtist as jest.Mock).mockReturnValue({
     releases: undefined,
     isLoading: false,
     error: 'Artist not found.'
   });

   render(<Home />);
   expect(screen.getByText('Artist not found.')).toBeInTheDocument();
 });

 it('renders pagination when multiple pages exist', () => {
   (useGetReleasesByArtist as jest.Mock).mockReturnValue({
     releases: mockReleases,
     isLoading: false,
     error: undefined
   });

   render(<Home />);
   expect(screen.getByTestId('pagination')).toBeInTheDocument();
 });
});